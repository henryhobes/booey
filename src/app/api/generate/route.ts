import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getUseCaseById, validateRequiredAnswers } from '@/lib/use-cases';
import { generateResult } from '@/lib/ai/claude';
import { createClient } from '@/lib/supabase/server';
import { GenerateRequestSchema } from '@/lib/validation';
import { checkRateLimit, incrementUsage } from '@/lib/rate-limit';
import { isEmergencyStopped, checkBudget, recordSpend } from '@/lib/budget';
import { Citation } from '@/types';

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export async function POST(request: NextRequest) {
  try {
    // Kill switch — immediate shutoff
    if (isEmergencyStopped()) {
      return NextResponse.json(
        { error: 'Service is temporarily under maintenance. Please try again later.' },
        { status: 503 }
      );
    }

    // Budget check — daily spend cap
    const budget = await checkBudget();
    if (!budget.allowed) {
      return NextResponse.json(
        {
          error: 'Daily budget exceeded. Service will resume tomorrow.',
          budgetExceeded: true,
          spent: budget.spent,
          limit: budget.limit,
        },
        { status: 429 }
      );
    }
    // Parse JSON and handle malformed requests
    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    // Validate request body with Zod
    const validation = GenerateRequestSchema.safeParse(rawBody);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { useCaseId, answers, refinement } = validation.data;

    // Validate use case exists
    const useCase = getUseCaseById(useCaseId);
    if (!useCase) {
      return NextResponse.json(
        { error: 'Use case not found' },
        { status: 400 }
      );
    }

    // Validate required answers are present
    const missingFields = validateRequiredAnswers(useCase, answers);
    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: 'Missing required answers',
          missingFields
        },
        { status: 400 }
      );
    }

    // Check rate limits
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || 'guest';

    const limits = await checkRateLimit(userId);
    if (!limits.allowed) {
      const isMinuteLimit = limits.minuteRemaining <= 0;
      const message = isMinuteLimit
        ? 'Too many requests. Please wait a moment before trying again.'
        : "You've reached your daily limit of 20 interactions. Your quota resets on a rolling 24-hour basis.";

      return NextResponse.json(
        {
          error: message,
          rateLimited: true,
          dailyRemaining: limits.dailyRemaining,
          minuteRemaining: limits.minuteRemaining,
          resetAt: limits.resetAt,
        },
        { status: 429 }
      );
    }

    // Check response cache (only for non-refinement requests)
    const cacheKey = crypto
      .createHash('sha256')
      .update(`${useCaseId}:${JSON.stringify(answers)}${refinement ? `:refinement:${refinement}` : ''}`)
      .digest('hex');

    const { data: cached } = await supabase
      .from('response_cache')
      .select('result, citations')
      .eq('cache_key', cacheKey)
      .gte('created_at', new Date(Date.now() - CACHE_TTL_MS).toISOString())
      .single();

    if (cached) {
      console.log(`[Cache] HIT for ${useCaseId} key=${cacheKey.slice(0, 8)}`);
      return NextResponse.json({
        result: cached.result,
        citations: (cached.citations as Citation[]) ?? [],
        model: 'cache',
        inputTokens: 0,
        outputTokens: 0,
        cached: true,
      });
    }

    // Generate result using Claude
    const result = await generateResult(useCase, answers, refinement);

    // Cache the response (fire-and-forget, don't block response)
    supabase
      .from('response_cache')
      .upsert({
        cache_key: cacheKey,
        use_case_id: useCaseId,
        result: result.result,
        citations: result.citations,
      })
      .then(({ error }) => {
        if (error) console.error('[Cache] Failed to store:', error.message);
      });

    // Increment rate limit usage after successful generation
    await incrementUsage(userId);

    // Record cost for budget tracking
    await recordSpend(result.inputTokens, result.outputTokens, result.searchRequests);

    // Save session to database for authenticated users
    let sessionId: string | null = null;

    if (user) {
      // Save to database for authenticated users
      const { data: session, error } = await supabase
        .from('sessions')
        .insert({
          user_id: user.id,
          use_case_id: useCaseId,
          answers,
          result: result.result,
          model: result.model,
          input_tokens: result.inputTokens,
          output_tokens: result.outputTokens,
        })
        .select('id')
        .single();

      if (!error && session) {
        sessionId = session.id;
      }
    }

    return NextResponse.json({
      ...result,
      sessionId,
    });

  } catch (error) {
    console.error('Generate API error:', error);

    // Check for Anthropic API errors
    if (error && typeof error === 'object' && 'status' in error) {
      const apiError = error as { status?: number; message?: string };
      return NextResponse.json(
        { error: apiError.message || 'AI service error' },
        { status: apiError.status || 500 }
      );
    }

    // Generic error response
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

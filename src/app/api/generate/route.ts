import { NextRequest, NextResponse } from 'next/server';
import { getUseCaseById, validateRequiredAnswers } from '@/lib/use-cases';
import { generateResult } from '@/lib/ai/claude';
import { createClient } from '@/lib/supabase/server';
import { GenerateRequestSchema } from '@/lib/validation';
import { checkRateLimit, incrementUsage } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
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

    const { useCaseId, answers } = validation.data;
    
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
    
    // Generate result using Claude
    const result = await generateResult(useCase, answers);
    
    // Increment rate limit usage after successful generation
    await incrementUsage(userId);
    
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

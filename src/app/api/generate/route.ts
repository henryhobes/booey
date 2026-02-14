import { NextRequest, NextResponse } from 'next/server';
import { GenerateRequest } from '@/types';
import { getUseCaseById, validateRequiredAnswers } from '@/lib/use-cases';
import { generateResult } from '@/lib/ai/claude';

export async function POST(request: NextRequest) {
  try {
    // Parse JSON and handle malformed requests
    let body: GenerateRequest;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    
    const { useCaseId, answers } = body;
    
    // Validate request body structure
    if (!useCaseId || !answers || typeof answers !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request: useCaseId and answers are required' },
        { status: 400 }
      );
    }
    
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
    
    // Generate result using Claude
    const result = await generateResult(useCase, answers);
    
    return NextResponse.json(result);
    
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

import Anthropic from '@anthropic-ai/sdk';
import { UseCase, GenerateResponse } from '@/types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MODEL = 'claude-3-5-haiku-20241022';

/**
 * Format user answers into a clear, readable message for Claude
 */
function formatAnswersForPrompt(
  useCase: UseCase,
  answers: Record<string, string | string[] | number>,
  refinement?: string
): string {
  const lines: string[] = [];
  
  for (const question of useCase.questions) {
    const answer = answers[question.id];
    if (answer !== undefined && answer !== null && answer !== '') {
      const value = Array.isArray(answer) ? answer.join(', ') : String(answer);
      lines.push(`${question.label}: ${value}`);
    }
  }
  
  if (refinement) {
    lines.push('');
    lines.push('---');
    lines.push('');
    lines.push(`Please refine the response with the following adjustment: ${refinement}`);
  }
  
  return lines.join('\n\n');
}

/**
 * Generate AI result using Claude API
 * @param useCase - The use case containing the system prompt
 * @param answers - User's answers to the questions
 * @param refinement - Optional refinement instruction to modify the output
 * @returns Generated result with token usage
 */
export async function generateResult(
  useCase: UseCase,
  answers: Record<string, string | string[] | number>,
  refinement?: string
): Promise<GenerateResponse> {
  const userMessage = formatAnswersForPrompt(useCase, answers, refinement);
  
  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 2048,
    system: [
      {
        type: 'text',
        text: useCase.systemPrompt,
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: [
      {
        role: 'user',
        content: userMessage,
      },
    ],
  });
  
  // Extract text from response
  const textContent = response.content.find((block) => block.type === 'text');
  const result = textContent && 'text' in textContent ? textContent.text : '';
  
  // Log cache performance
  const cacheCreationTokens = response.usage.cache_creation_input_tokens || 0;
  const cacheReadTokens = response.usage.cache_read_input_tokens || 0;
  if (cacheCreationTokens > 0 || cacheReadTokens > 0) {
    console.log(
      `[Claude Cache] created=${cacheCreationTokens} read=${cacheReadTokens} input=${response.usage.input_tokens}`
    );
  }
  
  return {
    result,
    model: MODEL,
    inputTokens: response.usage.input_tokens,
    outputTokens: response.usage.output_tokens,
  };
}

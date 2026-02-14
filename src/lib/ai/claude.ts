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
  answers: Record<string, any>
): string {
  const lines: string[] = [];
  
  for (const question of useCase.questions) {
    const answer = answers[question.id];
    if (answer !== undefined && answer !== null && answer !== '') {
      const value = Array.isArray(answer) ? answer.join(', ') : String(answer);
      lines.push(`${question.label}: ${value}`);
    }
  }
  
  return lines.join('\n\n');
}

/**
 * Generate AI result using Claude API
 * @param useCase - The use case containing the system prompt
 * @param answers - User's answers to the questions
 * @returns Generated result with token usage
 */
export async function generateResult(
  useCase: UseCase,
  answers: Record<string, any>
): Promise<GenerateResponse> {
  const userMessage = formatAnswersForPrompt(useCase, answers);
  
  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 2048,
    system: useCase.systemPrompt,
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
  
  return {
    result,
    model: MODEL,
    inputTokens: response.usage.input_tokens,
    outputTokens: response.usage.output_tokens,
  };
}

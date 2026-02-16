import Anthropic from '@anthropic-ai/sdk';
import { UseCase, GenerateResponse, Citation } from '@/types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MODEL = 'claude-sonnet-4-5-20250929';
const MAX_SEARCH_USES = 3;

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
 * Extract text and citations from Claude's response content blocks.
 * Text blocks with citations get their text concatenated normally;
 * unique citations are collected for display as a sources section.
 */
function extractTextAndCitations(content: Anthropic.Messages.ContentBlock[]): {
  text: string;
  citations: Citation[];
} {
  let text = '';
  const citationMap = new Map<string, Citation>();

  for (const block of content) {
    if (block.type === 'text') {
      text += block.text;

      if (block.citations) {
        for (const citation of block.citations) {
          if (
            citation.type === 'web_search_result_location' &&
            !citationMap.has(citation.url)
          ) {
            citationMap.set(citation.url, {
              url: citation.url,
              title: citation.title,
              citedText: citation.cited_text,
            });
          }
        }
      }
    }
  }

  return { text, citations: Array.from(citationMap.values()) };
}

/**
 * Generate AI result using Claude API with web search
 * @param useCase - The use case containing the system prompt
 * @param answers - User's answers to the questions
 * @param refinement - Optional refinement instruction to modify the output
 * @returns Generated result with token usage and citations
 */
export async function generateResult(
  useCase: UseCase,
  answers: Record<string, string | string[] | number>,
  refinement?: string
): Promise<GenerateResponse> {
  const userMessage = formatAnswersForPrompt(useCase, answers, refinement);

  let response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 4096,
    system: [
      {
        type: 'text',
        text: useCase.systemPrompt + '\n\nIMPORTANT: Always format your response using proper Markdown. Use headings (##), bullet lists (- item), numbered lists (1. item), and **bold** for emphasis. Never use unicode bullets (•) or emoji as list markers. Each list item must be on its own line.',
        cache_control: { type: 'ephemeral' },
      },
    ],
    tools: [
      {
        type: 'web_search_20250305',
        name: 'web_search',
        max_uses: MAX_SEARCH_USES,
      },
    ],
    messages: [
      {
        role: 'user',
        content: userMessage,
      },
    ],
  });

  // Handle pause_turn: Claude may pause mid-search and need continuation
  while (response.stop_reason === 'pause_turn') {
    response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 4096,
      system: [
        {
          type: 'text',
          text: useCase.systemPrompt + '\n\nIMPORTANT: Always format your response using proper Markdown. Use headings (##), bullet lists (- item), numbered lists (1. item), and **bold** for emphasis. Never use unicode bullets (•) or emoji as list markers. Each list item must be on its own line.',
          cache_control: { type: 'ephemeral' },
        },
      ],
      tools: [
        {
          type: 'web_search_20250305',
          name: 'web_search',
          max_uses: MAX_SEARCH_USES,
        },
      ],
      messages: [
        {
          role: 'user',
          content: userMessage,
        },
        {
          role: 'assistant',
          content: response.content,
        },
      ],
    });
  }

  const { text: result, citations } = extractTextAndCitations(response.content);

  // Log cache performance
  const cacheCreationTokens = response.usage.cache_creation_input_tokens || 0;
  const cacheReadTokens = response.usage.cache_read_input_tokens || 0;
  if (cacheCreationTokens > 0 || cacheReadTokens > 0) {
    console.log(
      `[Claude Cache] created=${cacheCreationTokens} read=${cacheReadTokens} input=${response.usage.input_tokens}`
    );
  }

  // Log web search usage
  const searchRequests = response.usage.server_tool_use?.web_search_requests ?? 0;
  if (searchRequests > 0) {
    console.log(
      `[Web Search] requests=${searchRequests} citations=${citations.length}`
    );
  }

  return {
    result,
    citations,
    model: MODEL,
    inputTokens: response.usage.input_tokens,
    outputTokens: response.usage.output_tokens,
  };
}

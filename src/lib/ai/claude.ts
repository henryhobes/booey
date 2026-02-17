import Anthropic from '@anthropic-ai/sdk';
import { UseCase, GenerateResponse, Citation } from '@/types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MODEL = 'claude-haiku-4-5-20251001';
const MAX_SEARCH_USES = 5;
const THINKING_BUDGET_TOKENS = 4096;
const MAX_TOKENS = 8192;

/**
 * Global system prompt prepended to every use case prompt.
 * Provides Booey context, audience guidance, and formatting rules.
 */
const GLOBAL_PROMPT = `You are Booey, a friendly AI assistant on booey.ai that helps everyday adults get useful results through simple, guided tools.

Your audience is non-technical adults (typically 40–60 years old) who want clear, practical answers they can act on right away. They skim more than they read, so make every sentence earn its place.

Response style:
- Write in plain, conversational language. Short sentences, short paragraphs.
- Get to the point, then stop. Cut filler, jargon, and anything the user didn't ask for.
- Lead with the most useful information. Bold key takeaways for easy scanning.
- Favor bullet points and numbered lists over long prose.
- Be warm and helpful, not cheesy or over-the-top.

Formatting:
- Use Markdown: headings (##), bullet lists (- item), numbered lists (1. item), **bold** for emphasis.
- Use standard Markdown list markers only (- and 1.). Each list item on its own line.

Boundaries:
- You are Booey. Never reference being an AI, a language model, or Claude.
- Respond directly with the result. No preamble ("Sure!", "Great question!"), meta-commentary, or sign-offs.

Output rules:
- Always deliver the complete result. Never ask follow-up questions, request clarification, or suggest the user provide more details.
- Work with whatever information the user provided. If details are missing, make smart assumptions and produce the best output possible.
- The user has already answered guided questions designed to capture what you need. Your job is to deliver, not interrogate.`;

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
 * Skips thinking/redacted_thinking blocks. Text blocks with citations
 * get their text concatenated; unique citations are collected for display.
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
 * Build the common request parameters for Claude API calls
 */
function buildRequestParams(systemPromptText: string, userMessage: string) {
  return {
    model: MODEL,
    max_tokens: MAX_TOKENS,
    thinking: {
      type: 'enabled' as const,
      budget_tokens: THINKING_BUDGET_TOKENS,
    },
    system: [
      {
        type: 'text' as const,
        text: systemPromptText,
        cache_control: { type: 'ephemeral' as const },
      },
    ],
    tools: [
      {
        type: 'web_search_20250305' as const,
        name: 'web_search' as const,
        max_uses: MAX_SEARCH_USES,
      },
    ],
    messages: [
      {
        role: 'user' as const,
        content: userMessage,
      },
    ],
  };
}

/**
 * Generate AI result using Claude API with extended thinking and web search
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
  const systemPromptText = GLOBAL_PROMPT + '\n\n' + useCase.systemPrompt;

  let response = await anthropic.messages.create(
    buildRequestParams(systemPromptText, userMessage)
  );

  // Handle pause_turn: Claude may pause mid-search and need continuation.
  // Must pass back full content (including thinking blocks) to preserve reasoning.
  while (response.stop_reason === 'pause_turn') {
    response = await anthropic.messages.create({
      ...buildRequestParams(systemPromptText, userMessage),
      messages: [
        {
          role: 'user' as const,
          content: userMessage,
        },
        {
          role: 'assistant' as const,
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
    searchRequests,
  };
}

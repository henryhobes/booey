# Task 0008: Fix AI response markdown formatting

## Bug
AI responses render bullet points inline (e.g., `✅ Be specific ✅ Explain clearly`) instead of as proper list items. The Result component uses ReactMarkdown + remarkGfm + prose classes, which work correctly — the issue is Claude Haiku outputting unicode bullets (•) and emoji bullets (✅) inline instead of proper markdown syntax.

## Fix
In `src/lib/ai/claude.ts`, prepend a formatting instruction to the system prompt. In the `generateResult` function, modify the system message to include a formatting suffix.

Change the system array in the `anthropic.messages.create` call:
```ts
system: [
  {
    type: 'text',
    text: useCase.systemPrompt + '\n\nIMPORTANT: Always format your response using proper Markdown. Use headings (##), bullet lists (- item), numbered lists (1. item), and **bold** for emphasis. Never use unicode bullets (•) or emoji as list markers. Each list item must be on its own line.',
    cache_control: { type: 'ephemeral' },
  },
],
```

## Files
- `src/lib/ai/claude.ts`

## Testing
- Run a use case through the wizard and verify the result has proper headings, bullet lists on separate lines, and no inline bullet runs

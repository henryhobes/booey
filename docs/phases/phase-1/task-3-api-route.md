# Task 3: Claude API Route + Use Case Loader

**PR:** #2 (closed — changes landed via PR #1 squash + cherry-pick)
**Branch:** `phase-1/api-generate`
**Agent:** booey-phase1-api (Sonnet)
**Runtime:** ~8 min

## Spec
- Use case loader with type-safe access to JSON catalog
- Claude Haiku wrapper with formatted prompts
- POST /api/generate endpoint with validation

## What Was Built
- `src/lib/use-cases.ts` — getAllUseCases(), getUseCaseById(), validateRequiredAnswers()
- `src/lib/ai/claude.ts` — Anthropic SDK wrapper, formatAnswersForPrompt(), generateResult()
- `src/app/api/generate/route.ts` — POST endpoint with JSON parsing, body validation, error handling
- `src/data/use-cases.json` — 19 curated use cases (from separate curation agent)
- `.env.local` — ANTHROPIC_API_KEY (gitignored)

## Codex Review
- **Cycle 1:** Empty arrays for required multiselect, missing body validation → fixed
- **Cycle 2:** @anthropic-ai/sdk not in package.json → fixed
- **Cycle 3:** Malformed JSON → 500 instead of 400 → fixed

## Learnings
- `npm install` doesn't always persist to package.json in all environments — always verify dependency is in package.json after install
- PR was closed (not merged) because it shared commit history with PR #1. Squash merge of PR #1 already included the API route code. Only the JSON parsing fix needed cherry-picking.
- **Key takeaway:** Parallel agents must use separate git worktrees to avoid shared branch history

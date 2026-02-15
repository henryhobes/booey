# Task 0004: Convert Use Case Files from JSON to YAML

## Problem
Use case JSON files have multi-line `systemPrompt` strings that are unreadable (`\n\n1. The modified recipe...`). JSON doesn't support comments, multi-line strings, or clean nested structures for content-heavy files.

## Solution
Convert all 19 `.json` use case files to `.yaml` format:
- `systemPrompt` uses YAML block scalars (`|`) for natural multi-line
- Questions are readable block sequences
- Comments supported for editorial notes
- Adding a use case feels like writing a doc, not editing code

## Changes
1. Install `js-yaml` + `@types/js-yaml`
2. Convert 19 `.json` → `.yaml` files (same content, better format)
3. Update `src/data/use-cases/index.ts` to parse YAML via `fs.readFileSync` + `js-yaml` (server-side build time)
4. Delete old `.json` use case files
5. Validate through existing Zod schema

## Acceptance Criteria
- [ ] All 19 use cases are `.yaml` files
- [ ] `systemPrompt` uses block scalar (`|`) format
- [ ] `index.ts` loads and parses YAML files
- [ ] Zod validation still runs on load
- [ ] `getAllUseCases()` returns identical data
- [ ] `npm run build` and `npm run lint` pass
- [ ] No user-facing changes

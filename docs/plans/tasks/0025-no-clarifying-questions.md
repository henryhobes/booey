# Task 0025: No Clarifying Questions in AI Output

## Problem
When users complete the wizard and get their AI result, Claude sometimes asks clarifying questions instead of generating the output. The user has already answered all the guided questions — Claude should always produce the best possible output with what it has.

## Solution
Add an "Output rules" section to the `GLOBAL_PROMPT` constant in `src/lib/ai/claude.ts` that explicitly instructs Claude to never ask follow-up questions and always deliver complete output.

## Acceptance Criteria
- [ ] `GLOBAL_PROMPT` includes directive to never ask clarifying questions
- [ ] Directive placed after the "Boundaries" section
- [ ] `npm run build` passes
- [ ] PR opened for review

---
name: use-case-prompt
description: Read the use case prompt template before creating or updating any use case systemPrompt
allowed-tools: Read, Glob, Grep
argument-hint: "[create|update] <use-case-name>"
---

Before writing or modifying any `systemPrompt` field in a use case YAML file, you MUST read the prompt template guide.

## 1. Read the template

Read `docs/USE-CASE-PROMPT-TEMPLATE.md` in full. This contains:
- The standard template structure (role + provide list + behavioral guidance)
- Quality standards and best practices
- Anti-patterns to avoid
- A pre-merge checklist

## 2. Read the global prompt

Read the `GLOBAL_PROMPT` constant in `src/lib/ai/claude.ts` so you know what is already handled at runtime and avoid duplicating it.

## 3. Review existing examples

Read 2-3 existing YAML files in `src/data/use-cases/` to see the established patterns in action. Good examples:
- `bill-negotiation.yaml` — strong role, actionable output items
- `exercise-plan.yaml` — good behavioral guidance, handles edge cases
- `tech-explainer.yaml` — adapts to user input level

## 4. Write or update the prompt

Follow the template structure exactly:
1. Specific expert role with qualifying phrase
2. Numbered "Provide:" list (3-6 items, most valuable first)
3. 1-2 sentences of behavioral guidance

## 5. Run the checklist

Before committing, verify every item in the checklist at the bottom of `docs/USE-CASE-PROMPT-TEMPLATE.md`.

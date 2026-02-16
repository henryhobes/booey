# CLAUDE.md

Entry point for coding agents. This is a map — dig into linked docs for details.

## Quick Start

```bash
npm install          # Install dependencies
npm run dev          # Dev server (localhost:3000)
npm run build        # Production build (MUST pass before PR merge)
npm run lint         # ESLint
```

## Pre-Push Checklist (MANDATORY)

Before pushing ANY code, run all checks:

```bash
npm run lint && npm run typecheck && npm run build && npm test
```

Do NOT push code that fails any of these. Fix errors locally first. This prevents CI failures and wasted review cycles.

## What Is This?

**Booey** (booey.ai) — guided AI tools for non-technical adults (40-60 year olds). Wizard-based UI, not chat. Users browse use cases → answer guided questions → get AI results.

→ Full product context: `docs/OVERVIEW.md`

## Architecture

Next.js 14 (App Router) + TypeScript + Tailwind + DaisyUI + Supabase + Claude API + Vercel + Upstash Redis

```
src/
├── app/           # Pages + API routes
├── components/    # UI components (landing/, wizard/, nav/, auth/)
├── hooks/         # React hooks (useUser, useTryBeforeSignup)
├── lib/           # Core logic (ai/, supabase/, utils/, validation, rate-limit, budget)
├── data/          # Static use case catalog (use-cases.json)
├── styles/        # Color tokens
└── types/         # Shared TypeScript types
```

→ Full architecture + schema: `docs/ARCHITECTURE.md`

## Code Conventions

Import boundaries enforced by linting:

```
types/ → lib/ → hooks/ → components/ → app/
           ↑ no reverse imports allowed ↓
```

- Zod for runtime validation. Strict TypeScript (no `any`). Mobile-first styling.
- 48px min touch targets. 16px min font. WCAG 2.1 AA contrast.
- Commit format: `feat:` / `fix:` / `refactor:` / `docs:` / `chore:`

→ Full conventions: `docs/CONVENTIONS.md`

## Key Decisions

| Decision | Doc |
|----------|-----|
| Wizard UI, not chat | `docs/decisions/001-wizard-not-chat.md` |
| Hardcoded JSON use cases | `docs/decisions/002-hardcoded-json-use-cases.md` |
| Try before signup | `docs/decisions/003-try-before-signup.md` |
| Google OAuth (not magic links) | `docs/decisions/004-google-oauth-over-magic-links.md` |
| Haiku as default model | `docs/decisions/005-haiku-default-model.md` |

## Use Case Prompts

When creating or updating a `systemPrompt` in any use case YAML file, you MUST read `docs/USE-CASE-PROMPT-TEMPLATE.md` first. It contains the standard template, quality standards, best practices, and a pre-merge checklist. Use the `/use-case-prompt` skill to be guided through the process.

## Where to Look

| Need to understand... | Read |
|----------------------|------|
| Product context, target users | `docs/OVERVIEW.md` |
| Tech stack, DB schema, structure | `docs/ARCHITECTURE.md` |
| Code patterns, naming, imports | `docs/CONVENTIONS.md` |
| Use case prompt writing guide | `docs/USE-CASE-PROMPT-TEMPLATE.md` |
| Current quality per domain | `docs/QUALITY.md` |
| Known technical debt | `docs/TECH-DEBT.md` |
| Testing & QA strategy | `docs/TESTING.md` |
| Cost controls & projections | `docs/COST-MODEL.md` |
| Development workflow & roles | `docs/WORKFLOW.md` |
| Task spec template | `docs/TASK-TEMPLATE.md` |
| Supabase setup & production | `docs/infrastructure/SUPABASE.md` |
| Vercel deployment | `docs/infrastructure/VERCEL.md` |
| Deployment runbook | `DEPLOY.md` |
| Architectural decisions | `docs/decisions/` |
| Active work plans | `docs/plans/active/` |
| One-off tasks | `docs/plans/tasks/` |
| Historical docs & audits | `docs/archive/` |

## Workflow Summary

1. Agent gets task spec with acceptance criteria
2. Work in git worktree (`/booey-worktrees/<task>/`)
3. Implement → self-review → run ALL checks before committing:
   ```bash
   npm run lint && npm run typecheck && npm run build && npm test
   ```
   Fix ALL errors before pushing. Do NOT push code that fails any check.
4. Push branch → open PR using the `/create-pr` skill (do NOT manually run `gh pr create`)
5. Run `./scripts/wait-for-pr-approval.sh <pr-number>` — polls CI + Codex review
6. Fix CI failures and address Codex feedback (max 3 cycles)
7. Only signal completion when CI passes AND Codex approves
8. Frank merges to main → Vercel auto-deploys

→ Full workflow: `docs/WORKFLOW.md`
→ Task template: `docs/TASK-TEMPLATE.md`
→ PR approval script: `scripts/wait-for-pr-approval.sh`

## Security Invariants

- All secrets in env vars (never client-side)
- Supabase RLS on all tables
- API routes require valid session (middleware enforced)
- Rate limiting: 5/min per-IP, 20/day per-user
- Input validation: max 2000 chars, Zod schemas at boundaries
- CSP headers configured

→ Full security details: `docs/ARCHITECTURE.md` (Security Architecture section)

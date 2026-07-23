# CLAUDE.md

Entry point for coding agents. This is a map — dig into linked docs for details.

> **Archived project.** Booey (booey.ai) was a guided-AI web app built Feb–Apr 2026, shipped, and retired. The live Supabase and Vercel services are gone, so the app no longer runs against real backends. The verification bar is now `lint` + `typecheck` + `build` + `test` with placeholder env values. See the [README](README.md) for the full story.

## Quick Start

```bash
npm install          # Install dependencies
npm run dev          # Dev server (localhost:3000) — needs env vars in .env.local
npm run build        # Production build
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
npm test             # Vitest
```

Copy `.env.example` to `.env.local` first. Placeholder values are enough for `build`, `lint`, `typecheck`, and `test`.

## What Is This?

**Booey** — guided AI tools for non-technical adults (40–60 year olds). Wizard-based UI, not chat: users browse curated use cases → answer a few guided questions → get a personalized AI result.

→ Full product context: [`docs/OVERVIEW.md`](docs/OVERVIEW.md)

## Architecture

Next.js 16 (App Router) + TypeScript + Tailwind + DaisyUI + Supabase + Claude API + Vercel + Upstash Redis.

```
src/
├── app/           # Pages + API routes
├── components/    # UI components (wizard/, explore/, nav/, auth/)
├── hooks/         # React hooks (useUser, useTryBeforeSignup)
├── lib/           # Core logic (ai/, supabase/, utils/, validation, rate-limit, budget)
├── data/          # Use case catalog (use-cases/*.yaml + Zod schema)
└── types/         # Shared TypeScript types
```

→ Full architecture + schema: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)

## Code Conventions

Import boundaries enforced by linting:

```
types/ → lib/ → hooks/ → components/ → app/
           ↑ no reverse imports allowed ↓
```

- Zod for runtime validation. Strict TypeScript (no `any`). Mobile-first styling.
- 48px min touch targets. 16px min font. WCAG 2.1 AA contrast.
- Commit format: `feat:` / `fix:` / `refactor:` / `docs:` / `chore:`

→ Full conventions: [`docs/CONVENTIONS.md`](docs/CONVENTIONS.md)

## Key Decisions

| Decision | Doc |
|----------|-----|
| Wizard UI, not chat | [`docs/decisions/001-wizard-not-chat.md`](docs/decisions/001-wizard-not-chat.md) |
| Hardcoded catalog (YAML, not DB) | [`docs/decisions/002-hardcoded-json-use-cases.md`](docs/decisions/002-hardcoded-json-use-cases.md) |
| Try before signup | [`docs/decisions/003-try-before-signup.md`](docs/decisions/003-try-before-signup.md) |
| Google OAuth (not magic links) | [`docs/decisions/004-google-oauth-over-magic-links.md`](docs/decisions/004-google-oauth-over-magic-links.md) |
| Haiku as default model | [`docs/decisions/005-haiku-default-model.md`](docs/decisions/005-haiku-default-model.md) |

## Use Case Prompts

Each use case lives in `src/data/use-cases/<id>.yaml` with a `systemPrompt` field validated by `_schema.ts`. When writing or editing a `systemPrompt`, read [`docs/USE-CASE-PROMPT-TEMPLATE.md`](docs/USE-CASE-PROMPT-TEMPLATE.md) first — it covers the template, quality standards, and a pre-merge checklist.

## Where to Look

| Need to understand... | Read |
|----------------------|------|
| Product context, target users | [`docs/OVERVIEW.md`](docs/OVERVIEW.md) |
| Tech stack, DB schema, structure | [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) |
| Code patterns, naming, imports | [`docs/CONVENTIONS.md`](docs/CONVENTIONS.md) |
| Use case prompt writing guide | [`docs/USE-CASE-PROMPT-TEMPLATE.md`](docs/USE-CASE-PROMPT-TEMPLATE.md) |
| Cost controls & projections | [`docs/COST-MODEL.md`](docs/COST-MODEL.md) |
| Testing strategy | [`docs/TESTING.md`](docs/TESTING.md) |
| Supabase setup & production | [`docs/infrastructure/SUPABASE.md`](docs/infrastructure/SUPABASE.md) |
| Vercel deployment | [`docs/infrastructure/VERCEL.md`](docs/infrastructure/VERCEL.md) |
| Deployment runbook | [`DEPLOY.md`](DEPLOY.md) |
| Architectural decisions | [`docs/decisions/`](docs/decisions/) |
| Review guidelines | [`AGENTS.md`](AGENTS.md) |

## Security Invariants

- All secrets in env vars (never client-side; API keys never use the `NEXT_PUBLIC_` prefix)
- Supabase RLS on all tables
- API routes require a valid session (middleware enforced)
- Rate limiting: per-IP and per-user (Upstash Redis)
- Input validation: Zod schemas at all boundaries, max input length enforced
- CSP + security headers configured in `next.config.ts`

→ Full security details: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) (Security Architecture section)

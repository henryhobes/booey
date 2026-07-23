# Booey Documentation

Documentation for **Booey**, a retired guided-AI web app (booey.ai, 2026). Start with the [top-level README](../README.md) for the project story and architecture diagram, then dig in here.

## Product & Architecture

| Doc | What's inside |
|-----|---------------|
| [OVERVIEW.md](OVERVIEW.md) | What Booey is, who it was for, the product thesis |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Tech stack, project structure, DB schema, security architecture |
| [COST-MODEL.md](COST-MODEL.md) | API cost projections and the cost-protection design (budget cap, kill switch, alerts) |

## Engineering

| Doc | What's inside |
|-----|---------------|
| [CONVENTIONS.md](CONVENTIONS.md) | Naming, import boundaries, TypeScript/accessibility standards |
| [TESTING.md](TESTING.md) | Test coverage, the CI pipeline, and the target testing pyramid |
| [USE-CASE-PROMPT-TEMPLATE.md](USE-CASE-PROMPT-TEMPLATE.md) | How use-case `systemPrompt`s are written — template, standards, checklist |

## Decision Records (ADRs)

The "why" behind the load-bearing choices:

- [001 — Wizard UI, not chat](decisions/001-wizard-not-chat.md)
- [002 — Hardcoded catalog, not a database](decisions/002-hardcoded-json-use-cases.md)
- [003 — Try before signup](decisions/003-try-before-signup.md)
- [004 — Google OAuth over magic links](decisions/004-google-oauth-over-magic-links.md)
- [005 — Claude Haiku as the default model](decisions/005-haiku-default-model.md)

## Operations (archived)

Runbooks for the now-retired production services, kept as a record of how Booey was deployed and operated:

- [../DEPLOY.md](../DEPLOY.md) — deployment runbook, cost monitoring, kill switch
- [infrastructure/SUPABASE.md](infrastructure/SUPABASE.md) — RLS, auth, and database configuration
- [infrastructure/VERCEL.md](infrastructure/VERCEL.md) — hosting, env vars, preview deploys

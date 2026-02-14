# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Booey** (booey.ai) — AI tools for everyday people. A guided, wizard-based web app that makes AI accessible without requiring prompt engineering. Users browse curated use cases, answer simple questions, and get personalized AI-generated results.

**Target audience:** Non-technical adults (40-60 year olds) who know AI exists but don't know where to start.

**Target launch:** End of Presidents' Day weekend 2026 (Feb 14-17).

## Tech Stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS + DaisyUI
- **Database/Auth:** Supabase (PostgreSQL + magic link authentication)
- **AI:** Anthropic Claude API (Haiku default, Sonnet for complex use cases)
- **Hosting:** Vercel (auto-deploy from main branch)
- **Rate Limiting:** Upstash Redis

## Development Commands

Since this is a new project, standard Next.js commands will apply once initialized:

```bash
npm install          # Install dependencies
npm run dev          # Start development server (localhost:3000)
npm run build        # Production build (must pass before PR merge)
npm run lint         # Run ESLint
```

## Project Structure

```
booey/
├── app/                    # Next.js App Router
│   ├── (public)/          # Public pages (landing, browse use cases)
│   ├── (auth)/            # Auth pages (login, signup)
│   ├── (protected)/       # Authenticated pages (history, profile)
│   └── api/               # API routes (AI calls, auth callbacks)
├── components/
│   ├── ui/                # DaisyUI wrappers, design system components
│   ├── wizard/            # Progressive wizard/form flow components
│   └── browse/            # Use case browsing and filtering
├── data/
│   └── use-cases.json     # Static catalog (~15-20 curated use cases for MVP)
├── lib/
│   ├── supabase/          # DB client, queries, auth helpers
│   ├── ai/                # Claude API wrapper, prompt templates
│   └── utils/             # Shared utilities
├── types/
│   └── index.ts           # Shared TypeScript types
└── docs/                  # Project documentation (see below)
```

## Key Architecture Decisions

### Wizard UI, Not Chat
Use progressive wizard/form pattern instead of chat interface. Forms are:
- More familiar to target demographic
- Show clear progress ("Question 2 of 3")
- Feel like a tool, not a conversation
- Faster to build and better on mobile

### Use Cases as Static JSON
For MVP, use cases live in `/data/use-cases.json` (not database):
- Zero setup time, easy to version control
- Perfect for ~20 use cases
- Move to DB later when adding user-submitted use cases

### Try Before Signup
Users complete ONE use case without an account, then prompted to sign up to save results. Optimizes for "aha moment" before asking for commitment.

### Magic Links Over Passwords
Passwordless email authentication via Supabase Auth. Better UX for target demographic (40-60 year olds).

### Claude Haiku as Default
Haiku for most use cases (4-5x cheaper than Sonnet). Flag specific complex use cases for Sonnet individually.

## Database Schema

```sql
-- Users handled by Supabase Auth

-- Completed use case sessions
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  use_case_id TEXT NOT NULL,
  answers JSONB NOT NULL,          -- User answers to guided questions
  result TEXT NOT NULL,             -- AI-generated result
  model TEXT DEFAULT 'haiku',
  input_tokens INTEGER,
  output_tokens INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Usage tracking for cost control
CREATE TABLE usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  use_case_id TEXT NOT NULL,
  model TEXT NOT NULL,
  input_tokens INTEGER NOT NULL,
  output_tokens INTEGER NOT NULL,
  cost_usd DECIMAL(10,6),
  created_at TIMESTAMPTZ DEFAULT now()
);
```

## Development Workflow

### Team Roles
- **Henry (Product Owner):** Makes product/design decisions, reviews at phase checkpoints
- **Frank (Orchestrator):** Creates GitHub Issues, spawns coding agents, triggers reviews, manages pipeline
- **Claude Code Agents (Developers):** Implement tasks, submit PRs
- **Codex Agent (Reviewer):** Reviews PRs, approves or requests changes

### Task Lifecycle

1. Frank creates GitHub Issue with task description + acceptance criteria
2. Frank assigns Claude Code agent to task
3. Agent implements on feature branch (`phase-X/task-description`)
4. Agent submits PR with implementation notes + `Fixes #<issue>` (auto-links issue)
5. Codex reviews PR → approves or comments
6. If comments: agent addresses feedback and pushes updates
7. PR approved → merged to main
8. Frank decides if QA needed (browser testing for user-facing flows)
9. Frank spawns next available tasks based on dependency graph

### Git Workflow

- **Main branch:** `main` (always deployable)
- **Feature branches:** `phase-X/task-description` per task
- **PRs merge directly to main** (no integration branches)
- **Vercel auto-deploys** on every push to main
- **Commit conventions:** `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`

### PR Requirements

- TypeScript strict mode must pass
- `npm run build` must succeed
- Include implementation notes/spec in PR description
- Link issue with `Fixes #<issue>` in PR body
- Address all Codex review comments before merge

## Security & Cost Controls

### Authentication
- Supabase Auth with magic links (HTTP-only cookies, 7-day sessions)
- Middleware validates session on all `/api/*` routes

### Rate Limiting (Phase 4)
- Per-IP: 5 requests/min
- Per-user: 20 interactions/day
- Global circuit breaker if hourly spend exceeds $50

### Input Validation
- Max 2000 characters per input field
- Basic prompt injection pattern detection

### Cost Tracking
- Log all AI API calls to `usage_logs` table
- Hard spending cap in Anthropic dashboard ($500 initially)
- Per-user daily cost cap: $0.50/day

### API Protection
- All secrets in environment variables (never client-side)
- API routes require valid session
- Emergency maintenance mode toggle

## Build Phases

Reference `/docs/BUILD-PHASES.md` for detailed scope. Summary:

1. **Phase 1 (3h):** Core magic — one working use case end-to-end (no auth)
2. **Phase 2 (2h):** Auth + persistence (Supabase, magic links, history)
3. **Phase 3 (2h):** Browse + mobile (15-20 use cases, responsive design)
4. **Phase 4 (1h):** Security + deploy (rate limiting, cost tracking, production)
5. **Phase 5 (1-2h):** Polish (loading states, error handling, branding)

## Quality Gates

1. TypeScript strict mode enabled
2. Build validation (`npm run build` passes)
3. Codex code review approval
4. QA testing for user-facing flows (Frank's discretion)
5. Pre-deploy security checklist (Phase 4+)

## Scope Discipline

Every feature idea gets one question: **"Does this block the core demo?"**
- **YES:** Build now
- **NO:** Add to `/docs/BACKLOG.md`
- **MAYBE:** Can it be done in 15 minutes? If not, defer.

Frank has veto power on non-critical additions.

## Documentation

- `/docs/OVERVIEW.md` — Project vision and use case catalog
- `/docs/ARCHITECTURE.md` — Tech stack and design decisions
- `/docs/BUILD-PHASES.md` — Implementation roadmap (Phases 1-5)
- `/docs/WORKFLOW.md` — Team roles and task management
- `/docs/COST-MODEL.md` — API costs and projections

## Cost Model Quick Reference

- **Per-interaction cost (Haiku):** ~$0.004
- **Monthly cost projections:**
  - 100 active users × 3 interactions/day = $36/month
  - 500 active users × 5 interactions/day = $300/month
- **Controls:** Daily user cap (20), IP rate limiting, circuit breaker at $50/hour

# Booey — Architecture & Tech Stack

> **Archived.** This describes the architecture as built and shipped (Feb–Apr 2026). The live Supabase and Vercel services have since been retired.

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Framework** | Next.js 16 (App Router) | Best ecosystem, AI tool support, Vercel integration |
| **Styling** | Tailwind CSS + DaisyUI | Fast setup, pre-styled components, mobile-responsive out of box |
| **Auth** | Supabase Auth (Google OAuth) | One-tap sign-in = better for target demographic, fast to implement |
| **Database** | Supabase (PostgreSQL) | Auth + DB in one platform, generous free tier (50k MAU) |
| **AI Backend** | Anthropic Claude (Haiku for most, Sonnet for complex) | Cost-effective for guided use cases |
| **Hosting** | Vercel | Zero-config Next.js deployment, edge functions, auto-deploy from GitHub |
| **Rate Limiting** | Upstash Redis | Serverless, free tier, per-user and per-IP limiting |

## Key Design Decisions

### Wizard UI, Not Chat
The guided flow uses a progressive wizard/form pattern instead of a chat interface. This was a deliberate choice:
- Forms are familiar to everyone (less intimidating than "what do I type?")
- Shows progress ("Question 2 of 3")
- Feels like a tool, not like talking to a robot
- Faster to build, works better on mobile

### Use Cases as Hardcoded Files
Use cases live as static files (`src/data/use-cases/*.yaml`), one YAML file per use case, validated by a Zod schema (`_schema.ts`) — not the database. Reasons:
- Zero setup time
- Easy to edit and version control (one readable file per use case)
- No DB migrations needed for catalog changes
- Perfect for ~20 use cases
- Move to DB later when we want user-submitted use cases

> The catalog started as a single `use-cases.json` and was later split into per-use-case YAML files with a shared schema for readability and safer edits.

### Try Before Signup
Users can complete ONE use case without creating an account. After seeing their first result, they're prompted to sign up to save it. This optimizes for the "aha moment" before asking for commitment.

### Google OAuth Over Passwords
Target users (40-60 year olds) struggle with passwords. Google OAuth (one-tap sign-in) is:
- Familiar — most users already have a Google account
- Easier to use — no passwords to remember
- More secure — no password database to protect
- Better conversion rates
- See `docs/decisions/004-google-oauth-over-magic-links.md` for the full rationale

### Claude Haiku as Default Model
For guided use cases with structured prompts, Haiku delivers good-enough quality at 4-5x less cost than Sonnet. Specific complex use cases can be flagged for Sonnet individually.

## Project Structure

```
booey/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes (AI, auth callbacks)
│   ├── auth/              # Auth pages (login, callback)
│   ├── explore/           # Use case browsing
│   ├── history/           # Saved results
│   ├── use/               # Wizard flow (use a use case)
│   ├── privacy/           # Privacy policy
│   └── terms/             # Terms of service
├── components/
│   ├── auth/              # Auth-related components
│   ├── explore/           # Use case browsing components
│   ├── nav/               # Navigation components
│   └── wizard/            # Guided flow components (incl. per-type question inputs)
├── data/
│   └── use-cases/         # Static use case catalog (*.yaml + _schema.ts)
├── lib/
│   ├── supabase/          # DB client, queries, auth helpers
│   ├── ai/                # Claude API wrapper, prompt templates
│   ├── budget.ts          # Daily cost cap + kill switch + ntfy alerts
│   ├── rate-limit.ts      # Per-IP / per-user limiting (Upstash Redis)
│   └── utils/             # Shared utilities
├── types/
│   └── index.ts           # Shared TypeScript types
└── docs/                  # Project documentation
```

## Database Schema (MVP)

```sql
-- Users handled by Supabase Auth

-- User sessions (completed use cases)
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  use_case_id TEXT NOT NULL,
  answers JSONB NOT NULL,          -- User's answers to guided questions
  result TEXT NOT NULL,             -- AI-generated result
  model TEXT DEFAULT 'haiku',       -- Which model was used
  input_tokens INTEGER,
  output_tokens INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Usage tracking (for cost control)
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

-- Response cache (identical use case + answers → cached result)
CREATE TABLE response_cache (
  cache_key TEXT PRIMARY KEY,
  use_case_id TEXT NOT NULL,
  result TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()   -- time-based TTL cleanup
);
```

Row Level Security is enabled on all user-scoped tables (`users`, `sessions`) with per-user isolation policies using the `(select auth.uid())` pattern; `response_cache` is service-role only. See `supabase/migrations/` for the full policy set.

## Security Architecture

- **Authentication:** Supabase Auth with Google OAuth (HTTP-only cookies, 7-day sessions)
- **API Protection:** Middleware validates session on all `/api/*` routes
- **Rate Limiting:** Multi-layer (per-IP: 5/min, per-user: 20/day, global circuit breaker)
- **Cost Control:** Hard spending cap in Anthropic dashboard + per-user daily interaction limit
- **Input Sanitization:** Max 2000 char input, basic prompt injection pattern detection
- **Environment:** All secrets in env vars, never client-side

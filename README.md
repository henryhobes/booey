# 🔵 Booey

**AI tools for everyday people.** No blank chatbot. No prompt engineering. Just guided tools that work.

Booey shows you what AI can do — browse curated use cases, answer a few simple questions, and get a personalized result. Built for people who know AI exists but don't know where to start.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 📚 Documentation

- [Project Overview](docs/OVERVIEW.md) — What Booey is and who it's for
- [Architecture](docs/ARCHITECTURE.md) — Tech stack, design decisions, project structure
- [Build Phases](docs/BUILD-PHASES.md) — Implementation roadmap
- [Workflow](docs/WORKFLOW.md) — How development is managed
- [Cost Model](docs/COST-MODEL.md) — API costs, projections, and controls

## 🛠 Tech Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** + DaisyUI
- **Supabase** (PostgreSQL + Auth)
- **Claude API** (Anthropic)
- **Vercel** (Hosting)

## 🔐 Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

**Required:**
- `NEXT_PUBLIC_SUPABASE_URL` — Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — Your Supabase anon/publishable key (safe to expose)
- `ANTHROPIC_API_KEY` — Your Claude API key (**server-only, never expose**)

**Optional (Phase 4+):**
- `UPSTASH_REDIS_REST_URL` — Upstash Redis URL for rate limiting
- `UPSTASH_REDIS_REST_TOKEN` — Upstash Redis token

> ⚠️ **Security:** Never commit `.env.local`. API keys must never use the `NEXT_PUBLIC_` prefix — that exposes them to the browser.

## 🚢 Deployment

See [DEPLOY.md](DEPLOY.md) for the full deployment checklist and troubleshooting guide.

Booey is designed for [Vercel](https://vercel.com). Push to `main` and Vercel auto-deploys.

## 📄 License

MIT

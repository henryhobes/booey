# Booey.ai Tech Stack Analysis
**Date:** February 14, 2026  
**Constraint:** One-day build (~8-10 hours) by one developer with AI coding assistance  
**Target:** Non-technical users (40-60 year olds)  
**Requirements:** Production-ready, mobile-responsive, user accounts, secure, free (owner eats API costs)

---

## Executive Summary

**RECOMMENDED STACK:**
- **Framework:** Next.js 14 (App Router) ✅
- **Backend/Auth:** Supabase ✅
- **UI Library:** DaisyUI (⚠️ swap from shadcn/ui)
- **AI API:** OpenAI GPT-4o (⚠️ swap from Claude)
- **Hosting:** Vercel ✅

**Key Changes from Initial Plan:**
1. **DaisyUI instead of shadcn/ui** - Faster setup, pre-styled components
2. **OpenAI instead of Claude** - Lower cost at scale, comparable quality for guided chat

---

## 1. Backend + Auth Analysis

### Supabase ✅ RECOMMENDED
**Pros:**
- **Best for one-day build:** Auth + database in single platform
- **Zero config auth:** Email/password, OAuth providers out of box
- **PostgreSQL:** Familiar, reliable, good for user accounts + use case data
- **Free tier:** 50,000 monthly active users (perfect for MVP)
- **Row-level security:** Built-in data isolation between users
- **Real-time ready:** If you want live chat features later

**Cons:**
- Auth UI requires customization (but still faster than Auth.js)
- Slightly slower real-time than Firebase/Convex

**Time to Auth:** ~30-45 minutes

---

### Firebase
**Pros:**
- Mature ecosystem, lots of tutorials
- Excellent real-time capabilities
- Strong mobile SDKs

**Cons:**
- NoSQL (Firestore) - overkill for this app's simple data model
- Auth UI SDK hasn't been updated in years (noted in research)
- Less developer-friendly for web-first apps
- Vendor lock-in to Google Cloud

**Verdict:** ❌ NoSQL adds complexity you don't need. Supabase's SQL is simpler for user accounts + use case catalog.

---

### Clerk + Prisma
**Pros:**
- **Clerk:** Beautiful pre-built auth UI, fastest auth setup (5-10 min)
- **Clerk:** User management dashboard is excellent
- Prisma provides great TypeScript DX

**Cons:**
- **Two separate services** = more complexity
- **Clerk pricing:** Free tier only 10,000 MAU (vs Supabase 50k)
- Need to sync Clerk users to your DB manually
- Adds ~1-2 hours vs Supabase's unified approach

**Verdict:** ❌ Too much integration overhead for a one-day build. Save Clerk for when you need premium auth features.

---

### Auth.js + SQLite
**Pros:**
- Full control, zero vendor lock-in
- SQLite = simple, portable

**Cons:**
- **4-6 hours just for auth setup** (callbacks, sessions, providers)
- No built-in user management UI
- SQLite limits scaling (no concurrent writes)
- You'll rebuild what Supabase gives free

**Verdict:** ❌ Not feasible for one-day timeline.

---

### Convex
**Pros:**
- Best real-time experience (beats Firebase/Supabase)
- Functions-as-backend model is elegant
- TypeScript-first, great DX

**Cons:**
- **Learning curve:** Unfamiliar paradigm (not REST/SQL)
- **Auth requires external provider** (Clerk integration recommended)
- **Cost at scale:** Function wall-time pricing can spike
- Smaller ecosystem, fewer examples for your use case

**Verdict:** ❌ Too experimental for one-day build. Learn this for next project.

---

## 2. Framework Analysis

### Next.js 14 (App Router) ✅ RECOMMENDED
**Pros:**
- **Best ecosystem:** Largest community, most AI coding tools trained on it
- **Vercel deployment:** Zero-config, production-ready in minutes
- **Server Components:** Ideal for use case catalog (static at build)
- **API routes:** Easy Claude/OpenAI integration
- **Streaming:** Built-in support for AI response streaming
- **v0.dev integration:** Anthropic's AI can generate Next.js components

**Cons:**
- App Router still has rough edges (caching confusion)
- Slightly heavier bundle than SvelteKit

**Time to First Page:** ~15-20 minutes with create-next-app

---

### Remix
**Pros:**
- Excellent nested routing for complex apps
- Server-first philosophy (faster initial loads)
- Good TypeScript support

**Cons:**
- **Smaller ecosystem** than Next.js
- Fewer AI coding assistant examples
- Deployment requires manual config (no "just works" like Vercel)
- Learning curve on loader/action pattern

**Verdict:** ❌ Adds 2-3 hours of learning time. Next.js is safer bet.

---

### SvelteKit
**Pros:**
- **Fastest performance:** 1,200 req/s vs Next.js 850 (benchmarks)
- **Smaller bundles:** Fraction of Next.js JS payload
- **Simpler syntax:** Less boilerplate than React
- **Great DX:** If you know Svelte

**Cons:**
- **Much smaller ecosystem:** Fewer auth examples, UI libraries
- **AI coding assistants less trained on Svelte** (GPT/Claude favor React)
- **No v0.dev equivalent** for component generation
- **Supabase integration less mature**

**Verdict:** ❌ For a one-day build with AI assistance, Next.js's ecosystem wins. SvelteKit is faster but costs you 3-4 hours finding solutions.

---

### Astro
**Pros:**
- Ultra-fast static sites
- Multi-framework support

**Cons:**
- **Not built for apps:** Great for content sites, poor for interactive chat
- No built-in streaming response handling
- Auth requires heavy lifting

**Verdict:** ❌ Wrong tool for this job.

---

## 3. Hosting Analysis

### Vercel ✅ RECOMMENDED
**Pros:**
- **Zero-config Next.js deployment:** Push to GitHub = live site
- **Edge functions:** Low latency globally
- **Preview deployments:** Every PR gets URL
- **Free tier:** Generous (100GB bandwidth, unlimited static)
- **Streaming responses:** First-class support
- **Web Vitals monitoring:** Built-in

**Cons:**
- Can get expensive at scale (but you control costs via caching)

**Time to Deploy:** 5 minutes

---

### Cloudflare Pages
**Pros:**
- **Best free tier:** Unlimited bandwidth
- **Fastest edge network:** 31-53ms global TTFB
- **$0 at scale:** No bandwidth surprises

**Cons:**
- **Next.js App Router support incomplete** (workers have limitations)
- Streaming responses require extra config
- No automatic preview deployments from PRs

**Verdict:** ⚠️ Save for when you need global CDN. For one-day build, Vercel's Next.js integration is smoother.

---

### Railway
**Pros:**
- **Best for full-stack apps:** Run DB alongside app
- **Predictable pricing:** $5/month base (no surprise bills)
- Good for containerized apps

**Cons:**
- **Overkill for Supabase setup** (you already have hosted DB)
- Slower cold starts than Vercel edge functions
- Less polished DX for static/edge deployments

**Verdict:** ❌ Vercel is faster for this architecture.

---

### Fly.io
**Pros:**
- Run anywhere globally
- Good for WebSocket-heavy apps

**Cons:**
- Requires Dockerfile knowledge
- More DevOps overhead
- No automatic static optimization

**Verdict:** ❌ Too much config for one-day build.

---

## 4. UI Library Analysis

### DaisyUI ✅ RECOMMENDED (Swap from shadcn/ui)
**Pros:**
- **Fastest setup:** Just add to Tailwind config (5 minutes)
- **Pre-styled components:** Cards, buttons, modals ready to use
- **Mobile-responsive out of box:** Critical for 40-60 age group
- **Accessible by default:** Keyboard nav, screen readers
- **Class-based:** No component imports, just `class="btn btn-primary"`
- **Perfect for MVPs:** Ship fast, customize later

**Cons:**
- Less "custom" look than shadcn/ui (but you don't need that)
- Fewer advanced components (but you don't need them)

**Time to Productive:** 10 minutes

**Why over shadcn/ui:** For a one-day build, you can't spend 2 hours configuring component variants. DaisyUI's pre-built themes get you 80% there instantly.

---

### shadcn/ui (Original Plan)
**Pros:**
- **Beautiful, modern design**
- **Fully customizable:** Copy components to your codebase
- **Great with v0.dev:** AI can generate shadcn components
- **Accessibility:** Built on Radix primitives

**Cons:**
- **1-2 hour setup:** Need to add components one by one
- **Configuration hell:** Tailwind config, component setup, theming
- **Overkill for MVP:** You're building 5-6 pages, not a design system

**Verdict:** ⚠️ Use for version 2 when you hire a designer. DaisyUI ships faster.

---

### Mantine
**Pros:**
- **Most complete library:** 100+ components out of box
- **Excellent docs**
- **Built-in hooks:** Forms, notifications, modals

**Cons:**
- **CSS-in-JS:** Adds bundle weight
- **Not Tailwind-native:** Conflicts with Tailwind workflow
- **Learning curve:** Custom API for styling

**Verdict:** ❌ Great library, wrong stack. Stick with Tailwind ecosystem.

---

### Chakra UI
**Pros:**
- Mature, battle-tested
- Good accessibility

**Cons:**
- CSS-in-JS (bundle weight)
- Losing momentum to shadcn/ui + Tailwind
- Slower updates

**Verdict:** ❌ Same issues as Mantine.

---

## 5. AI API Analysis

### OpenAI GPT-4o ✅ RECOMMENDED (Swap from Claude)
**Pricing (per 1M tokens):**
- Input: $2.50
- Output: $10.00

**Pros:**
- **60% cheaper than Claude Sonnet 4.5** ($3/$15)
- **Excellent for guided chat:** Strong instruction following
- **Faster responses:** 500-800ms first token
- **Best streaming support:** Mature SDKs
- **Function calling:** If you want structured outputs later
- **Free tier:** $5 credits for testing

**Cons:**
- Slightly less nuanced than Claude for complex reasoning (but you don't need that)

**Cost Estimate (1,000 users, 10 chats each, 500 tokens avg output):**
- 1,000 × 10 × 500 = 5M output tokens
- 5M × $10 / 1M = **$50/month**

**Verdict:** ✅ Best cost/performance for this use case. Claude is overkill.

---

### Claude (Sonnet 4.5) (Original Plan)
**Pricing (per 1M tokens):**
- Input: $3.00
- Output: $15.00

**Pros:**
- **Best reasoning:** Outperforms GPT-4 on benchmarks
- **Longer context:** 200k tokens vs GPT-4's 128k
- **Better at creative tasks**

**Cons:**
- **50% more expensive than OpenAI**
- **1,000-1,500ms first token** (slower)
- Your app doesn't need thesis-level reasoning

**Cost Estimate (same usage):**
- 5M × $15 / 1M = **$75/month**

**Verdict:** ⚠️ Use if your guided prompts are complex. Otherwise, save $25/month with OpenAI.

---

### Multi-Model Strategy
**Idea:** Route simple tasks to cheap models (GPT-3.5), complex to GPT-4o/Claude

**Pros:**
- Potentially cheaper
- Flexibility

**Cons:**
- **Adds 4-6 hours of complexity:**
  - Need routing logic
  - Different prompt formats
  - Testing each model per use case
- **Inconsistent UX:** Users notice quality differences

**Verdict:** ❌ Not for day one. Add in version 2 if costs spike.

---

## 6. Mobile Responsiveness

### Critical for 40-60 Age Group
**Requirements:**
- Large tap targets (min 48×48px)
- High contrast (WCAG AA)
- Simple navigation (no hamburger menus if possible)
- Readable font sizes (16px minimum)

**DaisyUI wins here:**
- Mobile-first by default
- Accessible components
- Large buttons/forms out of box

**Next.js App Router:**
- Works well on mobile
- Fast page transitions

**Vercel Edge:**
- Low latency = faster mobile loads

---

## 7. Final Stack Recommendation

```
┌─────────────────────────────────────────────────────────┐
│                    BOOEY.AI STACK                       │
├─────────────────────────────────────────────────────────┤
│ Frontend:    Next.js 14 (App Router) + TypeScript      │
│ UI:          Tailwind CSS + DaisyUI                     │
│ Backend:     Supabase (PostgreSQL + Auth)              │
│ AI:          OpenAI GPT-4o                              │
│ Hosting:     Vercel (Edge Functions)                    │
│ Version:     Git + GitHub                               │
└─────────────────────────────────────────────────────────┘
```

---

## 8. One-Day Build Timeline

**Hour 0-1: Setup**
- Create Next.js app (`npx create-next-app@latest`)
- Install DaisyUI, Supabase client
- Initialize Supabase project (web console)
- Set up Vercel project (link GitHub repo)

**Hour 1-2: Auth**
- Implement Supabase auth (sign up, login, logout)
- Create auth context/middleware
- Test email/password flow

**Hour 2-4: Database + Use Cases**
- Design schema (users, use_cases, conversations)
- Seed 10-15 use cases (recipes, letters, etc.)
- Build use case browse page (grid layout, DaisyUI cards)

**Hour 4-6: Chat Interface**
- Build guided chat page (use case → questions → AI response)
- Integrate OpenAI API (streaming responses)
- Handle question flow logic
- Save conversations to Supabase

**Hour 6-7: Polish**
- Add loading states, error handling
- Mobile responsiveness testing
- WCAG contrast/font size check

**Hour 7-8: Deploy + Test**
- Push to GitHub → Vercel auto-deploys
- Test on real mobile devices
- Set up custom domain (booey.ai)
- Add analytics (Vercel Analytics - free)

**Hour 8-10: Buffer**
- Bug fixes
- Add 5 more use cases
- Write README

---

## 9. Cost Breakdown (First 3 Months)

### Fixed Costs
- Domain (booey.ai): $12/year = **$3/month**
- Vercel: **$0** (free tier)
- Supabase: **$0** (free tier, <50k MAU)

### Variable Costs (based on usage)
**Scenario: 500 active users, 5 chats/user/month**

**OpenAI API:**
- 500 users × 5 chats × 200 input tokens = 500k input tokens → $1.25
- 500 users × 5 chats × 500 output tokens = 1.25M output tokens → $12.50
- **Total: $13.75/month**

**If using Claude:**
- Same usage = $18.75/month (+$5)

**Total Month 1-3: ~$17/month**

**Breakeven Analysis:**
- At 5,000 active users (10 chats/user): ~$275/month OpenAI costs
- Add monetization before hitting 3,000 users

---

## 10. Why This Beats Alternatives

| Decision Point | Chosen | Why Not Alternative? |
|----------------|--------|---------------------|
| **Framework** | Next.js | SvelteKit lacks ecosystem; Remix adds learning curve |
| **UI** | DaisyUI | shadcn/ui too slow to set up; Mantine not Tailwind-native |
| **Backend** | Supabase | Firebase=NoSQL overkill; Convex=learning curve; Clerk+Prisma=two services |
| **AI** | OpenAI | Claude 50% pricier for same output quality in guided chat |
| **Host** | Vercel | Cloudflare Pages lacks Next.js App Router maturity |

---

## 11. Risks + Mitigations

### Risk: OpenAI costs spike unexpectedly
**Mitigation:**
- Add rate limiting (5 chats/user/day)
- Set Vercel environment variable for OpenAI max tokens
- Add Supabase edge function to monitor API spend

### Risk: Supabase free tier limit (50k MAU)
**Mitigation:**
- Track MAU in dashboard
- Upgrade to Pro ($25/month) before hitting 40k
- Add waitlist if viral growth

### Risk: One-day timeline slips
**Mitigation:**
- Use AI coding assistants (Cursor, GitHub Copilot)
- Pre-write prompts for all components
- Have DaisyUI docs + Supabase docs open
- Skip non-essential features (password reset can wait)

---

## 12. Post-Launch Roadmap

### Week 1-2 (Monitor)
- Track Vercel Analytics (bounce rate, popular use cases)
- Monitor OpenAI costs daily
- Collect user feedback (add simple feedback form)

### Month 1 (Optimize)
- A/B test use case descriptions (which get most clicks?)
- Add password reset flow
- Implement chat history (currently one-off)

### Month 2-3 (Monetize or Cut Costs)
**Option A: Monetization**
- Add Stripe (one-time payment for "power users"?)
- Premium use cases (legal, business)

**Option B: Cost Reduction**
- Switch simple use cases to GPT-3.5-turbo (80% cheaper)
- Cache common AI responses (recipe tips, etc.)
- Add basic rate limiting

### Month 4+ (Scale)
- Migrate from DaisyUI to custom shadcn/ui design
- Add user-submitted use cases (moderation needed)
- Consider Claude for premium tier

---

## 13. Conclusion

The **initial plan was 90% correct**. Only two swaps recommended:

1. **DaisyUI > shadcn/ui**: Saves 1-2 hours on day one. You need speed, not pixel perfection.
2. **OpenAI > Claude**: Saves $25-50/month. Use Claude when you need reasoning (you don't).

**Everything else stands:**
- Next.js = best AI coding assistant support
- Supabase = fastest auth + DB combo
- Vercel = zero-config deployment
- Tailwind = industry standard, works with AI tools

**Can you build this in one day?** Yes, if you:
- Use DaisyUI (not shadcn/ui)
- Use Cursor/Copilot aggressively
- Don't overengineer (MVP = 5 pages)
- Pre-seed use cases (don't write them live)

**Should you?** Absolutely. This stack is production-ready, scales to 10k users before needing changes, and costs <$20/month.

---

## 14. Starter Commands

```bash
# 1. Create Next.js app
npx create-next-app@latest booey --typescript --tailwind --app

# 2. Install dependencies
cd booey
npm install daisyui @supabase/supabase-js openai

# 3. Configure DaisyUI (tailwind.config.js)
# plugins: [require("daisyui")]

# 4. Initialize Supabase
# Go to supabase.com → New Project → Copy URL + anon key

# 5. Set environment variables (.env.local)
# NEXT_PUBLIC_SUPABASE_URL=your_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
# OPENAI_API_KEY=your_key

# 6. Run dev server
npm run dev

# 7. Push to GitHub → Link Vercel → Auto-deploys
```

---

**Good luck. Ship it in 8 hours. Send me the link when live.** 🚀

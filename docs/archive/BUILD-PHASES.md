# Booey — Build Phases

## Timeline

Target: Production-ready by end of Presidents' Day weekend (Feb 14-17, 2026).

## Phase 1: Core Magic (3 hours)
**Goal:** One working use case end-to-end that feels magical.

**Scope:**
- Next.js 14 project setup with TypeScript, Tailwind, DaisyUI
- Hardcoded use case catalog (5-10 use cases in JSON)
- Simple grid/card layout for browsing use cases
- Click a card → enter the guided wizard flow
- Progressive form/wizard UI (NOT chat)
- Call Claude API with structured prompts
- Display result on final screen with copy button
- No auth, no persistence — results vanish on refresh (acceptable for this phase)

**Success criteria:** You can show this to someone and they say "oh that's cool" without explanation.

**Deploy:** Push to Vercel after this phase to test the deployment pipeline early.

---

## Phase 2: Auth + Persistence (2 hours)
**Goal:** Users can create accounts and save their results.

**Scope:**
- Supabase project setup (database + auth)
- Magic link authentication (passwordless email)
- Store completed sessions in Supabase (user_id, use_case_id, answers, result)
- "My History" page showing past sessions (read-only archive)
- Try-before-signup flow (one free use case without account)

**Success criteria:** Can sign up, use a tool, see it saved in history, log out, log back in, history is still there.

---

## Phase 3: Browse + Mobile (2 hours)
**Goal:** Make discovery feel good and work on mobile.

**Scope:**
- Full use case catalog (15-20 curated use cases)
- Category filter tags at top (Health, Work, Creative, Personal, etc.)
- Responsive design pass (single column mobile, 3-column desktop)
- Large tap targets, readable fonts, high contrast (accessibility basics)
- Polish card design with emoji icons and one-line descriptions

**Success criteria:** Someone on their phone can browse categories, pick a use case, complete the wizard, and see their result without anything breaking.

---

## Phase 4: Security + Deploy (1 hour)
**Goal:** Don't get hacked or go broke on day 1.

**Scope:**
- Per-user daily interaction cap (20)
- IP-based rate limiting (Upstash Redis or Vercel middleware)
- Input length validation (2000 char max)
- API route protection middleware (session required)
- Cost tracking per interaction (usage_logs table)
- Hard spending cap in Anthropic dashboard
- Emergency kill switch (maintenance mode toggle)
- Production deploy to Vercel with custom domain (booey.ai)

**Success criteria:** Rate limiting works, auth protects routes, cost tracking logs correctly, site is live on booey.ai.

---

## Phase 5: Polish (1-2 hours)
**Goal:** Make it feel professional.

**Scope:**
- Loading states and spinners during AI generation
- Error states (API fails gracefully, user sees friendly message)
- Empty states ("You haven't used any tools yet")
- Onboarding copy and CTAs
- OG meta tags for social sharing
- Favicon and basic branding (Booey logo, ocean blue + coral theme)

**Success criteria:** No raw errors visible to users, app feels polished on both desktop and mobile.

---

## What's NOT in scope (v2 backlog)
- Search functionality
- User-submitted use cases
- Bookmarking/favoriting
- Sharing results
- Editing past sessions
- Dark mode
- Advanced personalization
- Payment/subscription
- Analytics beyond basic Vercel Analytics
- OAuth providers (Google, Apple sign-in)

# Phase 2: Auth + Persistence

**Goal:** Users can create accounts and save their results.

**Timeline:** 2 hours (actual: ~4 hours due to Supabase rate limit pivot)

## Scope

- Supabase project setup (database + auth)
- ~~Magic link authentication~~ → **Google OAuth** (changed due to rate limits)
- Store completed sessions in Supabase (user_id, use_case_id, answers, result)
- "My History" page showing past sessions (read-only archive)
- Try-before-signup flow (one free use case without account)

## Success Criteria

Can sign up, use a tool, see it saved in history, log out, log back in, history is still there.

## Tasks

### Task 1: Supabase Setup + Schema + Client Utilities ✅
- Install `@supabase/supabase-js` and `@supabase/ssr`
- Add environment variables to `.env.local`
- Create database schema (sessions table)
- Set up Supabase client utilities for server and client

**Schema:**
```sql
create table sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  use_case_id text not null,
  answers jsonb not null,
  result text not null,
  model text not null,
  input_tokens int,
  output_tokens int,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS policies
alter table sessions enable row level security;

create policy "Users can view own sessions"
  on sessions for select
  using (auth.uid() = user_id);

create policy "Users can insert own sessions"
  on sessions for insert
  with check (auth.uid() = user_id);
```

### Task 2: Magic Link Auth UI + Flow ✅ (DEPRECATED - see Task 5)
- Sign in/sign up UI component
- ~~Magic link email handling~~
- Auth state management (server + client components)
- Protected route middleware
- Sign out functionality

**NOTE:** Original magic link implementation replaced by Google OAuth in Task 5 due to Supabase free tier rate limits (2 emails/hour total for entire project).

### Task 3: Session Persistence ✅
- Update `/api/generate` to save sessions after Claude response
- Create `/api/sessions` route for fetching user history
- Handle both authenticated and guest (try-before-signup) requests

### Task 4: History Page + Try-Before-Signup Logic ✅
- `/history` route showing user's past sessions
- Display in chronological order (newest first)
- Try-before-signup: allow one free use without account via localStorage
- Prompt to sign up after first use to save results
- Migrate guest session to user account on signup

### Task 5: Google OAuth (replaces Task 2 magic links) ✅
- "Sign in with Google" button
- Supabase `signInWithOAuth({ provider: 'google' })`
- One-click auth flow (better UX than checking email for magic link)
- No rate limits (vs 2 emails/hour for magic links)
- Better experience for 40-60 year old target demographic
- All existing auth infrastructure (callback, middleware, useUser) works unchanged

**Why the pivot:** Discovered Supabase free tier limits magic link emails to 2 per hour for entire project. Google OAuth provides better UX (one-click vs check email) with no rate limits, and is more familiar to target users.

## Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-project-url>
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<your-supabase-publishable-key>
SUPABASE_SECRET_KEY=<your-supabase-secret-key>

# Google OAuth configured in Supabase dashboard (not in env vars)
```

**Note:** Actual credentials stored in `.env.local` (not committed to git).

## Dependencies

- Task 1 → Tasks 2-4 (all depend on Supabase setup)
- Task 5 replaces Task 2 (same auth infrastructure, different provider)

## Final Status

All 5 tasks complete and tested. Google OAuth working end-to-end.

---

*Created: 2026-02-14 16:33 EST*  
*Updated: 2026-02-14 18:38 EST (added Task 5, marked Task 2 deprecated)*

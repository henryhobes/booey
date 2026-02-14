# Phase 2: Auth + Persistence

**Goal:** Users can create accounts and save their results.

**Timeline:** 2 hours

## Scope

- Supabase project setup (database + auth)
- Magic link authentication (passwordless email)
- Store completed sessions in Supabase (user_id, use_case_id, answers, result)
- "My History" page showing past sessions (read-only archive)
- Try-before-signup flow (one free use case without account)

## Success Criteria

Can sign up, use a tool, see it saved in history, log out, log back in, history is still there.

## Tasks

### Task 1: Supabase Setup + Schema + Client Utilities
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

### Task 2: Magic Link Auth UI + Flow
- Sign in/sign up UI component
- Magic link email handling
- Auth state management (server + client components)
- Protected route middleware
- Sign out functionality

### Task 3: Session Persistence
- Update `/api/generate` to save sessions after Claude response
- Create `/api/sessions` route for fetching user history
- Handle both authenticated and guest (try-before-signup) requests

### Task 4: History Page + Try-Before-Signup Logic
- `/history` route showing user's past sessions
- Display in chronological order (newest first)
- Try-before-signup: allow one free use without account via localStorage
- Prompt to sign up after first use to save results
- Migrate guest session to user account on signup

## Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-project-url>
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<your-supabase-publishable-key>
SUPABASE_SECRET_KEY=<your-supabase-secret-key>
```

**Note:** Actual credentials stored in `.env.local` (not committed to git).

## Dependencies

- Task 1 → Task 2 → Task 3 → Task 4 (sequential)

---

*Created: 2026-02-14 16:33 EST*

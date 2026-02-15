# Phase 4 Task 3: Supabase RLS Policies

**Estimated Time:** 45 minutes  
**Branch:** `phase-4/supabase-rls`  
**PR:** Will open as #15

---

## Goal

Enable Row Level Security (RLS) on Supabase tables and create policies to isolate user data.

---

## Background

**What is RLS?**
Row Level Security is a PostgreSQL feature that restricts which rows a user can access in a table. Even if someone gets your `anon` API key, they can't read other users' data.

**Why it's critical:**
- Defense in depth (database-level security)
- Required for production Supabase usage with `anon` key
- Prevents accidental data leaks from client-side bugs

---

## Requirements

### Tables to Secure

1. **`users` table** - User profile data
2. **`sessions` table** - User interaction history

### Policies Needed

For each table:
- **SELECT:** Users can only read their own records
- **INSERT:** Users can only create records for themselves
- **UPDATE:** Users can only update their own records
- **DELETE:** Users can only delete their own records

### Performance

- Add indexes on `user_id` columns (RLS uses these in WHERE clauses)
- Use `(select auth.uid())` pattern for performance (research doc explains why)

---

## Implementation Steps

### 1. Enable RLS on Tables

Run in Supabase SQL Editor:

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
```

### 2. Create Policies for `users` Table

```sql
-- Users can view their own user record
CREATE POLICY "Users can view own user data"
  ON users
  FOR SELECT
  USING ((select auth.uid()) = id);

-- Users can insert their own user record
CREATE POLICY "Users can insert own user data"
  ON users
  FOR INSERT
  WITH CHECK ((select auth.uid()) = id);

-- Users can update their own user record
CREATE POLICY "Users can update own user data"
  ON users
  FOR UPDATE
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

-- Users can delete their own user record
CREATE POLICY "Users can delete own user data"
  ON users
  FOR DELETE
  USING ((select auth.uid()) = id);
```

### 3. Create Policies for `sessions` Table

```sql
-- Users can view their own sessions
CREATE POLICY "Users can view own sessions"
  ON sessions
  FOR SELECT
  USING ((select auth.uid()) = user_id);

-- Users can insert their own sessions
CREATE POLICY "Users can insert own sessions"
  ON sessions
  FOR INSERT
  WITH CHECK ((select auth.uid()) = user_id);

-- Users can update their own sessions
CREATE POLICY "Users can update own sessions"
  ON sessions
  FOR UPDATE
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- Users can delete their own sessions
CREATE POLICY "Users can delete own sessions"
  ON sessions
  FOR DELETE
  USING ((select auth.uid()) = user_id);
```

### 4. Add Indexes for Performance

```sql
-- Index on sessions.user_id (used in RLS policies)
CREATE INDEX IF NOT EXISTS idx_sessions_user_id 
  ON sessions(user_id);

-- Index on sessions.created_at (for sorting/filtering)
CREATE INDEX IF NOT EXISTS idx_sessions_created_at 
  ON sessions(created_at DESC);
```

### 5. Test Policies

**In Supabase SQL Editor:**

```sql
-- Set session to a test user
SELECT auth.uid(); -- Should return current user ID

-- Try to read another user's sessions (should return 0 rows)
SELECT * FROM sessions WHERE user_id != (select auth.uid());

-- Try to read own sessions (should return your sessions)
SELECT * FROM sessions WHERE user_id = (select auth.uid());
```

**In the app:**
1. Sign in with Google OAuth
2. Create a session (use a use case)
3. Check Supabase Table Editor - should only see your own sessions
4. Try to manually query another user's data in SQL Editor (should fail)

---

## Verification Checklist

- [ ] RLS enabled on `users` table
- [ ] RLS enabled on `sessions` table
- [ ] Policies created for `users` (SELECT, INSERT, UPDATE, DELETE)
- [ ] Policies created for `sessions` (SELECT, INSERT, UPDATE, DELETE)
- [ ] Indexes created on `sessions.user_id` and `sessions.created_at`
- [ ] Test: Cannot read other users' data
- [ ] Test: Can read own data
- [ ] Test: App still works normally (sign in, create sessions, view history)
- [ ] No performance degradation

---

## Common Issues

**"new row violates row-level security policy"**
- Check your INSERT/UPDATE policies have `WITH CHECK` clause
- Verify `user_id` is being set correctly in your Supabase client calls

**"permission denied for table users"**
- RLS is enabled but no policies exist yet
- Create at least one policy for the operation you're trying

**Slow queries after enabling RLS**
- Add indexes on columns used in RLS policies
- Use `(select auth.uid())` instead of `auth.uid()` (big performance win)

---

## Acceptance Criteria

- ✅ RLS enabled on both tables
- ✅ All 8 policies created (4 per table)
- ✅ Indexes created
- ✅ Cannot access other users' data via SQL Editor
- ✅ App still works: sign in, use cases, history page
- ✅ No console errors related to RLS
- ✅ PR opened with Codex review passed

---

## Files to Create

- `supabase/migrations/004_enable_rls.sql` - SQL migration file (optional, for version control)

Or just run SQL directly in Supabase SQL Editor (simpler for MVP).

---

## Notes

- **Auth context:** Supabase automatically sets `auth.uid()` based on the JWT from your client
- **Service role key:** Bypasses RLS (only use server-side, never expose to client)
- **Testing:** Use Supabase "RLS Testing" feature to verify policies work
- **Future:** Can add more granular policies (e.g., read-only access for admins)

---

## Reference

Research: `memory/projects/booey/research-supabase-production.md` (created by subagent)

Key points:
- RLS is mandatory for production
- `(select auth.uid())` wrapper = 99% performance improvement
- Always add indexes on RLS policy columns
- Test policies before going live

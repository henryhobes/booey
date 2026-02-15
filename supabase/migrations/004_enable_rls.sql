-- ============================================================
-- Migration 004: Enable Row Level Security (RLS)
-- Phase 4 Task 3: Supabase RLS Policies
-- ============================================================
-- Enables RLS on users and sessions tables with per-user
-- isolation policies. Uses (select auth.uid()) pattern for
-- performance (avoids re-evaluating auth.uid() per row).
-- ============================================================

-- 1. Enable RLS on tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- 2. Policies for `users` table (key column: id)

CREATE POLICY "Users can view own user data"
  ON users FOR SELECT
  USING ((select auth.uid()) = id);

CREATE POLICY "Users can insert own user data"
  ON users FOR INSERT
  WITH CHECK ((select auth.uid()) = id);

CREATE POLICY "Users can update own user data"
  ON users FOR UPDATE
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

CREATE POLICY "Users can delete own user data"
  ON users FOR DELETE
  USING ((select auth.uid()) = id);

-- 3. Policies for `sessions` table (key column: user_id)

CREATE POLICY "Users can view own sessions"
  ON sessions FOR SELECT
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert own sessions"
  ON sessions FOR INSERT
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own sessions"
  ON sessions FOR UPDATE
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own sessions"
  ON sessions FOR DELETE
  USING ((select auth.uid()) = user_id);

-- 4. Performance indexes

CREATE INDEX IF NOT EXISTS idx_sessions_user_id
  ON sessions(user_id);

CREATE INDEX IF NOT EXISTS idx_sessions_created_at
  ON sessions(created_at DESC);

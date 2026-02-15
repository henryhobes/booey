-- Migration: Add composite index on sessions for query performance
-- The app queries sessions filtered by user_id and sorted by created_at DESC.
-- Without this index, Postgres does a sequential scan on every history load.

CREATE INDEX IF NOT EXISTS idx_sessions_user_created
  ON sessions (user_id, created_at DESC);

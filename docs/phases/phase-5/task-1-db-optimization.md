# Phase 5 Task 1: Database Optimization

## Goal
Add performance optimizations and verify production readiness for Supabase.

## Requirements

### 1. Composite Index on Sessions Table
**Why:** The research found that queries filtering by `user_id` and sorting by `created_at DESC` need a composite index for performance. Without it, Postgres does a full table scan.

**Implementation:**
- Create migration file: `supabase/migrations/005_add_sessions_index.sql`
- Add index: `CREATE INDEX idx_sessions_user_created ON sessions(user_id, created_at DESC);`
- This index covers both the RLS policy check (`user_id`) and the history query sort

### 2. Verify RLS Policies are Applied
**Check that:**
- RLS is enabled on both `users` and `sessions` tables
- All 8 policies exist (4 per table)
- Policies use `(select auth.uid())` pattern (not bare `auth.uid()` for performance)

**How to verify:**
- Query Supabase: `SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';`
- Query policies: `SELECT * FROM pg_policies WHERE schemaname = 'public';`
- If using browser automation, navigate to Supabase dashboard and verify in Table Editor

### 3. Document Custom SMTP Requirement
**Critical finding:** Supabase free tier only allows **2 auth emails per hour** via built-in SMTP. This will break Google OAuth confirmation emails.

**Action:**
- Add to `DEPLOY.md` under "Production Checklist"
- Document setup for custom SMTP (SendGrid free tier: 100 emails/day, or AWS SES)
- Include warning that built-in SMTP is insufficient for production

## Files to Modify
- `supabase/migrations/005_add_sessions_index.sql` (create new)
- `DEPLOY.md` (add SMTP section)

## Acceptance Criteria
- [ ] Composite index exists on `sessions(user_id, created_at DESC)`
- [ ] RLS verification complete (enabled + all policies present)
- [ ] SMTP limitation documented in DEPLOY.md with setup instructions
- [ ] Migration file committed and documented

## Notes
- The index should be added via migration file for version control
- RLS was already implemented in PR #13, this task just verifies it's working
- Custom SMTP is documented (not implemented) — Henry can configure it later

# Supabase Production Configuration — Booey

> **Archived.** The Booey Supabase project has been retired. This is preserved as a reference for the production configuration (RLS, auth, indexes) that backed the app.

## 1. Row Level Security (RLS)

### Enable RLS on ALL tables

```sql
-- Enable RLS (do this for every table)
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;  -- if you have a profiles/users table
```

### RLS Policies for `sessions` table

```sql
-- Users can only read their own sessions
CREATE POLICY "Users can view own sessions"
  ON sessions FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only insert their own sessions
CREATE POLICY "Users can create own sessions"
  ON sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own sessions
CREATE POLICY "Users can update own sessions"
  ON sessions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own sessions
CREATE POLICY "Users can delete own sessions"
  ON sessions FOR DELETE
  USING (auth.uid() = user_id);
```

### RLS Policies for `users`/`profiles` table (if applicable)

```sql
-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
```

### RLS Best Practices
- **Keep policies simple** — avoid multi-table joins in policies (they kill performance)
- **Use `auth.uid()` directly** — it's optimized internally. Avoid `current_setting()` which can cause perf issues
- **Index the columns referenced in policies** (e.g., `user_id`) — RLS adds a WHERE clause to every query
- **Test with `.explain()`** in dev to check policy performance
- **Never leave RLS disabled** on tables accessible via the client SDK — the anon key is public

---

## 2. Google OAuth Production Settings

### Google Cloud Console checklist:
- [ ] Set OAuth consent screen to **"External"** and submit for **verification** (required for >100 users)
- [ ] Add your production domain to **Authorized JavaScript origins**: `https://yourdomain.com`
- [ ] Add **Authorized redirect URI**: `https://<project-ref>.supabase.co/auth/v1/callback`
- [ ] Use **separate OAuth credentials** for dev vs production
- [ ] Request only necessary scopes (`email`, `profile` — avoid broad scopes)
- [ ] Add a privacy policy and terms of service URL (required for verification)

### Supabase Auth settings:
- [ ] Set **Site URL** to your production domain
- [ ] Add production domain to **Redirect URLs** allowlist
- [ ] Remove `localhost` from redirect URLs in production project
- [ ] Enable **email confirmations** (Settings > Auth)

### Security considerations:
- The Google Client Secret in Supabase dashboard is stored encrypted — never expose it client-side
- Use PKCE flow (Supabase default for SSR) — more secure than implicit flow
- Consider restricting to specific Google Workspace domains if internal-only app

---

## 3. Connection Pooling & Performance

### Supabase uses Supavisor (replaced PgBouncer)
- **Client SDK (PostgREST)**: Already pooled. No action needed for `supabase.from()` calls
- **Direct Postgres connections** (e.g., Prisma, Drizzle): Use the **pooled connection string** (port 6543)
- **Transaction mode** (default): Each query gets its own connection. No prepared statements support

### Free tier connection limits:
- **Direct connections**: ~60 (shared across all clients)
- **Pooled connections**: Up to 200 client connections via Supavisor
- If using PostgREST API heavily, keep pool size ≤40% of max. Otherwise up to 80%

### For Booey specifically:
- You're using the Supabase JS client (PostgREST) — pooling is automatic
- No need for direct Postgres connections unless you add server-side ORM later
- Keep API routes lightweight; each Next.js serverless function gets a pooled connection

---

## 4. Database Indexes

```sql
-- Sessions table: user lookups (critical — used in RLS policy too)
CREATE INDEX idx_sessions_user_id ON sessions(user_id);

-- Sessions table: recent sessions for a user (covers the common query pattern)
CREATE INDEX idx_sessions_user_created ON sessions(user_id, created_at DESC);

-- Sessions table: by use case (if you add filtering by use case)
CREATE INDEX idx_sessions_use_case ON sessions(use_case_id);

-- If you add a profiles/users table
CREATE INDEX idx_profiles_email ON profiles(email);
```

### Index tips:
- Use `pg_stat_statements` to find slow queries: Dashboard > SQL Editor > run `SELECT * FROM pg_stat_statements ORDER BY total_exec_time DESC LIMIT 10;`
- Supabase Dashboard has a **Performance Advisor** that suggests missing indexes
- Don't over-index — each index adds write overhead

---

## 5. Backup & Disaster Recovery

### Free tier:
- ❌ **No downloadable backups**
- ❌ No Point-in-Time Recovery (PITR)
- ✅ Supabase does run internal backups, but you can't access them
- ⚠️ **Projects pause after 7 days of inactivity** (restorable from dashboard)

### DIY backup for free tier:
```bash
# Manual backup using pg_dump (use the direct connection string)
pg_dump "postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres" > backup_$(date +%Y%m%d).sql
```

### Pro tier ($25/mo):
- ✅ Daily backups, downloadable, retained 7 days
- ✅ No pausing for inactivity
- PITR available as paid add-on

### Recommendation:
- Set up a weekly `pg_dump` cron job even on free tier
- Store backups in a git-ignored local directory or cloud storage

---

## 6. Monitoring & Alerts

### Built-in (Dashboard):
- **Logs Explorer**: API logs, Auth logs, Postgres logs
- **Database Health**: Active connections, cache hit rate, replication lag
- **Performance Advisor**: Suggests indexes, flags issues
- **Security Advisor**: Checks for common misconfigurations

### Rate limits to be aware of:
| Resource | Free Tier Limit |
|----------|----------------|
| Database size | 500 MB |
| Bandwidth | 5 GB/month |
| Storage | 1 GB |
| Edge Functions | 500K invocations/month |
| Auth emails (built-in SMTP) | 2/hour (!) |
| MAU (monthly active users) | 50,000 |
| Max file upload | 50 MB |
| Realtime messages | 2M/month |
| Active projects | 2 |

### When limits are exceeded:
- **Database size**: New writes may fail
- **Bandwidth**: Service may be throttled/restricted
- **Inactivity (7 days)**: Project is paused automatically
- **Auth emails**: Users won't receive confirmation/reset emails beyond limit

### Custom SMTP (strongly recommended):
- Set up SendGrid/AWS SES for auth emails
- Raises email rate limit to 30/hour (configurable higher)
- Emails come from your domain (builds trust)

---

## 7. Migration Strategy

### Supabase CLI workflow (recommended):
```bash
# Install CLI
npx supabase init  # in project root

# Create a migration
npx supabase migration new add_indexes

# Edit the generated SQL file in supabase/migrations/

# Test locally
npx supabase db reset  # resets local DB and replays all migrations

# Deploy to production
npx supabase db push  # applies pending migrations to remote
```

### Best practices:
- [ ] **Never modify production schema directly** via Dashboard SQL editor
- [ ] Use `supabase/migrations/` directory — all changes in version-controlled SQL files
- [ ] Test migrations locally first with `supabase db reset`
- [ ] Use a **staging Supabase project** for testing before production (separate project)
- [ ] For CI/CD: use GitHub Actions with `supabase db push` on merge to main
- [ ] **Backwards-compatible changes**: Add columns as nullable, add new tables — don't rename/drop in the same deploy
- [ ] Run `supabase db diff` to capture Dashboard changes as migration files

### Dangerous operations checklist:
- Dropping columns → ensure no code references remain
- Adding NOT NULL → backfill data first, then add constraint
- Renaming tables → create new, migrate data, drop old (multi-step)

---

## 8. Production Checklist Summary

### Security
- [ ] RLS enabled on ALL tables
- [ ] RLS policies tested (connect as different users, verify isolation)
- [ ] SSL enforcement enabled
- [ ] MFA on Supabase account
- [ ] Remove `localhost` from auth redirect URLs
- [ ] Google OAuth consent screen verified (if >100 users)
- [ ] Custom SMTP configured for auth emails
- [ ] `service_role` key NEVER exposed client-side

### Performance
- [ ] Indexes on `user_id` and common query columns
- [ ] Connection pooling configured (automatic with JS client)
- [ ] Check Performance Advisor in dashboard

### Reliability
- [ ] Backup strategy in place (pg_dump for free tier)
- [ ] Migration workflow set up (Supabase CLI + version control)
- [ ] Staging project for testing changes
- [ ] Monitor dashboard logs periodically

### Scaling readiness
- [ ] Understand free tier limits (500MB DB, 5GB bandwidth)
- [ ] Plan upgrade to Pro ($25/mo) before launch if expecting traffic
- [ ] Set up custom SMTP before launch (2 emails/hour is brutal)

---

## Quick Reference: Booey-Specific Queries

The app currently does:
1. `sessions.select('*').eq('user_id', uid).order('created_at', { ascending: false })` — **needs index on (user_id, created_at DESC)**
2. `sessions.insert({user_id, use_case_id, answers, result, ...})` — **RLS WITH CHECK on user_id**
3. `auth.getUser()` — handled by Supabase Auth, no custom query

These are simple patterns. RLS + one composite index covers the critical path.

# Phase 4: Security + Deploy

**Goal:** Harden security, implement rate limiting, and prepare for production deployment on Vercel.

**Duration:** ~3 hours

---

## Tasks

### Task 1: Rate Limiting (1.5 hours)
Implement user-based rate limiting with Upstash Redis.

**What:**
- Upstash Redis setup (free tier, Vercel-optimized)
- Dual limits: 20 interactions/day + 5 interactions/min (burst protection)
- Auth-based tracking (Supabase user ID)
- Show remaining quota in UI
- Graceful error messages when limits hit

**Why:**
- Protect Claude API costs on free tier
- Prevent abuse
- Fair usage across users

**Dependencies:** Phase 2 (auth) complete

---

### Task 2: Security Hardening (1 hour)
Add critical security controls for production.

**What:**
- Security headers (CSP, HSTS, X-Frame-Options) in `next.config.js`
- Input validation with Zod for API routes
- API key protection (ensure Claude key stays server-side)
- Basic XSS prevention (sanitize user inputs if needed)

**Why:**
- Protect against common attacks
- Secure API keys
- Pass basic security audits

**Dependencies:** None

---

### Task 3: Supabase RLS Policies (45 min)
Enable Row Level Security and create policies for user data isolation.

**What:**
- Enable RLS on `users` and `sessions` tables
- Create policies:
  - Users can only read/write their own user record
  - Users can only read/write their own sessions
- Add indexes for performance (`user_id` on sessions table)
- Test policies work correctly

**Why:**
- Database-level security (defense in depth)
- Required for production Supabase usage
- Prevents accidental data leaks

**Dependencies:** Phase 2 (Supabase schema) complete

---

### Task 4: Vercel Deployment Prep (30 min)
Configure environment variables and prepare for first production deploy.

**What:**
- Create `.env.example` file documenting all required env vars
- Verify `NEXT_PUBLIC_*` prefix usage (only Supabase URL should be public)
- Add build optimization flags if needed
- Create deployment checklist
- Document manual Vercel setup steps (actual deploy will be manual)

**Why:**
- Prevent environment variable mistakes
- Smooth first deployment
- Reference for future deploys

**Dependencies:** All previous tasks complete

---

## Success Criteria

- ✅ Rate limiting works: 20/day limit enforced, quota visible in UI
- ✅ Security headers configured and tested
- ✅ RLS policies enabled and working (users can't see each other's data)
- ✅ All environment variables documented
- ✅ App runs locally with production-like config
- ✅ Ready for `git push` → Vercel deploy

---

## Notes

- **Don't deploy yet** - just prepare for deployment
- Henry will do the manual Vercel setup + first deploy
- Focus on MVP security (critical items only)
- Can add nice-to-haves post-launch

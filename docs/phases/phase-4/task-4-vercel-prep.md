# Phase 4 Task 4: Vercel Deployment Prep

**Estimated Time:** 30 minutes  
**Branch:** `phase-4/vercel-prep`  
**PR:** Will open as #16

---

## Goal

Prepare the app for production deployment on Vercel (without actually deploying yet).

---

## Requirements

### 1. Environment Variables Documentation

Create `.env.example` with all required environment variables:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Anthropic (Claude API)
# ⚠️ CRITICAL: Do NOT use NEXT_PUBLIC_ prefix for API keys!
# This must remain server-side only.
ANTHROPIC_API_KEY=sk-ant-your-key-here

# Upstash Redis (Rate Limiting)
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-here

# Optional: Node environment
NODE_ENV=production
```

**Add README section:**

```markdown
## Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key (safe to expose)
- `ANTHROPIC_API_KEY` - Your Claude API key (**server-only, never expose**)
- `UPSTASH_REDIS_REST_URL` - Your Upstash Redis URL
- `UPSTASH_REDIS_REST_TOKEN` - Your Upstash Redis token

⚠️ **Security:** Never commit `.env.local` to git. API keys should never use `NEXT_PUBLIC_` prefix.
```

### 2. Build Optimization Check

Verify build works and is optimized:

```bash
npm run build
```

Expected output:
- No errors
- Bundle size reasonable (<500 KB for main bundle)
- All pages pre-rendered or ISR

**If build is slow or large:**
- Check for unnecessary client-side imports
- Verify images are optimized
- Consider dynamic imports for heavy components

### 3. Deployment Checklist

Create `DEPLOY.md`:

```markdown
# Deployment Checklist

## Pre-Deploy (Do Once)

- [ ] Create Vercel account: https://vercel.com
- [ ] Install Vercel CLI: `npm install -g vercel`
- [ ] Connect GitHub repo to Vercel
- [ ] Configure environment variables in Vercel dashboard
- [ ] Set up custom domain (optional)

## Environment Variables in Vercel

Add these in Vercel Dashboard → Settings → Environment Variables:

**Production + Preview + Development:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Production only:**
- `ANTHROPIC_API_KEY`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

⚠️ **Important:** For Supabase, manually check "Preview" and "Development" boxes after adding the variables. Vercel's Supabase integration defaults to Production-only.

## Deploy Steps

1. **Push to GitHub:**
   ```bash
   git push origin main
   ```

2. **Vercel auto-deploys** from `main` branch

3. **Check deployment:**
   - Visit Vercel dashboard
   - Check build logs for errors
   - Visit preview URL
   - Test basic functionality

4. **If successful:**
   - Assign custom domain (optional)
   - Monitor for errors in Vercel logs

## Post-Deploy

- [ ] Test sign-in flow with Google OAuth
- [ ] Test wizard → AI generation
- [ ] Test rate limiting (hit 20/day limit)
- [ ] Check Supabase RLS is working (can't see other users' data)
- [ ] Monitor Vercel logs for errors
- [ ] Monitor Claude API usage
- [ ] Set up error tracking (Sentry, optional)

## Rollback Plan

If deployment breaks:
1. Revert Git commit: `git revert HEAD`
2. Push: `git push origin main`
3. Vercel auto-deploys previous version
4. Fix issue locally
5. Re-deploy when ready

## Common Issues

**Build fails:**
- Check Vercel build logs
- Verify environment variables are set
- Test `npm run build` locally first

**Environment variables not working:**
- Check spelling and capitalization
- Verify "Preview" and "Development" are checked (for Supabase vars)
- Restart deployment after adding variables

**OAuth redirect fails:**
- Add production URL to Supabase OAuth allowlist
- Format: `https://booey.vercel.app/auth/callback`

**Rate limiting doesn't work:**
- Check Upstash Redis credentials
- Verify Upstash region matches Vercel deployment region
```

### 4. Verify `.gitignore`

Ensure sensitive files are ignored:

```gitignore
# dependencies
/node_modules

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# env files
.env
.env*.local

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# vercel
.vercel

# IDE
.vscode/
.idea/
```

---

## Implementation Steps

1. **Create `.env.example`:**
   - Copy current `.env.local`
   - Replace values with placeholders
   - Add security warnings

2. **Update `README.md`:**
   - Add "Environment Variables" section
   - Add "Deployment" section linking to `DEPLOY.md`

3. **Create `DEPLOY.md`:**
   - Use template above
   - Customize for your app specifics

4. **Test Build:**
   ```bash
   npm run build
   npm run start
   ```
   - Verify production build works locally
   - Check bundle sizes are reasonable

5. **Verify `.gitignore`:**
   - Check `.env.local` is NOT committed
   - Run `git status` to verify

6. **Commit docs:**
   - Commit `.env.example`, `DEPLOY.md`, updated `README.md`
   - Push to repo

---

## Acceptance Criteria

- ✅ `.env.example` created with all required variables
- ✅ `README.md` has environment variable setup instructions
- ✅ `DEPLOY.md` created with deployment checklist
- ✅ `.gitignore` properly configured
- ✅ `npm run build` succeeds with no errors
- ✅ No sensitive data committed to git
- ✅ PR opened with Codex review passed

---

## Files to Create/Modify

- `.env.example` (new) - Environment variable template
- `DEPLOY.md` (new) - Deployment guide
- `README.md` (update) - Add env setup + deployment sections
- `.gitignore` (verify) - Ensure `.env*.local` is ignored

---

## Notes

- **Don't deploy yet** - Henry will do first manual deploy after review
- **Vercel CLI** - Not needed for first deploy (GitHub integration is easier)
- **Preview deployments** - Vercel creates preview URL for every PR automatically
- **Build time** - Should be <2 minutes for this app
- **Bundle size** - DaisyUI adds ~50 KB, target total <500 KB for main bundle

---

## Reference

Research: `memory/projects/booey/research-vercel-deploy.md` (created by subagent)

Key points from research:
- Supabase env vars need manual Preview/Dev checkbox (Vercel bug)
- Never prefix sensitive keys with `NEXT_PUBLIC_`
- Build optimization is good in Next.js 14.2+ (we're on 16.1.6)
- GitHub integration handles CI/CD automatically

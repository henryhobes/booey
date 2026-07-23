# Deployment Guide

> **Archived.** Booey's live Vercel deployment and Supabase project have been retired — this runbook is preserved as a record of how the app was deployed and operated (including its cost controls and kill switch).

## Pre-Deploy (Do Once)

- [ ] Create Vercel account: https://vercel.com
- [ ] Install Vercel CLI: `npm install -g vercel`
- [ ] Connect GitHub repo to Vercel
- [ ] Configure environment variables in Vercel dashboard
- [ ] Set up custom domain (optional)

## Environment Variables in Vercel

Add these in **Vercel Dashboard → Settings → Environment Variables:**

**Production + Preview + Development:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

**Production only (sensitive):**
- `ANTHROPIC_API_KEY`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `DAILY_BUDGET_USD` — Daily spend cap in USD (default: `5.00`)
- `EMERGENCY_STOP` — Set to `true` to block all AI requests (kill switch)
- `NTFY_TOPIC` — ntfy.sh topic for cost alerts (e.g. `booey-cost-alerts-abc123`)

> ⚠️ **Important:** For Supabase vars, manually check "Preview" and "Development" boxes after adding. Vercel's Supabase integration defaults to Production-only.

> ⚠️ **Security:** Never use the `NEXT_PUBLIC_` prefix for API keys or secrets. Only Supabase URL and anon key are safe to expose.

## Deploy Steps

1. **Push to GitHub:**
   ```bash
   git push origin main
   ```

2. **Vercel auto-deploys** from `main` branch.

3. **Check deployment:**
   - Visit Vercel dashboard for build logs
   - Visit preview URL
   - Test sign-in, wizard, and generation flows

4. **If successful:**
   - Assign custom domain (optional)
   - Monitor Vercel logs for errors

## Custom SMTP Configuration (Required for Production)

> ⚠️ **Critical:** Supabase's built-in SMTP is limited to **2 auth emails per hour** on the free tier. This will break sign-up/password-reset flows under any real usage. You **must** configure a custom SMTP provider before launch.

### Option A: SendGrid (Recommended for free tier)
1. Create a free SendGrid account (100 emails/day)
2. Verify a sender identity (domain or single sender)
3. Generate an API key
4. In **Supabase Dashboard → Project Settings → Authentication → SMTP Settings:**
   - Enable "Custom SMTP"
   - Host: `smtp.sendgrid.net`
   - Port: `587`
   - Username: `apikey`
   - Password: your SendGrid API key
   - Sender email: your verified sender address

### Option B: AWS SES
1. Set up AWS SES and verify your domain
2. Create SMTP credentials in the SES console
3. Configure in Supabase SMTP Settings (same location as above)
   - Host: `email-smtp.<region>.amazonaws.com`
   - Port: `587`
   - Username/Password: SES SMTP credentials

### Verify
After configuring, test by signing up a new user and confirming the email arrives promptly.

## Post-Deploy Verification

- [ ] Test sign-in flow with Google OAuth
- [ ] Test wizard → AI generation
- [ ] Test rate limiting (when enabled)
- [ ] Check Supabase RLS is working (can't see other users' data)
- [ ] Monitor Claude API usage
- [ ] Set up error tracking (Sentry, optional)

## Rollback Plan

If deployment breaks:

```bash
git revert HEAD
git push origin main
# Vercel auto-deploys the reverted version
```

## Cost Monitoring & Alerting

Booey tracks daily API spend in Upstash Redis and enforces a configurable budget cap.

### How it works
- Every `/api/generate` call records token usage × Haiku 3.5 pricing
- If daily spend exceeds `DAILY_BUDGET_USD` (default $5), new requests get 429
- Push notifications via [ntfy.sh](https://ntfy.sh) fire at 50%, 75%, and 90% thresholds

### Setup
1. **Budget cap** — Set `DAILY_BUDGET_USD=5.00` in Vercel env vars (or your preferred limit)
2. **ntfy.sh alerts** — Pick a random topic name and set `NTFY_TOPIC=booey-cost-alerts-<random>`. Subscribe on your phone via the ntfy app or at `https://ntfy.sh/<your-topic>`.
3. **Kill switch** — In an emergency, set `EMERGENCY_STOP=true` in Vercel and redeploy. All AI requests will return 503 immediately.

### Monitoring
- Redis key `budget:YYYY-MM-DD` contains daily spend data (auto-expires after 25h)
- Check current spend via the budget data in Redis or Vercel logs

## Troubleshooting

### Build fails
- Check Vercel build logs
- Verify all environment variables are set
- Test `npm run build` locally first

### Environment variables not working
- Check spelling and capitalization exactly
- Verify "Preview" and "Development" checkboxes are ticked for Supabase vars
- Redeploy after adding/changing variables

### OAuth redirect fails
- Add production URL to Supabase OAuth allowlist
- Format: `https://your-app.vercel.app/auth/callback`
- Also add to **Supabase Dashboard → Authentication → URL Configuration → Redirect URLs**

### Rate limiting doesn't work
- Check Upstash Redis credentials
- Verify Upstash region matches Vercel deployment region (use the same region for lowest latency)

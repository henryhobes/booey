# Task 2: Dynamic OAuth Redirects

## Problem
OAuth callbacks currently hardcode `https://booey.ai/auth/callback`, so signing in on Vercel preview deployments redirects users to production instead of staying on the preview URL.

## Solution
Use Vercel's automatic environment variables to construct dynamic redirect URLs based on the current deployment.

## Requirements

### 1. Update Auth Callback Route (`src/app/auth/callback/route.ts`)
- Use `NEXT_PUBLIC_VERCEL_URL` or `NEXT_PUBLIC_SITE_URL` to construct the redirect URL dynamically
- Fallback to `https://booey.ai` for production if env vars not set
- Support both preview and production deployments

### 2. Update Sign-In Logic (client-side components)
- Pass `redirectTo` parameter to Supabase sign-in with current deployment URL
- Construct redirect URL using `window.location.origin + '/auth/callback'`
- Ensure this works on both production (`booey.ai`) and preview (`*.vercel.app`)

### 3. Environment Variable Setup
Vercel provides these automatically:
- `NEXT_PUBLIC_VERCEL_URL` - The deployment URL (without protocol)
- `VERCEL_ENV` - Environment type (production/preview/development)

No new env vars needed — use Vercel's built-ins.

## Acceptance Criteria
- [ ] Signing in on `booey.ai` redirects to `booey.ai`
- [ ] Signing in on a preview deployment (e.g., `booey-git-main-henryhobes.vercel.app`) redirects to that same preview URL
- [ ] Local development (`localhost:3000`) still works
- [ ] No hardcoded URLs in auth flow

## Notes
- Supabase already has `https://*.vercel.app/auth/callback` whitelisted
- This is purely a client-side/routing fix — no Supabase config changes needed
- Test on a preview deployment after merging

## Files to Modify
- `src/app/auth/callback/route.ts` - Dynamic redirect URL construction
- Any client components that trigger sign-in (likely in `src/components/` or pages)

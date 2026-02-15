# Booey — Vercel Deployment Checklist & Best Practices

## Stack Summary
- **Framework:** Next.js (App Router)
- **Auth/DB:** Supabase (SSR + client)
- **AI:** Anthropic Claude SDK (server-side)
- **Styling:** Tailwind CSS + DaisyUI

---

## 1. Environment Variables

### Variable Inventory
| Variable | Scope | Environments |
|----------|-------|-------------|
| `ANTHROPIC_API_KEY` | Server only | Preview, Production |
| `NEXT_PUBLIC_SUPABASE_URL` | Client (`NEXT_PUBLIC_`) | All |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Client (`NEXT_PUBLIC_`) | All |
| `SUPABASE_SECRET_KEY` | Server only | Preview, Production |

### Best Practices
- **Never commit `.env.local`** — already in `.gitignore`
- **Use separate Supabase projects** for dev/preview vs production (different URLs, different keys)
- **Set env vars per environment in Vercel Dashboard:**
  - Go to Project → Settings → Environment Variables
  - For each variable, check which environments it applies to: ✅ Production, ✅ Preview, ☐ Development
  - Use **different API keys** for Preview vs Production (especially Anthropic — set spending limits on preview key)
- **Pull env vars locally** with `vercel env pull` (creates `.env.local`)
- **`NEXT_PUBLIC_` prefix** = bundled into client JS. Only use for truly public values (Supabase URL/anon key are fine)

### Recommended Setup
```
Production:
  ANTHROPIC_API_KEY=sk-prod-...          (production key with higher limits)
  SUPABASE_SECRET_KEY=<prod-service-key>
  NEXT_PUBLIC_SUPABASE_URL=https://prod-project.supabase.co
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<prod-anon-key>

Preview:
  ANTHROPIC_API_KEY=sk-dev-...           (dev key with low spending cap)
  SUPABASE_SECRET_KEY=<dev-service-key>
  NEXT_PUBLIC_SUPABASE_URL=https://dev-project.supabase.co
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<dev-anon-key>
```

---

## 2. Build Optimization

### next.config.ts Recommendations
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Reduce bundle size — only import what you use
  experimental: {
    optimizePackageImports: ["@anthropic-ai/sdk"],
  },
  // Compress responses
  compress: true,
  // Strict mode for catching bugs
  reactStrictMode: true,
  // Output standalone for smaller deployments (optional)
  // output: "standalone",
};

export default nextConfig;
```

### Bundle Size Tips
- **Anthropic SDK is server-only** — ensure it's only imported in Server Components, Route Handlers, or Server Actions. Never import in client components.
- **Analyze bundle:** Add `@next/bundle-analyzer` as a dev dep:
  ```bash
  npm i -D @next/bundle-analyzer
  ```
  Wrap config: `const withBundleAnalyzer = require('@next/bundle-analyzer')({ enabled: process.env.ANALYZE === 'true' })`
- **Dynamic imports** for heavy client components: `const Heavy = dynamic(() => import('./Heavy'))`
- **Tree-shaking:** Use named imports (`import { createClient } from '@supabase/supabase-js'`)

### Build Time Tips
- Vercel free tier: **6,000 build minutes/month**
- Cancelled builds still count — avoid pushing broken commits
- Use `.vercelignore` to exclude unnecessary files:
  ```
  docs/
  planning/
  *.md
  !README.md
  ```

---

## 3. Preview vs Production Deployments

### How It Works
| Trigger | Environment | URL |
|---------|-------------|-----|
| Push to `main` | **Production** | `booey.vercel.app` + custom domain |
| Push to any other branch | **Preview** | `booey-<hash>.vercel.app` |
| PR opened | **Preview** | Auto-commented on PR |
| `vercel` CLI (no flag) | **Preview** | Generated URL |
| `vercel --prod` CLI | **Production** | Production domains |

### Workflow
1. **Develop** on feature branches → auto-preview on push
2. **Test** using preview URL (share with testers, check on mobile)
3. **Merge PR to `main`** → auto-production deploy
4. **Instant rollback** in Vercel Dashboard if something breaks

### Preview Deploy Tips
- Preview deployments use **Preview** env vars (separate Supabase DB = safe to test)
- Comment preview URLs on PRs for easy QA
- Use Vercel's **Deployment Protection** to password-protect previews (free tier: Vercel Authentication)

---

## 4. Domain & SSL

### Custom Domain Setup
1. **Buy/own domain** (e.g., `booey.app`, `getbooey.com`)
2. In Vercel Dashboard → Project → Settings → Domains → Add domain
3. **DNS Configuration** (two options):
   - **Recommended: Nameservers** — Point domain nameservers to Vercel (`ns1.vercel-dns.com`, `ns2.vercel-dns.com`). Vercel manages everything.
   - **Alternative: CNAME/A record** — Add `CNAME` pointing to `cname.vercel-dns.com` (for subdomains) or `A` record to `76.76.21.21` (for apex)
4. SSL is **automatic and free** — Vercel provisions Let's Encrypt certs
5. **www redirect:** Add both `booey.com` and `www.booey.com`, Vercel auto-redirects one to the other

### Checklist
- [ ] Domain purchased and DNS configured
- [ ] SSL certificate auto-provisioned (check green lock)
- [ ] www → apex redirect working
- [ ] Old URLs redirect properly (if migrating)

---

## 5. Performance Monitoring & Analytics

### Built-in Vercel Tools (Free Tier)
- **Speed Insights** — Core Web Vitals (LCP, FID, CLS) from real users. Enable in Dashboard → Project → Speed Insights. Add to app:
  ```tsx
  // app/layout.tsx
  import { SpeedInsights } from "@vercel/speed-insights/next";
  // Add <SpeedInsights /> in layout body
  ```
- **Web Analytics** — Page views, visitors, referrers. Enable similarly:
  ```tsx
  import { Analytics } from "@vercel/analytics/react";
  // Add <Analytics /> in layout body
  ```
- **Logs** — Runtime & build logs in Dashboard (real-time for debugging)
- **Functions tab** — Serverless function execution times, cold starts, errors

### Third-Party (Add Later If Needed)
- **Sentry** — Error tracking with source maps (free tier generous)
- **PostHog** — Product analytics, session replay (generous free tier)
- Don't add these until you have real users — premature optimization

---

## 6. CI/CD with GitHub

### Setup
1. **Connect repo** at [vercel.com/new](https://vercel.com/new) → Import Git Repository
2. Vercel auto-detects Next.js, configures build settings
3. Every push triggers deploy (preview or production based on branch)

### Recommended GitHub Settings
- **Branch protection on `main`:**
  - Require PR reviews before merge
  - Require Vercel deployment to succeed (status check)
- **Vercel bot** auto-comments preview URLs on PRs

### Build Settings (Vercel Dashboard)
- **Build Command:** `next build` (default)
- **Output Directory:** `.next` (default, auto-detected)
- **Install Command:** `npm install` (default)
- **Node.js Version:** 20.x (match your local version)

### Optional: Add Lint/Type Check to Build
```json
// package.json
"scripts": {
  "build": "next lint && tsc --noEmit && next build"
}
```
This catches errors before deployment. Trade-off: slightly longer builds.

---

## 7. Free Tier Cost Optimization

### Hobby Plan Limits (as of 2025)
| Resource | Limit |
|----------|-------|
| Bandwidth | 100 GB/month |
| Serverless Function Executions | 100,000/month |
| Serverless Function Duration | 100 GB-hours/month |
| Build Minutes | 6,000/month |
| Image Optimization | 1,000 source images/month |
| Deployments | Unlimited |

### Tips to Stay Free
1. **Anthropic calls are the bottleneck** — Each chat message = serverless function invocation + duration. Rate-limit users early.
2. **Set function `maxDuration`** to prevent runaway costs:
   ```typescript
   // In route handlers
   export const maxDuration = 30; // seconds
   ```
3. **Use Edge Runtime** for lightweight routes (faster cold starts, cheaper):
   ```typescript
   export const runtime = 'edge'; // Only for routes that don't need Node.js APIs
   ```
   ⚠️ Anthropic SDK may need Node.js runtime — test before switching.
4. **Cache aggressively:**
   - Static pages via ISR (`revalidate: 3600`)
   - API responses with `Cache-Control` headers
   - Supabase queries that don't change often
5. **Minimize preview deploys** — Don't push WIP commits constantly. Use `git commit --amend` + force push on feature branches.
6. **Cancel unnecessary builds** — If you push 3 commits quickly, cancel the first 2 in Dashboard.
7. **No `next/image` optimization abuse** — 1,000 source images/month on free tier. Use external image CDN if needed.

---

## 🚀 Production Launch Checklist

### Pre-Launch
- [ ] **Env vars set** for Production environment in Vercel Dashboard
- [ ] **Separate Supabase project** for production (not sharing dev DB)
- [ ] **Supabase RLS policies** reviewed and locked down
- [ ] **API routes protected** — auth checks on all sensitive endpoints
- [ ] **Rate limiting** on Anthropic-calling routes (to control costs)
- [ ] **Error boundaries** in place for graceful failures
- [ ] **`next build` succeeds locally** with no warnings
- [ ] **Bundle analyzed** — no unexpected large dependencies
- [ ] **Lighthouse score** checked (aim for 90+ on Performance)

### Deploy
- [ ] **Connect GitHub repo** to Vercel
- [ ] **Verify build succeeds** on Vercel (check build logs)
- [ ] **Test preview deployment** thoroughly before going to production
- [ ] **Custom domain** added and DNS propagated
- [ ] **SSL certificate** provisioned (auto)
- [ ] **Force HTTPS** enabled (default)

### Post-Launch
- [ ] **Speed Insights** enabled and `<SpeedInsights />` in layout
- [ ] **Web Analytics** enabled and `<Analytics />` in layout
- [ ] **Monitor function usage** in Vercel Dashboard (first week)
- [ ] **Set up Vercel spending alerts** (Settings → Billing)
- [ ] **Test on mobile** — real device, not just DevTools
- [ ] **Share and get feedback!**

### Quick Commands Reference
```bash
# Link local project
vercel link

# Pull env vars
vercel env pull

# Deploy preview
vercel

# Deploy production
vercel --prod

# Check deployment status
vercel ls
```

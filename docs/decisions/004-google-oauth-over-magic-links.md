# ADR-004: Google OAuth Over Magic Links

**Status:** Accepted (supersedes original magic link decision)  
**Date:** 2026-02-14

## Decision
Use Google OAuth via Supabase Auth instead of magic links.

## Context
Originally planned magic links (passwordless email). Switched during Phase 2 because:
- Magic links have deliverability issues (spam folders, delays)
- Target demographic already has Google accounts
- One-click sign-in is faster than checking email

## Implementation
- Supabase Auth with Google provider
- Dynamic redirect URLs for Vercel preview deployments (`src/lib/utils/get-base-url.ts`)
- Sign-in page at `app/auth/sign-in/page.tsx`
- Callback handler at `app/auth/callback/route.ts`

## Note
Dead magic link code still exists in codebase (see TECH-DEBT.md TD-005).

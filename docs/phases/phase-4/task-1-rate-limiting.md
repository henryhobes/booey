# Phase 4 Task 1: Rate Limiting

**Estimated Time:** 1.5 hours  
**Branch:** `phase-4/rate-limiting`  
**PR:** Will open as #13

---

## Goal

Implement user-based rate limiting to protect Claude API costs and prevent abuse.

---

## Requirements

### Functional

1. **Dual Rate Limits:**
   - Daily limit: 20 interactions per user (sliding window)
   - Burst limit: 5 interactions per minute per user
   
2. **Tracking:**
   - Auth-based: Use Supabase `user.id` for logged-in users
   - Guest tracking: Use try-before-signup localStorage flag (already implemented)
   
3. **Enforcement:**
   - Check limits in `/api/generate` route before calling Claude
   - Return 429 status with clear error message when limit exceeded
   
4. **UI Display:**
   - Show remaining daily quota somewhere visible (navbar or wizard)
   - Update quota after each interaction
   - Display helpful message when limit hit (with reset time)

5. **Error Handling:**
   - Graceful degradation if Redis is down (log error, allow request)
   - Clear user-facing error messages

### Technical

1. **Upstash Redis:**
   - Sign up for free tier at https://upstash.com
   - Create a database (choose Vercel-optimized edge region)
   - Get connection URL and token
   - Add to `.env.local`:
     ```
     UPSTASH_REDIS_REST_URL=https://...
     UPSTASH_REDIS_REST_TOKEN=...
     ```

2. **Implementation Pattern:**
   ```typescript
   // Rate limit check before Claude API call
   const userId = user?.id || 'guest';
   const limits = await checkRateLimit(userId);
   
   if (!limits.allowed) {
     return NextResponse.json(
       { error: 'Rate limit exceeded', resetAt: limits.resetAt },
       { status: 429 }
     );
   }
   
   // ... proceed with Claude API call
   
   // Increment usage after successful generation
   await incrementUsage(userId);
   ```

3. **Files to Modify/Create:**
   - `src/lib/rate-limit.ts` - Rate limiting logic with Upstash Redis
   - `src/app/api/generate/route.ts` - Add rate limit checks
   - `src/components/RateLimitBadge.tsx` (optional) - Show quota in UI
   - `.env.example` - Document Upstash env vars

---

## Implementation Steps

1. **Set up Upstash Redis:**
   - Create account and database
   - Get connection credentials
   - Install `@upstash/redis` package: `npm install @upstash/redis`

2. **Create rate limiting utility:**
   - `src/lib/rate-limit.ts`:
     - `checkRateLimit(userId)` - Check if user can make request
     - `incrementUsage(userId)` - Increment counters after successful request
     - Use Redis sorted sets for sliding window
     - Store two keys per user: `daily:{userId}` and `minute:{userId}`

3. **Update API route:**
   - Add rate limit check at start of `/api/generate`
   - Return 429 with helpful error if exceeded
   - Increment usage after successful Claude call

4. **Add UI feedback (optional but recommended):**
   - Create component to show remaining quota
   - Fetch current usage from new `/api/quota` endpoint
   - Display in navbar or wizard

5. **Test:**
   - Hit endpoint 20 times rapidly (should allow first 20, block 21st)
   - Wait 1 minute, try again (burst limit resets)
   - Check error messages are helpful
   - Verify quota resets after 24 hours

---

## Acceptance Criteria

- ✅ Upstash Redis connected and working
- ✅ Daily limit (20/day) enforced correctly
- ✅ Burst limit (5/min) enforced correctly
- ✅ Clear error message shown when limit exceeded
- ✅ Quota visible in UI (optional but nice)
- ✅ Guest users limited to 1 free use (already implemented)
- ✅ No errors if Redis is temporarily down
- ✅ PR opened with Codex review passed

---

## Notes

- **Free tier:** Upstash free tier has 10,000 commands/day (plenty for MVP)
- **Sliding window:** Use Redis sorted sets with timestamps (research doc has example)
- **Grace period:** Consider showing warning at 15/20 uses
- **Future:** Can add paid tiers by increasing limits based on subscription
- **Testing:** Can temporarily lower limits (e.g., 3/day) for easier testing

---

## Reference

Research: `memory/projects/booey/research-rate-limiting.md` (created by subagent)

Key recommendations from research:
- Upstash Redis (Vercel-optimized, edge-compatible)
- Sliding window algorithm for fairest distribution
- Transparent UX with proactive quota display
- Dual limits (daily + burst) prevent both sustained abuse and sudden spikes

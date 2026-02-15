# Phase 5 Task 2: Cost Monitoring & Alerting

## Goal
Implement budget tracking and alerting to prevent runaway API costs.

## Requirements

### 1. Daily Budget Tracking Middleware
**Purpose:** Track Anthropic API spending and auto-stop if threshold exceeded.

**Implementation:**
- Create `src/lib/budget.ts` with daily spend tracking (store in Upstash Redis)
- Each `/api/generate` call logs token usage × cost (Haiku 3.5: $0.25/MTok input, $1.25/MTok output)
- Check budget before API call; return 429 if exceeded
- Daily limit: $5 (safety cap, ~2,000 interactions on Haiku)

**Data structure in Redis:**
```typescript
// Key: budget:YYYY-MM-DD
// Value: { spent: 0.00, interactions: 0, lastReset: timestamp }
```

### 2. Kill Switch Environment Variable
**Purpose:** Instant manual shutoff for emergencies.

**Implementation:**
- Check `EMERGENCY_STOP=true` env var at start of `/api/generate`
- If set, return 503 with maintenance message
- Document in DEPLOY.md and .env.example

### 3. Cost Alerting via ntfy.sh
**Purpose:** Push notifications when approaching budget limits.

**Thresholds:**
- 50% daily budget → warning
- 75% daily budget → alert
- 90% daily budget → critical

**Implementation:**
- Use ntfy.sh free tier (no signup required)
- POST to `https://ntfy.sh/booey-cost-alerts-${RANDOM_ID}` when thresholds crossed
- Include: spent amount, remaining budget, interaction count
- Only send once per threshold per day (track in Redis)

**Example notification:**
```
⚠️ Booey Cost Alert: 75% Budget Used
Spent: $3.75 / $5.00
Interactions: 1,500
Time: 7:30 PM EST
```

### 4. Budget Dashboard (Nice-to-Have)
If time permits, add `/api/budget` endpoint that returns current spend stats for admin view.

## Files to Create/Modify
- `src/lib/budget.ts` (new)
- `src/app/api/generate/route.ts` (add budget checks)
- `.env.example` (add `DAILY_BUDGET_USD`, `EMERGENCY_STOP`, `NTFY_TOPIC`)
- `DEPLOY.md` (document budget monitoring setup)

## Environment Variables
```bash
# Cost Protection
DAILY_BUDGET_USD=5.00
EMERGENCY_STOP=false
NTFY_TOPIC=booey-cost-alerts-abc123  # Random ID for security
```

## Acceptance Criteria
- [ ] Daily spend tracked in Redis (token usage × pricing)
- [ ] Budget enforcement: returns 429 when daily limit exceeded
- [ ] Kill switch works (EMERGENCY_STOP=true blocks all requests)
- [ ] ntfy.sh alerts fire at 50/75/90% thresholds
- [ ] .env.example and DEPLOY.md updated with setup instructions
- [ ] Build passes, TypeScript clean

## Cost Calculations
- Haiku 3.5 pricing: $0.25/MTok input, $1.25/MTok output
- Average interaction: ~500 input tokens + ~1,000 output tokens
- Cost per interaction: ~$0.0015
- $5 daily budget = ~3,333 interactions/day (way more than 20/user rate limit allows)

## Notes
- This is a safety net on top of rate limiting (which is the primary cost control)
- Budget tracking is independent of rate limiting (tracks spend, not count)
- ntfy.sh is free, no auth required, perfect for MVP alerting

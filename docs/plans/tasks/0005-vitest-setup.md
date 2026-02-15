# Task 0005: Add Vitest Testing Framework

## Goal
Set up Vitest with targeted, high-value tests. Be stingy — only test where bugs would cost money or break core functionality.

## Setup
1. Install dependencies:
   ```bash
   npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react vite-tsconfig-paths
   ```
2. Create `vitest.config.ts`:
   ```typescript
   import { defineConfig } from 'vitest/config'
   import react from '@vitejs/plugin-react'
   import tsconfigPaths from 'vite-tsconfig-paths'
   
   export default defineConfig({
     plugins: [react(), tsconfigPaths()],
     test: {
       environment: 'jsdom',
     },
   })
   ```
3. Add scripts to `package.json`:
   ```json
   "test": "vitest run",
   "test:watch": "vitest"
   ```
4. Add `test` job to `.github/workflows/ci.yml` (parallel with lint/typecheck/build)

## Tests to Write

### HIGH PRIORITY — Money/Safety Critical

**`src/lib/rate-limit.test.ts`** (~10 tests)
Mock Redis (Upstash). Test:
- Fresh user → allowed, full quota (20 daily, 5/min)
- User at daily limit → blocked, dailyRemaining=0
- User at minute limit → blocked, minuteRemaining=0
- Expired entries cleaned up (older than 24h/1min)
- `resetAt` calculated correctly
- `incrementUsage()` adds to both daily and minute keys
- Redis failure → gracefully allows request (fail-open)
- Rolling window: user who hit limit 23h ago can use again

**`src/lib/budget.test.ts`** (~10 tests)
Mock Redis. Test:
- `isEmergencyStopped()` reads env var correctly
- Cost calculation accurate (input/output tokens × rates)
- Budget exceeded → blocks when spent >= limit
- `recordSpend()` accumulates correctly
- Threshold alerts fire at 50%, 75%, 90%
- Alerts only fire once per day (NX flag)
- TTL set correctly (25h)
- Graceful degradation when Redis unavailable
- Budget resets daily (new key per UTC day)

### MEDIUM PRIORITY — Logic with Edge Cases

**`src/lib/use-cases.test.ts`** (~6 tests)
Only test `validateRequiredAnswers()`:
- Missing required string → returns field ID
- Missing required multiselect (empty array) → returns field ID
- Empty string → returns field ID
- All required present → returns empty array
- null/undefined values handled
- Non-required fields can be missing

## What NOT to Test
- Zod schemas (testing the framework)
- `claude.ts` (SDK delegation, needs integration tests)
- `use-cases/index.ts` (build-time validation)
- `utils/errors.ts` (trivial class definition)
- `utils/get-base-url.ts` (env var logic)
- Static components that just render props

## File Convention
Co-locate tests: `rate-limit.test.ts` next to `rate-limit.ts`

## CI Integration
Add parallel `test` job to `.github/workflows/ci.yml`:
```yaml
test:
  needs: setup
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
    - run: npm ci
    - run: npm run test
```

## Acceptance Criteria
- [ ] Vitest configured and working
- [ ] `npm run test` script added
- [ ] rate-limit tests pass (~10)
- [ ] budget tests pass (~10)
- [ ] validateRequiredAnswers tests pass (~6)
- [ ] CI workflow updated with test job
- [ ] `npm run build` and `npm run lint` still pass
- [ ] No coverage enforcement (informative only)

## Total: ~26 targeted tests

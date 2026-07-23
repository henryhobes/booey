# Booey — Testing Strategy

## Current State

**Test coverage: focused** — Vitest is configured (`vitest.config.ts`) with unit tests for the `rate-limit`, `budget`, and `use-cases` modules (28 tests). These cover the logic most worth protecting: cost caps, rate limiting, and answer validation. No component or E2E tests; UI QA was manual, browser-based.

## Target Testing Pyramid

### Unit Tests (Priority: P1)
- **Scope:** Utility functions, validation logic, data transformers
- **Files:** `lib/validation.ts`, `lib/utils/`, `lib/use-cases.ts`, `lib/rate-limit.ts`
- **Framework:** Vitest (fast, native TypeScript, compatible with Next.js)
- **Goal:** Cover all pure functions and data logic

### Integration Tests (Priority: P1)
- **Scope:** API routes (`/api/generate`, `/api/quota`, `/api/sessions`)
- **What to test:** Input validation, auth checks, rate limiting, error responses
- **Framework:** Vitest + `next/test-utils` or `supertest`
- **Goal:** Verify API contracts without calling external services (mock Anthropic, Supabase)

### Component Tests (Priority: P2)
- **Scope:** Wizard flow, form components, result display
- **Framework:** Vitest + Testing Library
- **Goal:** Verify user interactions, form validation, state management

### E2E Tests (Priority: P3)
- **Scope:** Full user journeys (browse → select → wizard → result → save)
- **Framework:** Playwright
- **Goal:** Catch integration issues across the full stack

## QA Process (Current — Manual)

### For All UI Changes
1. **Pass 1 — Functional:** Does it work? Click everything, fill forms, check edge cases
2. **Pass 2 — Visual:** Does it look right? Check mobile (390x844), tablet (768x1024), desktop (1440x900)
3. **Pass 3 — Accessibility:** Tab navigation, screen reader basics, contrast
4. **Pass 4 — Edge Cases:** Empty states, long text, network errors, rapid clicks

### For API Changes
1. Test happy path with valid inputs
2. Test with missing/invalid inputs (should return clear errors)
3. Test auth (unauthenticated requests should be rejected)
4. Test rate limiting (verify limits are enforced)

## Local Verification (Before Committing)

1. `npm run lint` — must pass clean
2. `npm run typecheck` — `tsc --noEmit`, must pass
3. `npm test` — Vitest, must pass
4. `npm run build` — must pass
5. For UI changes: boot the dev server, verify the change, and check the 375px mobile viewport

## CI Pipeline

GitHub Actions (`.github/workflows/ci.yml`) runs four jobs in parallel on every PR and push to `main`, sharing a cached `node_modules` install:

- **lint** — `npm run lint` (ESLint, incl. import-boundary enforcement)
- **typecheck** — `tsc --noEmit`
- **test** — `npm test` (Vitest)
- **build** — `npm run build` (with placeholder Supabase env)

# Booey — Testing Strategy

## Current State

**Test coverage: 0%** — No automated tests exist yet. QA is manual (browser-based via Frank).

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

## Agent Self-Testing

Agents should verify their own changes before opening PRs:
1. Run `npm run build` — must pass
2. Run `npm run lint` — must pass clean
3. Boot the dev server and verify the change works (if UI change)
4. Check mobile viewport (375px) for responsive changes
5. Run existing tests (when they exist): `npm test`

## CI Pipeline

- **GitHub Actions:** Runs `npm install && npm run build` on all PRs
- **Future:** Add `npm test` to CI once test suite exists

# Booey — Technical Debt

Last updated: 2026-02-15

## Known Debt

### P0 — Address Soon

| ID | Area | Description | Impact |
|----|------|-------------|--------|
| TD-001 | Testing | Zero test coverage | Can't verify regressions, relying entirely on CI build + manual QA |
| TD-002 | Observability | No structured logging | Hard to debug production issues, no request correlation |
| TD-003 | Observability | No error tracking (Sentry) | User-facing errors invisible unless reported |

### P1 — Address When Relevant

| ID | Area | Description | Impact |
|----|------|-------------|--------|
| TD-004 | Data | Use cases hardcoded in JSON | Can't add/edit without deploy. Fine for MVP, blocks user-submitted use cases |
| TD-005 | Auth | Magic link code still in codebase | Dead code from pre-OAuth migration. Should clean up |
| TD-006 | History | No pagination or search | Will break with many sessions |
| TD-007 | Types | Some types duplicated between files | `index.ts` types vs inline definitions in components |
| TD-008 | Caching | Cache invalidation is time-based only | No way to bust cache for specific use cases |

### P2 — Nice to Have

| ID | Area | Description | Impact |
|----|------|-------------|--------|
| TD-009 | Build | No bundle analysis | Don't know if we're shipping unnecessary code |
| TD-010 | Perf | No image optimization pipeline | All assets served unoptimized |
| TD-011 | DX | No local Supabase for dev | Dev hits production DB (separate project but still) |

## Resolved

| ID | Resolved In | Description |
|----|-------------|-------------|
| — | Phase 4 | No rate limiting (fixed: Upstash Redis) |
| — | Phase 4 | No RLS policies (fixed: Supabase RLS) |
| — | Phase 5 | No response caching (fixed: Anthropic + Supabase cache) |
| — | Phase 6 | Poor mobile UX (fixed: bottom nav, touch targets, keyboard handling) |
| — | Phase 6 | No trust signals (fixed: testimonials, founder story, privacy section) |

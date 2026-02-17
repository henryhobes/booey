# Task 0022: Documentation Gardening Cleanup

## Summary
Fix 4 stale/inaccurate documentation references across the repo.

## Fixes
1. **CLAUDE.md** — `docs/plans/active/` → `docs/plans/` (active/ subdirectory doesn't exist)
2. **TECH-DEBT.md** — Move TD-001 (Zero test coverage) to Resolved section (tests now exist in `src/lib/budget.test.ts`, `src/lib/rate-limit.test.ts`, `src/lib/use-cases.test.ts`)
3. **QUALITY.md** — Update Key Gaps #4 to reflect limited test coverage instead of zero
4. **state.md** (clawd workspace) — Update phase status (Phase 7, 8, 9 all complete)

## Acceptance Criteria
- [ ] No references to `docs/plans/active/`
- [ ] TD-001 in Resolved section with note about existing tests
- [ ] QUALITY.md accurately describes test coverage
- [ ] state.md header reflects current phase status
- [ ] `npm run build` passes

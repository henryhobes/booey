# Task 0001: Mobile Quota Badge

**Status:** DONE
**Requested:** 2026-02-15
**Completed:** 2026-02-15
**PR:** #35

## Description
Users on mobile web browser couldn't see how many of their 20 daily uses remained. The `QuotaBadge` component was only rendered in the desktop top nav (`NavAuth`), not in the mobile bottom nav (`MobileBottomNav`).

## Acceptance Criteria
- [x] QuotaBadge visible on mobile bottom nav
- [x] Positioned above nav items, centered
- [x] Doesn't crowd the nav buttons
- [x] Build passes

## Notes
- Added `QuotaBadge` import to `MobileBottomNav.tsx`
- Placed in a centered flex row above the grid of nav icons
- Reuses the same component — no duplication

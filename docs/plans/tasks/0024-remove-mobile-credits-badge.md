# Task: Remove Mobile Credits Badge

**Repo:** `/Users/henryhobin/Projects/booey/`
**Branch:** `fix/remove-mobile-credits-badge`
**Base:** `main`

### Context
QA reported the QuotaBadge ("5/20 left") floats between the bottom nav and content on mobile, creating visual clutter. The badge should be removed from mobile only — desktop (NavAuth) keeps it.

### What to Build
1. **Remove QuotaBadge from MobileBottomNav** (`src/components/nav/MobileBottomNav.tsx`)
   - Remove the QuotaBadge import
   - Remove the `{user && <div>...<QuotaBadge />...</div>}` block
   - Keep QuotaBadge component itself (used by desktop NavAuth)

### Success Criteria
- [ ] QuotaBadge no longer renders in mobile bottom nav
- [ ] QuotaBadge still renders in desktop nav (NavAuth.tsx unchanged)
- [ ] `npm run build` passes
- [ ] No unused imports

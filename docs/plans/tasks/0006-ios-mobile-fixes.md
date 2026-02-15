# Task 0006: iOS Mobile Fixes

## Bugs

### Bug 1: Bottom nav / sticky CTA not respecting iOS safe area
The viewport config is missing `viewportFit: 'cover'`, which means `env(safe-area-inset-bottom)` evaluates to 0 on iOS Safari. The bottom nav and sticky CTA overlap with the home indicator.

**Fix:** In `src/app/layout.tsx`, add `viewportFit: 'cover'` to the viewport export:
```ts
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  userScalable: true,
  viewportFit: 'cover',
};
```

### Bug 2: Quota badge shows for unauthenticated users
`QuotaBadge` always fetches `/api/quota` and renders "X/20 left" even for guests. It should only show for signed-in users.

**Fix:** In `src/components/nav/MobileBottomNav.tsx`, conditionally render `<QuotaBadge />` only when `user` exists:
```tsx
{user && (
  <div className="flex justify-center py-1">
    <QuotaBadge />
  </div>
)}
```

Also check if QuotaBadge is used anywhere else (header, etc.) and apply the same guard.

## Files to modify
- `src/app/layout.tsx` (viewport config)
- `src/components/nav/MobileBottomNav.tsx` (conditional QuotaBadge)
- Any other component rendering QuotaBadge

## Testing
- On iOS Safari: bottom nav should have proper spacing above the home indicator
- Unauthenticated: no quota badge visible anywhere
- Authenticated: quota badge shows as before

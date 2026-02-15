# Task 0007: Fix Sticky CTA overlap with bottom nav

## Bug
The "Explore Tools →" sticky CTA button on the homepage gets cropped/hidden behind the mobile bottom nav when scrolled down on iPhone. The CTA uses `bottom-20` (80px) but the bottom nav is taller (~100px with quota badge row + safe area).

## Fix
In `src/components/landing/StickyCTA.tsx`, change `bottom-20` to `bottom-28` (112px) to properly sit above the bottom nav. Also update the hide transform to match.

Change:
```
fixed bottom-20 ... translate-y-[calc(100%+5rem)]
```
To:
```
fixed bottom-28 ... translate-y-[calc(100%+7rem)]
```

## Files
- `src/components/landing/StickyCTA.tsx`

## Testing
- On iPhone: sticky CTA should be fully visible above the bottom nav when scrolled past the hero
- CTA should still hide smoothly when hero button is visible

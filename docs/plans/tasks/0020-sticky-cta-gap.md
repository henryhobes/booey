# Task 0020: Fix StickyCTA Gap Above Mobile Nav

## Problem
On mobile, the StickyCTA ("Explore Tools →") has a visible gap between it and the bottom nav bar. The CTA uses `bottom-28` (112px) but the actual nav height is ~64px + safe-area-inset-bottom.

## Fix
In `src/components/landing/StickyCTA.tsx`:
- Change `bottom-28` to a calc-based value that sits flush on top of the nav
- The mobile nav is ~64px tall + env(safe-area-inset-bottom)
- Use: `bottom-[calc(64px+env(safe-area-inset-bottom,0px))]`
- Also remove the `pb-[max(0.75rem,env(safe-area-inset-bottom))]` padding since the CTA doesn't need safe-area padding (it's not at the bottom of the screen)
- Update the hide transform to match: `translate-y-[calc(100%+64px+env(safe-area-inset-bottom,0px))]`

## Files
- `src/components/landing/StickyCTA.tsx`

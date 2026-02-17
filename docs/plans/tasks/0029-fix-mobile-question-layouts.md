# Task 0029: Fix Mobile Question Layouts

## Problem
On mobile (390px), both Spectrum and EmojiScale question types cram 4 options horizontally, causing labels to overlap and wrap to 3 lines.

## Fix 1: EmojiScaleQuestion.tsx
- Change container from `flex justify-between gap-2` to responsive grid: `grid grid-cols-2 md:flex md:justify-between gap-3`
- Remove `flex-1` from button className (grid handles sizing)

## Fix 2: SpectrumQuestion.tsx
- Change container from `flex justify-between` to responsive grid: `grid grid-cols-2 md:flex md:justify-between gap-3`
- Hide gradient track on mobile: `hidden md:block`
- Remove `max-w-[80px]` from labels

## Acceptance Criteria
- [ ] On mobile (390px), both question types display in a 2×2 grid
- [ ] On desktop (md+), layout remains horizontal as before
- [ ] `npm run build` passes

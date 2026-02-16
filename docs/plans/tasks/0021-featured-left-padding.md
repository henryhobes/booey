# Task 0021 — Featured Section Left Padding

## Problem
On the Explore page, the Featured section's horizontal scroll tiles have no visible padding between the first tile and the left edge of the screen on mobile.

## Root Cause
The scroll container uses `-mx-4 px-4` to create edge-to-edge scrolling, matching the parent's `px-4`. But `px-4` (16px) isn't enough visual breathing room for the first card tile.

## Fix
In `src/components/explore/ExploreContent.tsx`, change the featured scroll container from `-mx-4 px-4` to `-mx-4 px-5` (or use `-mx-6 px-6` for more breathing room). This gives the first and last tiles slightly more offset from the screen edges.

Alternatively, keep `-mx-4 px-4` but add `pl-5` to give just the left side extra padding.

## Files
- `src/components/explore/ExploreContent.tsx` — featured section scroll div

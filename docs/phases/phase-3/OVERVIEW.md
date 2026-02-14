# Phase 3: Browse + Mobile

**Goal:** Make discovery feel good and work on mobile.

**Timeline:** 2 hours

## Scope

1. **Category System** — Add category tags to use cases, implement filtering
2. **Responsive Design** — Mobile-first layout (single column mobile, 3-column desktop)
3. **UI Polish** — Large tap targets, better card design, accessibility

## Current State

- 19 use cases in catalog (meets "15-20 curated" goal)
- Basic grid layout exists
- Desktop-only responsive

## Tasks

### Task 1: Category System + Filtering
- Add `category` field to use case type
- Tag all 19 use cases with categories (Health, Work, Creative, Personal, etc.)
- Build category filter UI (pills/tabs at top)
- Filter use cases by category on click
- "All" option to show everything

### Task 2: Responsive Design
- Mobile-first CSS (single column on mobile, 3-column on desktop)
- Large tap targets (min 44px)
- Readable fonts on small screens
- Test on mobile viewport

### Task 3: UI Polish
- Polish card design (better shadows, spacing, hover states)
- Improve emoji display
- Better descriptions (one-line, concise)
- Loading states
- Empty states for filtered results

## Success Criteria

✅ Category filtering works (click tag → see filtered use cases)
✅ Mobile responsive (single column, readable, tappable)
✅ Desktop responsive (3-column grid)
✅ Cards look polished (shadows, spacing, hover)
✅ Accessibility basics (contrast, tap targets, keyboard nav)
✅ Someone on phone can browse, filter, pick, complete wizard

## Dependencies

- Phase 1 complete (landing page exists)
- Phase 2 complete (auth works)

---

*Created: 2026-02-14 18:31 EST*

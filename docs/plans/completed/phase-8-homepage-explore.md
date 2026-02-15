# Phase 8: Homepage Redesign + Explore Page

**Goal:** Split the current homepage into a clean modern landing page and a dedicated Explore page for browsing use cases. Make both world-class for the 40-60 demographic.

**Research:** `docs/research/homepage-design-research.md`, `docs/research/use-case-discovery-research.md`

---

## Task 1: New Explore Page — Core Layout & Navigation

**Branch:** `phase-8/explore-page`

Create `/explore` page with bottom nav tab. Netflix-style layout with curated sections.

**Acceptance Criteria:**
- [ ] New route at `/explore` with page component
- [ ] Bottom nav updated: Home | Explore | History (+ Sign In for guests)
- [ ] Explore icon in bottom nav (compass or grid icon)
- [ ] Page structure: Featured section → New This Week → Popular → All Use Cases
- [ ] Each section is a horizontal scrollable row (Featured) or full-width card list (All)
- [ ] Page title: "Explore Tools" (not "Use Cases" — plain language)
- [ ] Mobile-first, single column layout
- [ ] 48px+ touch targets on all interactive elements

**Design Notes:**
- Use case cards: icon + title + one-line description + category pill
- Featured section: 2-3 highlighted cards in horizontal scroll
- "All" section: full-width list cards (easier for older users)
- No search yet (catalog < 50 items)

---

## Task 2: Category Filtering with Horizontal Pills

**Branch:** `phase-8/category-pills`
**Depends on:** Task 1

Add horizontal scrolling category pills to the Explore page.

**Acceptance Criteria:**
- [ ] Horizontal scrolling pill bar below page title
- [ ] "All" pill selected by default
- [ ] One pill per category from use-cases.json (deduplicated)
- [ ] Selected state: filled/bold; unselected: outlined/muted
- [ ] Pill height: 48px minimum touch target
- [ ] Filtering is instant (client-side)
- [ ] Sticky at top of page when scrolling
- [ ] Smooth scroll behavior, no janky overflow

---

## Task 3: "New" and "Popular" Sections

**Branch:** `phase-8/new-popular`
**Depends on:** Task 1

Add curated New and Popular sections to the Explore page.

**Acceptance Criteria:**
- [ ] "New This Week" section showing use cases added in last 14 days
- [ ] "NEW" badge on cards (auto-expires after 14 days based on `addedDate` field)
- [ ] "Popular" section based on usage count (or editorial picks if no data yet)
- [ ] Add `addedDate` field to use-cases.json entries (backfill existing as today's date)
- [ ] Sections collapse gracefully if empty (don't show "New" header with 0 items)
- [ ] Each section shows max 5 items with "See all" link

---

## Task 4: Homepage Redesign — Clean Landing Page

**Branch:** `phase-8/homepage-redesign`

Strip use cases from homepage. Redesign as a clean, modern landing page.

**Acceptance Criteria:**
- [ ] Remove `UseCaseGrid` from homepage
- [ ] New page structure (top to bottom):
  1. **Hero:** Benefit-driven headline + one-line subtitle + single CTA ("Explore Tools") + trust signal
  2. **How It Works:** 3-step visual (icons + short text) — Pick a tool → Answer questions → Get your result
  3. **Benefits:** 3 cards (Guided Questions, Instant Results, Private & Safe) — keep existing
  4. **Social Proof:** 3 testimonial cards with names, photos (placeholder), ratings
  5. **Final CTA:** Repeated primary CTA with supporting text
  6. **Footer:** Privacy info, contact, security badges
- [ ] Single primary CTA repeated 3x (hero, after benefits, bottom)
- [ ] CTA links to `/explore` (not anchor link)
- [ ] Mobile: sticky CTA button at bottom of screen
- [ ] Remove HowItWorks, TestimonialsSection, PrivacySection, TrustBadges as separate sections — consolidate into cleaner layout
- [ ] 18px+ body text, 56px+ CTA buttons, WCAG AA contrast

**Design Notes:**
- Generous whitespace between sections
- No top navigation clutter — clean and focused
- Warm, professional tone (not corporate, not cutesy)
- Real product screenshot or illustration in hero (stretch goal)

---

## Task 5: Update Use Case Links & Navigation Flow

**Branch:** `phase-8/navigation-flow`
**Depends on:** Task 1, Task 4

Ensure all navigation flows work correctly after the split.

**Acceptance Criteria:**
- [ ] Homepage CTA buttons navigate to `/explore`
- [ ] "How It Works" section on homepage links to `/explore`
- [ ] Bottom nav highlights correct active tab
- [ ] Back navigation works correctly (Explore → Use Case → Wizard → back to Explore)
- [ ] Desktop top nav updated (if exists): add Explore link
- [ ] Remove old `#use-cases` anchor references
- [ ] Guest try-before-signup still works from Explore page
- [ ] 404 handling: old direct links to use cases still work

---

## Task 6: Polish & QA

**Branch:** `phase-8/polish`
**Depends on:** Tasks 1-5

Final QA pass across all pages and devices.

**Acceptance Criteria:**
- [ ] QA pass on mobile (iPhone 14 viewport: 390x844)
- [ ] QA pass on tablet (iPad viewport: 768x1024)
- [ ] QA pass on desktop (1440px)
- [ ] All pages load < 3 seconds
- [ ] No layout shift on mobile
- [ ] Keyboard navigation works on Explore page
- [ ] Screen reader announces sections correctly
- [ ] All images have alt text
- [ ] Category pills scroll smoothly on all devices
- [ ] No regressions on wizard flow

---

## Execution Order

```
Task 1 (Explore page core) ──→ Task 2 (Category pills) ──→ Task 3 (New/Popular)
                                                                    ↓
Task 4 (Homepage redesign) ──→ Task 5 (Navigation flow) ──→ Task 6 (Polish & QA)
```

Tasks 1 and 4 can run in parallel (different pages).
Tasks 2 and 3 depend on Task 1.
Task 5 depends on both Task 1 and Task 4.
Task 6 is the final pass after everything merges.

---

## Out of Scope (Future)
- Search functionality (add when catalog > 50)
- Personalized "For You" section (needs usage data)
- "Recently Used" section (needs history tracking on Explore page)
- Onboarding flow asking user goals ("What do you want to do?")
- Video testimonials
- Dynamic hero based on traffic source

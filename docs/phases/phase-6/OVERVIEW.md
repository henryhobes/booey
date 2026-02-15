# Phase 6: UX Makeover — Master Plan

**Target Audience:** 40-60 year olds (non-tech-savvy)  
**Goal:** Transform Booey from functional MVP to warm, trustworthy, delightful experience  
**Duration:** ~2-3 weeks (8 tasks, can run 2-3 in parallel)  
**Build Approach:** v0 for component scaffolding → Cursor for iteration → Claude Code for accessibility review

---

## Research Summary (7 Agents, Feb 14 2026)

### Key Findings

1. **Visual Design** — "Warm professional" style wins: Headspace meets Fidelity. Muted teal + warm cream backgrounds, semi-flat illustrations, generous whitespace, never use unlabeled icons.

2. **Age-Friendly UI** — Non-negotiables: 18px base font, 48×48px touch targets, WCAG AAA contrast (7:1), bottom nav on mobile, never disable pinch-to-zoom.

3. **Trust Signals** — 50% of 50+ cite privacy as #1 barrier. Need: real testimonials with photos/ages, plain-language privacy ("We don't sell your data. Period."), founder story, "what we don't do" messaging.

4. **Wizard UX** — Biggest gap is loading state anxiety. Need: rotating progress messages, answer recap while waiting, welcome screen, review-before-submit.

5. **Results Page** — Currently a dead-end. P0 needs: copy-to-clipboard button, iteration/refinement ("Refine This" button), proper markdown rendering, print support.

6. **Onboarding** — Never say "AI" (use "smart assistant"). Guided first task > product tours. Reassure "you can't break anything" at every anxiety point.

7. **AI-Powered Workflow** — v0 for Figma→code, Cursor with `.cursorrules` for iteration, Claude Code for accessibility. 56px+ buttons, 18px+ fonts, no icon-only actions.

---

## Phase 6 Task Breakdown (Prioritized)

### 🔴 P0: Foundation (Week 1) — Critical UX Gaps

**Task 1: Typography & Accessibility Baseline**
- Bump base font to 18px (from 16px)
- Update all touch targets to 48px minimum
- Add WCAG AAA contrast throughout
- Fix mobile bottom nav (thumb zone)
- **Effort:** 1 day | **Impact:** High — foundation for all other work

**Task 2: Trust Signals — Landing Page**
- Add testimonials section (3 real testimonials with photos/ages/occupations)
- Add plain-language privacy block ("What We Don't Do")
- Add founder story section
- Add "As featured in" logo bar (when applicable)
- Add "No credit card needed" trust badge
- **Effort:** 2 days | **Impact:** Critical — addresses #1 barrier (trust)

**Task 3: Results Page — Core Actionability**
- Add copy-to-clipboard button
- Replace custom parser with react-markdown
- Add print styles (@media print)
- Add "Refine This" iteration button
- Add "Edit Inputs" to go back with pre-filled answers
- **Effort:** 2 days | **Impact:** High — results page is a dead-end currently

---

### 🟡 P1: Delight & Education (Week 2) — Major UX Improvements

**Task 4: Wizard Experience Enhancements**
- Add welcome/intro screen ("We'll ask 3 quick questions, takes ~2 min")
- Add review-before-submit screen (show answers recap)
- Add rotating loading messages during AI generation
- Add helper text to all form fields (examples, descriptions)
- Improve error messages ("Just need your answer here 👆")
- Auto-focus inputs on step change
- **Effort:** 2 days | **Impact:** High — reduces wizard anxiety

**Task 5: Visual Design Refresh**
- Update color palette (deep teal primary, warm cream backgrounds, terracotta accents)
- Add warm illustrations (onboarding, empty states, celebrations)
- Improve card shadows/borders (softer, warmer)
- Add subtle transitions (150-300ms, respects prefers-reduced-motion)
- Update emoji usage (larger, more prominent in use case cards)
- **Effort:** 3 days | **Impact:** High — first impression transformation

**Task 6: Onboarding Flow**
- Add "How It Works" explainer section to landing page
- Add first-time user tooltip tour (optional, dismissible)
- Add reassurance copy ("You can't break anything", "No dumb questions")
- Change "AI" language to "smart assistant" throughout
- Add outcome-focused copy ("Write emails in half the time" vs features)
- **Effort:** 2 days | **Impact:** Medium — education reduces hesitation

---

### 🟢 P2: Polish & Personalization (Week 3) — Nice-to-Haves

**Task 7: Results Page — Personalization**
- Add "People also tried..." related use cases section
- Add "Was this helpful?" thumbs up/down feedback
- Add tone chips (regenerate as: More Formal, Shorter, More Detailed)
- Add Web Share API for mobile sharing
- Add contextual header (use case name + inputs recap)
- **Effort:** 2 days | **Impact:** Medium — engagement & retention

**Task 8: Advanced Accessibility & Mobile**
- Add keyboard navigation throughout
- Add skip-to-content links
- Add breadcrumbs on wizard/results pages
- Improve mobile landscape mode
- Add "back to top" button on long pages
- Run full WCAG AAA audit with axe-core
- **Effort:** 1 day | **Impact:** Medium — final polish for accessibility

---

## Implementation Strategy

### Tools & Workflow

1. **v0 (Vercel)** for initial component scaffolding
   - Break each task into individual components (not full pages)
   - Use shadcn/ui component library (matches DaisyUI aesthetic)
   - Export code → paste into Booey

2. **Cursor** for iterative refinement
   - Create `.cursorrules` with design tokens (colors, spacing, fonts)
   - Include accessibility requirements in every prompt
   - Use `eslint-plugin-jsx-a11y` to catch issues early

3. **Claude Code** for accessibility review & complex refactoring
   - Run after each task completion
   - Prompt: "Review for WCAG AAA compliance, age-friendly patterns, 40-60 demographic"

### Parallel Execution

- **Week 1:** Task 1 (typography) must finish first. Then run Task 2 (trust) + Task 3 (results) in parallel.
- **Week 2:** Task 4 (wizard) and Task 5 (visual design) can run in parallel.
- **Week 3:** Task 6 (onboarding), Task 7 (personalization), Task 8 (a11y) can all run in parallel.

### Browser QA After Each Week

Use browser-use skill to test on booey.ai after each week's tasks are merged. Test with "58-year-old first-time user" lens.

---

## Success Metrics

### Qualitative (User Testing)
- Can a 50+ year old complete a use case without help? (Target: 80%+)
- Do they feel confident trying it? (Survey after first use)
- Do they understand what happened? (Can they explain the result?)

### Quantitative (Analytics)
- Wizard completion rate (Target: 65%+, up from ~45% typical)
- Time to first result (Target: <90 seconds)
- Return user rate (Target: 25%+ within 7 days)
- Results page engagement (copy/share/refine actions)

---

## Design Tokens (for .cursorrules)

```json
{
  "colors": {
    "primary": "#0D7377",
    "primaryLight": "#14AAAF",
    "secondary": "#E07A5F",
    "background": "#FAF8F5",
    "surface": "#FFFFFF",
    "text": "#2D2D2D",
    "textLight": "#5A5A5A",
    "success": "#2D7D3D",
    "warning": "#D68910",
    "error": "#C04848"
  },
  "typography": {
    "baseFontSize": "18px",
    "lineHeight": "1.6",
    "fontFamily": "system-ui, -apple-system, 'Segoe UI', sans-serif",
    "headingWeight": "600"
  },
  "spacing": {
    "cardPadding": "32px",
    "sectionGap": "48px",
    "elementGap": "16px"
  },
  "accessibility": {
    "minTouchTarget": "48px",
    "contrastRatio": "7:1",
    "focusOutline": "3px solid #0D7377"
  }
}
```

---

## Next Steps

1. **Create detailed task specs** for each of the 8 tasks (following TASK-TEMPLATE.md)
2. **Set up .cursorrules** in repo root with design tokens + a11y requirements
3. **Start with Task 1** (Typography & Accessibility Baseline) — foundation for everything else
4. **After Task 1 completes:** Spawn Tasks 2 & 3 in parallel
5. **Weekly QA cycles** with browser testing

---

## Risk Mitigation

### "Design by committee" risk
- Henry has final say on visual direction
- Use research as guide, not gospel
- Ship iteratively, not one massive redesign

### "Over-design for age" risk
- Don't make it feel like a "senior app"
- Keep it professional and warm, not patronizing
- Test with real 40-60 year olds (not our assumptions)

### "Scope creep" risk
- P0 tasks are non-negotiable
- P1 tasks are high-value but can slip
- P2 tasks are nice-to-haves, cut if needed

---

**Ready to start?** Create Task 1 spec and spawn first agent!

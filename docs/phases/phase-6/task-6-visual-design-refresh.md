# Phase 6 Task 6: Visual Design Refresh — "Sunrise Surf AAA"

**Goal:** Apply the new warm, approachable color palette site-wide while maintaining WCAG AAA accessibility.

**Priority:** P1 (after trust signals)

**Estimated time:** 2-3 hours

---

## Overview

Replace the current teal-based palette with "Sunrise Surf AAA" — a warm, friendly color system designed for adults aged 40-60. The new palette uses a dual-shade system:
- **Decorative colors:** Vibrant shades for visual warmth (Sky Blue, Peach Coral, Blush Peach)
- **Text colors:** Darker variants for readability (Ocean Blue, Charcoal Navy)

All text color pairings meet WCAG AAA (7:1 contrast) standards.

---

## New Color Palette

| Role | Name | Hex | Contrast on Sand | Usage |
|------|------|-----|------------------|-------|
| **Primary (Decorative)** | Sky Blue | `#4A90D9` | — | Backgrounds, illustrations, cards, decorative fills |
| **Primary (Text)** | Ocean Blue | `#2C5682` | 7.07:1 ✅ AAA | Links, headers, navigation text |
| **Primary (Hover)** | Ocean Blue Hover | `#244B70` | — | Hover state for Ocean Blue buttons/links |
| **Secondary (Decorative)** | Peach Coral | `#FF8A6C` | — | Accent backgrounds, illustrations, icons |
| **Secondary (Interactive)** | Rust Orange | `#D9663D` | 4.87:1 ⚠️ AA | CTA button backgrounds (with white text) |
| **Secondary (Hover)** | Rust Orange Hover | `#C25833` | — | Hover state for Rust Orange buttons |
| **Accent** | Blush Peach | `#FFD4B8` | — | Hover states, tags, badges (decorative only) |
| **Neutral (Text)** | Charcoal Navy | `#2C3E50` | 10.21:1 ✅ AAA | Body text, headings, AAA buttons |
| **Neutral (Hover)** | Charcoal Navy Hover | `#1E2B37` | — | Hover state for Charcoal Navy buttons |
| **Neutral (Background)** | Sand | `#FFF5EB` | — | Page backgrounds, cards, input fields |
| **Neutral (White)** | Pure White | `#FFFFFF` | — | Text on dark buttons |

---

## Design Rules (Critical!)

### 1. NEVER use decorative colors for text
- Sky Blue (#4A90D9), Peach Coral (#FF8A6C), and Blush Peach (#FFD4B8) are **visual-only**
- They fail WCAG contrast requirements for readable text
- Use only for backgrounds, fills, illustrations, icons

### 2. ALL readable text must use:
- **Ocean Blue (#2C5682)** for links, headers, navigation text on Sand
- **Charcoal Navy (#2C3E50)** for body text, headings on Sand
- **Pure White (#FFFFFF)** on dark backgrounds (Charcoal Navy, Rust Orange)
- Never use pure black (#000000)

### 3. Button Styles

#### Primary CTA (AAA compliance):
```tsx
// Background: Charcoal Navy, Text: White
className="bg-[#2C3E50] text-white hover:bg-[#1E2B37]"
```

#### Secondary CTA (AA compliance, warmer):
```tsx
// Background: Rust Orange, Text: White
className="bg-[#D9663D] text-white hover:bg-[#C25833]"
```

#### Ghost Button:
```tsx
// Border & text: Ocean Blue, hover: fill Ocean Blue
className="border-2 border-[#2C5682] text-[#2C5682] hover:bg-[#2C5682] hover:text-white"
```

### 4. 60-30-10 Color Distribution
- **60%:** Sky Blue + Ocean Blue (primary brand color, backgrounds + text)
- **30%:** Peach Coral + Rust Orange (secondary accents, CTAs)
- **10%:** Blush Peach (subtle accents, hover states)

### 5. Sand (#FFF5EB) is the default background
- Replace all `bg-white` with `bg-[#FFF5EB]` or use CSS variable
- Use for pages, cards, input fields
- Maintains warmth vs pure white sterility

---

## Implementation Checklist

### 1. Update Component Styles

#### Landing Page (`src/app/page.tsx`)
- [ ] Hero section: Sky Blue decorative background (`bg-[#4A90D9]`)
- [ ] CTA button: Charcoal Navy with white text, hover state
- [ ] Section headings: Ocean Blue text (`text-[#2C5682]`)
- [ ] Body text: Charcoal Navy (`text-[#2C3E50]`)
- [ ] Page background: Sand (`bg-[#FFF5EB]`)
- [ ] Use case cards: White cards on Sand background, Sky Blue accents

#### Navigation (`src/components/nav/`)
- [ ] NavBar: Sand background, Ocean Blue links
- [ ] Active link: Ocean Blue with underline or bold
- [ ] Hover state: Ocean Blue hover color
- [ ] MobileBottomNav: Same color scheme

#### Wizard Components (`src/components/wizard/`)
- [ ] Welcome screen: Sky Blue decorative elements
- [ ] Question cards: White cards on Sand, Ocean Blue labels
- [ ] Primary button (Generate): Charcoal Navy with white text
- [ ] Secondary button (Back): Ghost style with Ocean Blue
- [ ] Progress bar: Ocean Blue fill, Blush Peach background
- [ ] Helper text: Charcoal Navy at 0.7 opacity

#### Results Page (`src/components/wizard/Result.tsx`)
- [ ] Action buttons: Charcoal Navy primary, Ocean Blue ghost for secondary
- [ ] Refine modal: Sand background, Ocean Blue accents
- [ ] Copy button: Rust Orange for warm CTA feel
- [ ] Print styles: Already monochrome, no changes needed

#### Auth Components (`src/components/auth/`)
- [ ] Sign-in card: White card on Sand background
- [ ] Google OAuth button: Keep Google's brand colors (exception to palette)
- [ ] Helper text: Charcoal Navy at reduced opacity

#### History Page (`src/app/history/`)
- [ ] Session cards: White on Sand, Ocean Blue timestamps
- [ ] Empty state: Sky Blue decorative icon
- [ ] Hover state: Blush Peach background tint

#### Trust Signal Components (Task 5)
- [ ] Testimonial cards: White cards, Ocean Blue names/quotes
- [ ] Privacy section: Sky Blue decorative accents
- [ ] Founder story: Peach Coral background tint
- [ ] Trust badges: Ocean Blue checkmarks

### 2. Update Global Styles

#### `src/app/globals.css`
- [x] Update `@theme inline` variables (already done)
- [x] Update DaisyUI theme colors (already done)
- [x] Update focus indicator to Ocean Blue (already done)
- [x] Update mobile nav colors (already done)
- [ ] Add hover state utilities

#### Add Hover Utilities:
```css
/* Button hover states */
.btn-primary-hover {
  background-color: #1E2B37; /* Charcoal Navy -10% */
}

.btn-secondary-hover {
  background-color: #C25833; /* Rust Orange -10% */
}

.btn-ghost-hover {
  background-color: #2C5682; /* Ocean Blue fill */
  color: #FFFFFF;
}

/* Link hover */
.link-hover {
  color: #244B70; /* Ocean Blue -10% */
}
```

### 3. Create Tailwind Utilities

#### `src/styles/colors.ts` (already created)
Export as Tailwind-compatible utilities:

```tsx
// In components, use:
import { colors } from '@/styles/colors';

<div className="bg-[${colors.primary.decorative}]">
  <h1 className="text-[${colors.primary.text}]">
```

Or add to `globals.css`:
```css
.text-ocean-blue { color: #2C5682; }
.text-charcoal { color: #2C3E50; }
.bg-sky-blue { background-color: #4A90D9; }
.bg-peach-coral { background-color: #FF8A6C; }
.bg-sand { background-color: #FFF5EB; }
/* etc */
```

### 4. Test All Interactive States

- [ ] Button hover: color changes smoothly
- [ ] Button active/pressed: slightly darker
- [ ] Button disabled: gray with readable contrast
- [ ] Link hover: Ocean Blue darkens
- [ ] Input focus: Ocean Blue outline
- [ ] Card hover: Blush Peach tint (subtle)
- [ ] Mobile tap states: visible feedback

### 5. Verify Accessibility

Run contrast checks on all text/background pairings:
- [ ] Ocean Blue on Sand: 7.07:1 ✅
- [ ] Charcoal Navy on Sand: 10.21:1 ✅
- [ ] White on Charcoal Navy: 10.98:1 ✅
- [ ] White on Rust Orange: 2.31:1 ❌ (never use as text on Sand, only button bg)

Use browser DevTools Lighthouse or axe to verify:
- [ ] No contrast failures
- [ ] All interactive elements have 48px+ touch targets
- [ ] Focus indicators visible on all focusable elements

---

## Code Patterns

### Old → New Color Mapping

| Old Teal Color | Old Hex | New Color | New Hex | Usage |
|----------------|---------|-----------|---------|-------|
| Primary AAA | `#095B5F` | Ocean Blue | `#2C5682` | Links, headers |
| Primary Light | `#0D7377` | Sky Blue | `#4A90D9` | Decorative |
| Background | `#FFFFFF` | Sand | `#FFF5EB` | Page bg |
| Text | `#1A1A1A` | Charcoal Navy | `#2C3E50` | Body text |

### Search & Replace (Use with caution!)

```bash
# In component files, replace:
bg-white → bg-[#FFF5EB]
text-primary → text-[#2C5682]  # Ocean Blue for links
text-gray-900 → text-[#2C3E50]  # Charcoal Navy for body

# DaisyUI classes:
btn-primary → (update DaisyUI theme, already done)
text-primary → (uses Ocean Blue from theme)
bg-base-100 → (uses Sand from theme)
```

**⚠️ WARNING:** Don't blindly search/replace. Each component needs manual review to ensure:
- Decorative vs text colors used correctly
- Hover states implemented
- Contrast maintained

---

## Testing Checklist

### Visual QA (Browser)
- [ ] Landing page: warm, inviting feel (not cold/techy)
- [ ] Use case cards: readable, well-spaced
- [ ] Wizard flow: consistent color usage
- [ ] Results page: clear CTAs with good contrast
- [ ] Mobile: touch targets visible, hover states on tap

### Accessibility QA
- [ ] Run Lighthouse: 100 accessibility score
- [ ] Test keyboard navigation: focus indicators visible
- [ ] Test at 200% zoom: no text cutoff, readable
- [ ] Verify all text meets 7:1 contrast (AAA)

### Cross-Browser
- [ ] Chrome: colors render correctly
- [ ] Safari: no color shifts
- [ ] Firefox: consistent appearance
- [ ] Mobile Safari: Sand background not washed out

---

## Acceptance Criteria

1. ✅ All components use new "Sunrise Surf AAA" palette
2. ✅ No decorative colors (Sky Blue, Peach Coral, Blush Peach) used for text
3. ✅ All text meets WCAG AAA (7:1 contrast) on Sand background
4. ✅ Button hover states implemented (Charcoal/Rust Orange darken 10%)
5. ✅ Sand (#FFF5EB) is default background (replaces white)
6. ✅ Lighthouse accessibility score: 100
7. ✅ Visual warmth achieved (feels friendly, not sterile)
8. ✅ 60-30-10 color distribution maintained
9. ✅ All interactive elements have visible hover/focus states
10. ✅ Mobile and desktop tested, no visual regressions

---

## Notes

- **Keep Google OAuth button colors:** Exception to palette (Google brand guidelines)
- **Status colors:** Success/error/warning already AAA-compliant, minor adjustments okay
- **Illustrations/icons:** Can use decorative colors freely (Sky Blue, Peach Coral)
- **Gradients:** Avoid (adds complexity, risks contrast failures)
- **Shadows:** Keep subtle (existing shadows fine, don't increase)

---

## Files to Modify

### Core Styles
- [x] `src/app/globals.css` (theme variables, DaisyUI colors, focus states)
- [x] `src/styles/colors.ts` (color palette reference)

### Components
- [ ] `src/app/page.tsx` (landing page)
- [ ] `src/components/nav/NavBar.tsx`
- [ ] `src/components/nav/MobileBottomNav.tsx`
- [ ] `src/components/wizard/Wizard.tsx`
- [ ] `src/components/wizard/WelcomeScreen.tsx`
- [ ] `src/components/wizard/ReviewScreen.tsx`
- [ ] `src/components/wizard/LoadingScreen.tsx`
- [ ] `src/components/wizard/Result.tsx`
- [ ] `src/components/wizard/RefineModal.tsx`
- [ ] `src/components/wizard/questions/*.tsx` (all question components)
- [ ] `src/components/auth/SignIn.tsx`
- [ ] `src/components/UseCaseGrid.tsx`
- [ ] `src/app/history/page.tsx`
- [ ] Task 5 trust signal components (if merged before this task)

### Build Verification
- [ ] Run `npm run build` — must pass with no errors
- [ ] Run `npm run lint` — must pass
- [ ] TypeScript errors: 0

---

## Git Workflow

```bash
# Create worktree
mkdir -p /Users/henryhobin/Projects/booey-worktrees/phase-6-visual-refresh
cd /Users/henryhobin/Projects/booey
git worktree add ../booey-worktrees/phase-6-visual-refresh -b phase-6/visual-refresh

# Work in worktree
cd ../booey-worktrees/phase-6-visual-refresh

# After changes
npm run build  # Verify build
npm run lint   # Verify lint
git add .
git commit -m "feat: apply Sunrise Surf AAA color palette site-wide"
git push origin phase-6/visual-refresh

# Create PR
gh pr create --title "Phase 6 Task 6: Visual Design Refresh (Sunrise Surf AAA)" \
  --body "Applies new warm, approachable color palette while maintaining WCAG AAA accessibility."
```

---

## Reference

- **Color palette spec:** `src/styles/colors.ts`
- **Contrast checker:** `/tmp/contrast-check.js` (run with `node`)
- **Phase 6 overview:** `docs/phases/phase-6/OVERVIEW.md`
- **WCAG guidelines:** https://www.w3.org/WAI/WCAG21/quickref/

---

**Estimated time:** 2-3 hours  
**Blocking:** None (can start after Task 5 or run in parallel)  
**Dependencies:** Task 1 (typography baseline) complete ✅

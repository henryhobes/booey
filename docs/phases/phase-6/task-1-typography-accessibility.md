# Phase 6 Task 1: Typography & Accessibility Baseline

## Goal
Establish age-friendly typography and accessibility foundation that all subsequent Phase 6 tasks will build upon.

## Target Audience
40-60 year olds with potential presbyopia (age-related farsightedness), reduced dexterity, and lower tolerance for low-contrast text.

## Requirements

### 1. Typography Update

**Base Font Size: 16px → 18px**
- Update `globals.css` base font from 16px to 18px
- This is the #1 non-negotiable for mature audiences (AARP research)
- Affects all body text, form fields, buttons

**Line Height: 1.5 → 1.6**
- Increase breathing room between lines for easier reading
- Especially critical for paragraph text

**Font Stack: Ensure High x-Height**
```css
font-family: system-ui, -apple-system, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif;
```
- Already using system fonts, but verify x-height is adequate
- If needed, consider switching to Inter or Open Sans (both have excellent x-height)

**Font Weights:**
- Remove any light/thin weights (300 or below)
- Body text: 400 (regular)
- Emphasis: 600 (semibold)
- Headings: 600 or 700
- Never use 100, 200, or 300 weights (too hard to read for aging eyes)

**Heading Sizes:**
```css
h1: 2.5rem (45px)   /* Hero headings */
h2: 2rem (36px)     /* Section headings */
h3: 1.5rem (27px)   /* Card headings */
h4: 1.25rem (22.5px) /* Subheadings */
```

---

### 2. Touch Target Minimum: 48×48px

**All Interactive Elements:**
- Buttons: minimum 48px height
- Links: minimum 48px tap area (add padding if needed)
- Form inputs: minimum 48px height
- Checkboxes/radios: 24px visible size with 48px tap zone
- Icon buttons: 48×48px minimum (preferably 56px for primary actions)

**Implementation:**
```css
/* Add to globals.css */
.btn, button, a, input, select, textarea {
  min-height: 48px;
  padding: 12px 24px;
}

/* Ensure links have adequate tap area */
a {
  padding: 8px 4px;
  margin: -8px -4px; /* Negative margin to preserve layout */
}

/* Icon buttons */
.btn-icon {
  min-width: 48px;
  min-height: 48px;
  padding: 12px;
}
```

**Touch Target Spacing:**
- Minimum 12px gap between adjacent interactive elements
- Prevents fat-finger errors on mobile

---

### 3. Color Contrast: WCAG AAA (7:1 ratio)

**Current State Audit:**
Run axe-core or similar tool to find all contrast failures.

**Required Fixes:**

**Text Colors:**
- Body text: `#1A1A1A` on `#FFFFFF` (16.6:1) ✅
- Secondary text: `#4A4A4A` on `#FFFFFF` (9.7:1) ✅
- Links/Primary: `#0D7377` on `#FFFFFF` (4.8:1) ❌ Needs darkening

**Update Primary Color for Contrast:**
```css
/* Old */
--primary: #0D7377; /* Only 4.8:1 contrast */

/* New */
--primary: #095B5F; /* 7.2:1 contrast - meets AAA */
--primary-light: #0D7377; /* Use for non-text elements */
```

**Button States:**
```css
/* Primary button */
.btn-primary {
  background: #095B5F; /* Dark enough for white text */
  color: #FFFFFF;
}

/* Ensure hover/focus states maintain contrast */
.btn-primary:hover {
  background: #073E42; /* Even darker on hover */
}

/* Disabled state must still be readable */
.btn-primary:disabled {
  background: #9CA3AF;
  color: #1F2937;
  /* Contrast: 4.6:1 - acceptable for disabled */
}
```

**Form Field Borders:**
- Default border: `#D1D5DB` (light gray, 2.9:1) - acceptable for decorative
- Focus border: `#095B5F` (primary color, high contrast)
- Error border: `#DC2626` (red, 5.9:1) - needs slight darkening to `#B91C1C` (7.1:1)

---

### 4. Mobile Bottom Navigation (Thumb Zone)

**Problem:** Top navigation is hard to reach on mobile with one hand.

**Solution:** Add bottom tab bar on mobile for primary actions.

**Implementation:**
- On mobile (< 768px), move primary navigation to bottom
- Sticky position, above fold
- Large tap targets (56px height)
- Icons + labels (never icon-only)

**Structure:**
```tsx
<nav className="mobile-nav md:hidden fixed bottom-0 left-0 right-0 bg-white border-t">
  <div className="grid grid-cols-3 gap-0">
    <Link href="/" className="nav-item">
      <HomeIcon />
      <span>Home</span>
    </Link>
    <Link href="/history" className="nav-item">
      <HistoryIcon />
      <span>History</span>
    </Link>
    <Link href="/auth/sign-in" className="nav-item">
      <UserIcon />
      <span>Sign In</span>
    </Link>
  </div>
</nav>
```

```css
.mobile-nav {
  padding: 8px 0;
  box-shadow: 0 -2px 8px rgba(0,0,0,0.1);
  z-index: 50;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px;
  min-height: 56px;
  font-size: 0.75rem;
  color: #4A4A4A;
  gap: 4px;
}

.nav-item svg {
  width: 24px;
  height: 24px;
}

.nav-item.active {
  color: #095B5F;
  font-weight: 600;
}

/* Add bottom padding to page content to prevent overlap */
@media (max-width: 768px) {
  main {
    padding-bottom: 80px; /* Height of bottom nav + safety */
  }
}
```

---

### 5. Focus Indicators

**All interactive elements must have visible focus states:**

```css
/* Global focus style */
*:focus-visible {
  outline: 3px solid #095B5F;
  outline-offset: 2px;
  border-radius: 4px;
}

/* Remove default browser outline */
*:focus {
  outline: none;
}

/* Buttons get a ring instead of outline */
button:focus-visible,
.btn:focus-visible {
  box-shadow: 0 0 0 3px rgba(9, 91, 95, 0.3);
  outline: none;
}

/* Skip to content link (keyboard users) */
.skip-to-content {
  position: absolute;
  top: -40px;
  left: 0;
  background: #095B5F;
  color: white;
  padding: 8px 16px;
  z-index: 100;
}

.skip-to-content:focus {
  top: 0;
}
```

---

### 6. Pinch-to-Zoom (Never Disable)

**Ensure `viewport` meta tag allows user scaling:**

```html
<!-- ✅ Correct -->
<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=yes">

<!-- ❌ Wrong (accessibility violation) -->
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
```

Check `app/layout.tsx` and ensure no `maximum-scale` or `user-scalable=no`.

---

## Files to Modify

### Core Styles
- `src/app/globals.css` — Base typography, color variables, focus styles
- `tailwind.config.ts` — Update theme colors, font sizes, spacing

### Components
- `src/components/nav/Nav.tsx` — Add mobile bottom navigation
- `src/components/nav/NavAuth.tsx` — Update for bottom nav on mobile
- `src/app/layout.tsx` — Verify viewport meta, add skip-to-content link

### Typography Utilities
- Create `src/styles/typography.css` (if not exists) with semantic font classes:
  ```css
  .text-body { font-size: 18px; line-height: 1.6; }
  .text-body-lg { font-size: 20px; line-height: 1.6; }
  .text-label { font-size: 16px; font-weight: 600; }
  ```

---

## Acceptance Criteria

- [ ] Base font is 18px (measured in browser DevTools)
- [ ] All interactive elements are ≥48px in height/width
- [ ] All text meets WCAG AAA 7:1 contrast (run axe-core, 0 violations)
- [ ] Mobile bottom navigation appears on screens <768px
- [ ] Bottom nav items are 56px tall with icon + label
- [ ] Focus indicators visible on all interactive elements
- [ ] Viewport meta tag allows user scaling
- [ ] Skip-to-content link works (keyboard users can tab to it)
- [ ] No font weights below 400 used anywhere
- [ ] Line height is 1.6 on all body text
- [ ] Build passes with no TypeScript errors
- [ ] Lighthouse Accessibility score ≥95

---

## Testing Checklist

### Manual Testing
1. **Font size check:** Inspect body text in DevTools → should read `18px`
2. **Touch target test:** On mobile, try tapping all buttons with thumb → no mis-taps
3. **Contrast test:** Screenshot homepage → run through WebAIM contrast checker
4. **Keyboard nav:** Tab through entire page → all focus states visible
5. **Zoom test:** Pinch to zoom on mobile → should work smoothly
6. **Bottom nav test:** Resize browser to mobile → bottom nav appears, top nav hides

### Automated Testing
```bash
# Install axe-core CLI
npm install -g @axe-core/cli

# Run accessibility audit
axe http://localhost:3000 --tags wcag2aaa

# Should return 0 violations
```

---

## Design Tokens for .cursorrules

Add this to `.cursorrules` in repo root:

```
# Typography & Accessibility Standards

Base font: 18px
Line height: 1.6
Font weights: 400 (regular), 600 (semibold), 700 (bold) only
Min touch target: 48px
Min contrast ratio: 7:1 (WCAG AAA)
Primary color: #095B5F
Focus outline: 3px solid #095B5F with 2px offset

All interactive elements must:
- Have ≥48px tap area
- Show visible focus state
- Use high-contrast colors (7:1 min)
- Include text labels (no icon-only)

Mobile navigation:
- Bottom placement (<768px)
- 56px tall items
- Icon + label always
```

---

## Notes

- This task is foundational — all other Phase 6 tasks depend on it
- Don't skip the axe-core audit — automate what you can
- Test on real mobile device if possible (simulator touch targets aren't accurate)
- The 18px base font will feel "large" at first — that's correct for 40-60 audience
- Primary color change (#0D7377 → #095B5F) is subtle but critical for AAA compliance

---

## Estimated Effort
**1 day** (6-8 hours)
- 2 hours: Typography updates + color contrast fixes
- 2 hours: Touch target adjustments
- 2 hours: Mobile bottom navigation
- 1 hour: Focus indicators + accessibility audit
- 1 hour: Testing + fixes

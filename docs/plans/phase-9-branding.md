# Phase 9: Branding — Colors & Logo

## Goal
Apply the "Sunrise Surf" brand color palette consistently throughout the app and integrate the Booey logo ("b" lettermark with beacon glow) into the navbar, favicon, and metadata.

## Color Palette Reference
| Role | Name | Hex | Usage |
|---|---|---|---|
| Primary | Sky Blue | #4A90D9 | Headers, primary buttons, nav, key UI (~60%) |
| Secondary | Peach Coral | #FF8A6C | CTAs, highlights, interactive elements (~30%) |
| Accent | Blush Peach | #FFD4B8 | Hover states, tags, badges, subtle backgrounds (~10%) |
| Dark Neutral | Charcoal Navy | #2C3E50 | Body text, headings, dark backgrounds |
| Light Neutral | Sand | #FFF5EB | Page backgrounds, cards, inputs |

Design rules:
- 60-30-10 rule: Sky Blue 60%, Peach Coral 30%, Blush Peach 10%
- Sand (#FFF5EB) as default background (not white)
- Charcoal Navy (#2C3E50) for all text (never pure black)
- Peach Coral reserved for primary CTAs and interactive elements

Note: The existing color system already uses AAA-compliant darker variants (Ocean Blue #2C5682, Rust Orange #D9663D) for text/interactive elements where the decorative colors fail contrast. The brand palette defines the visual identity; the implementation uses accessible variants for text.

## Logo
- File: `assets/booey-logo.png` (transparent PNG)
- Shape: Stylized lowercase "b" in dark blue with beacon/glow element at top (orange dome + peach + blush rings)
- Colors align with brand palette (blue body, orange/peach/blush beacon)

## Tasks

### Task 1: Logo Integration — Navbar & Favicon
**Files:** `src/app/layout.tsx`, `src/app/favicon.ico`, `public/`
- Add logo PNG to `public/logo.png` (optimized for web)
- Replace text "Booey" in navbar with logo image + "Booey" text (logo left, text right)
- Logo height: 32px desktop, 28px mobile
- Generate and replace favicon from logo (use the "b" mark)
- Add apple-touch-icon and og:image metadata
- Update `<title>` and meta tags if needed

### Task 2: Color Audit & Hardcoded Color Cleanup
**Files:** Components with hardcoded hex values
- Audit all `style={{ color: "#..." }}` patterns in components
- Replace hardcoded colors with Tailwind theme classes (`text-primary`, `text-base-content`, etc.)
- Ensure no components use `#000000` (pure black) — replace with Charcoal Navy
- Ensure no components use `#FFFFFF` for backgrounds — replace with Sand where appropriate
- Verify mobile-bottom-nav uses theme colors instead of hardcoded `white` and `#4A4A4A`

### Task 3: Color Palette Alignment Check
**Files:** `src/app/globals.css`, `src/styles/colors.ts`
- Verify CSS custom properties match the brand palette
- Verify DaisyUI theme HSL values are correct
- Ensure the 60-30-10 ratio is roughly applied across pages
- Check that the Sand background is used consistently (not white)
- Verify buttons follow the design rules (Charcoal Navy primary, Rust Orange secondary)

### Task 4: Landing Page Brand Polish
**Files:** `src/app/page.tsx`, landing components
- Apply brand colors to hero section, HowItWorks, testimonials, CTA
- Ensure FounderStory uses theme classes not hardcoded colors
- Verify the overall visual warmth and consistency
- Check footer uses appropriate brand colors

### Task 5: Explore & Wizard Brand Polish
**Files:** Explore page components, wizard components
- Category pills should use brand accent colors
- Wizard screens should feel warm (Sand backgrounds, brand colors)
- Result page should maintain brand consistency
- Verify all interactive elements use Peach Coral/Rust Orange

## Execution Order
Tasks 1-3 can run in parallel (different files).
Tasks 4-5 depend on Task 3 (colors must be correct before polishing pages).

## File Overlap Analysis
- **Group A (no overlap):** Task 1 (layout.tsx, public/, favicon)
- **Group B (no overlap):** Task 2 (individual components with hardcoded colors)
- **Group C (no overlap):** Task 3 (globals.css, colors.ts)
- **Group D (depends on A,B,C):** Task 4 (landing components) — after color cleanup
- **Group E (depends on A,B,C):** Task 5 (explore/wizard components) — after color cleanup

Tasks 1, 2, 3 → parallel
Tasks 4, 5 → parallel after 1-3 merge

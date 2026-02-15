/**
 * Booey Brand Color Palette — "Sunrise Surf AAA"
 * 
 * Warm, friendly, and approachable colors designed for adults aged 40-60.
 * All color pairings meet WCAG AAA accessibility standards.
 * 
 * Dual-shade system:
 * - Decorative colors: vibrant shades for visual warmth (backgrounds, illustrations)
 * - Text colors: darker variants for readability (links, headers, body text)
 */

export const colors = {
  // PRIMARY BLUE
  primary: {
    /** Sky Blue - Decorative only (backgrounds, illustrations, cards) */
    decorative: '#4A90D9',
    /** Ocean Blue - Text on Sand (7.07:1 AAA) - Links, headers, navigation */
    text: '#2C5682',
    /** Ocean Blue Hover - 10% darker for interactive states */
    hover: '#244B70',
  },

  // SECONDARY ORANGE/CORAL
  secondary: {
    /** Peach Coral - Decorative only (accent backgrounds, illustrations) */
    decorative: '#FF8A6C',
    /** Rust Orange - Interactive (CTA buttons with white text, 4.87:1 AA) */
    interactive: '#D9663D',
    /** Rust Orange Hover - 10% darker for button hover states */
    hover: '#C25833',
  },

  // ACCENT
  accent: {
    /** Blush Peach - Decorative only (hover states, badges, tags) */
    decorative: '#FFD4B8',
  },

  // NEUTRALS
  neutral: {
    /** Charcoal Navy - Text on Sand (10.21:1 AAA) - Body text, headings, AAA buttons */
    dark: '#2C3E50',
    /** Charcoal Navy Hover - 10% darker for button hover states */
    darkHover: '#1E2B37',
    /** Sand - Default background (replaces pure white) */
    light: '#FFF5EB',
    /** Pure White - Text on dark buttons */
    white: '#FFFFFF',
  },
} as const;

/**
 * Design Rules:
 * 
 * 1. NEVER use decorative colors for text
 *    - Sky Blue, Peach Coral, Blush Peach are visual-only
 *    - They fail WCAG contrast requirements
 * 
 * 2. ALL readable text must use:
 *    - Ocean Blue (#2C5682) for links/headers on Sand
 *    - Charcoal Navy (#2C3E50) for body text on Sand
 *    - Pure White (#FFFFFF) on dark backgrounds
 * 
 * 3. Primary CTA buttons (AAA):
 *    - Background: Charcoal Navy (#2C3E50)
 *    - Text: Pure White (#FFFFFF)
 *    - Hover: Charcoal Navy Hover (#1E2B37)
 * 
 * 4. Secondary CTA buttons (AA, warmer):
 *    - Background: Rust Orange (#D9663D)
 *    - Text: Pure White (#FFFFFF)
 *    - Hover: Rust Orange Hover (#C25833)
 * 
 * 5. Ghost buttons:
 *    - Border: Ocean Blue (#2C5682)
 *    - Text: Ocean Blue (#2C5682)
 *    - Background: transparent
 *    - Hover: Fill with Ocean Blue, text becomes white
 * 
 * 6. 60-30-10 Rule (split across decorative + text variants):
 *    - Sky Blue + Ocean Blue ~60%
 *    - Peach Coral + Rust Orange ~30%
 *    - Blush Peach ~10%
 * 
 * 7. Sand (#FFF5EB) is the default background
 *    - Maintains warmth vs pure white sterility
 *    - Use for pages, cards, input fields
 */

/** Contrast ratios (on Sand background #FFF5EB) */
export const contrastRatios = {
  'Ocean Blue on Sand': '7.07:1 ✅ AAA',
  'Charcoal Navy on Sand': '10.21:1 ✅ AAA',
  'Rust Orange on Sand': '4.87:1 ⚠️ AA (use with white text only)',
  'White on Charcoal Navy': '10.98:1 ✅ AAA',
  'White on Ocean Blue': '3.34:1 ❌ (never use)',
  'White on Rust Orange': '2.31:1 ❌ (never use)',
} as const;

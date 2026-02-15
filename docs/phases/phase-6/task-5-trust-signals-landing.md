# Phase 6, Task 5: Trust Signals — Landing Page

**Priority:** P1 (Week 2)  
**Effort:** 2 days  
**Impact:** Critical — Addresses #1 barrier to adoption (trust/privacy concerns)  
**Dependencies:** Task 1 (Typography) ✅ complete

---

## Problem Statement

Research shows 50%+ of 50+ year olds cite privacy/trust as their #1 barrier to trying AI tools. Current Booey landing page lacks social proof, privacy reassurance, and credibility signals that this demographic needs.

**Key friction points:**
- No testimonials or real user stories
- No clear privacy messaging ("What happens to my data?")
- No founder story or "who built this" context
- No social proof or credibility badges
- Generic "trust us" vibes instead of specific reassurances

---

## Goals

1. **Add social proof** — Real testimonials with photos, ages, occupations
2. **Address privacy concerns** — Plain-language "What We Don't Do" section
3. **Humanize the product** — Founder story section
4. **Build credibility** — Trust badges, featured logos (when applicable)
5. **Remove friction** — "No credit card needed" reassurance

---

## Success Criteria

- [ ] Landing page has 3+ testimonials with photos and demographics
- [ ] Privacy section uses plain language, not legalese
- [ ] Founder story explains "why I built this" in 2-3 sentences
- [ ] Trust badges clearly state "Free to try, no credit card"
- [ ] All new sections pass WCAG AAA contrast (7:1 ratio)
- [ ] Mobile responsive (testimonials stack, text remains readable)

---

## Design Specifications

### 1. Testimonials Section

**Location:** Above the fold, after hero section  
**Layout:** 3-column grid on desktop, stacked on mobile  
**Style:** Card-based with subtle shadows

Each testimonial card includes:
- **Photo:** Circle crop, 80×80px on desktop, 64×64px on mobile
- **Quote:** 2-3 sentences max, 18px font, italic
- **Attribution:** Name (bold), age, occupation (regular weight)
- **Rating:** Optional 5-star display

**Example:**
```
[Photo: Professional headshot]
"I was skeptical about AI, but Booey made it simple. No tech jargon, just helpful answers to real questions I had."

— Sarah M., 52, Small Business Owner
```

**Color Palette:**
- Background: `#FAF8F5` (warm cream)
- Card background: `#FFFFFF` (white)
- Text: `#2D2D2D` (dark gray)
- Accent: `#0D7377` (deep teal for names)

**Accessibility:**
- Testimonial cards have `<figure>` semantic markup
- Photos have proper alt text
- 7:1 contrast ratio on all text
- Touch targets 48×48px minimum

---

### 2. Privacy Section ("What We Don't Do")

**Location:** Below testimonials, above footer  
**Headline:** "Your Privacy, Our Promise"  
**Style:** Single column, centered, max-width 700px

**Copy blocks (bullet list):**
- ❌ **We don't sell your data.** Period. Your conversations stay private.
- ❌ **We don't train AI on your inputs.** Your questions and answers are yours alone.
- ❌ **We don't require a credit card.** Try it for free, no strings attached.
- ✅ **We do protect your privacy.** Industry-standard encryption, secure authentication.

**Design:**
- Icons: Use emoji (❌ and ✅) for clarity and warmth
- Font size: 18px body text, 24px headline
- Line height: 1.6 for readability
- Background: Subtle teal tint (`#F0F7F7`)

**Accessibility:**
- Semantic HTML: `<section>`, `<ul>`, `<li>`
- ARIA label: `aria-label="Privacy commitments"`
- Screen reader text for emoji meanings

---

### 3. Founder Story Section

**Location:** Between hero and testimonials  
**Layout:** Two-column on desktop (photo left, text right), stacked on mobile

**Content:**
- **Photo:** Founder headshot, 300×300px, rounded corners
- **Headline:** "Built by Someone Like You"
- **Copy:** 2-3 sentences explaining why Booey exists
  - Example: "I watched my parents struggle with confusing AI chatbots. They're smart people — they just didn't need another tech barrier in their lives. Booey makes AI feel like talking to a helpful friend, not a computer."
- **Attribution:** — Henry Hobin, Founder

**Design:**
- Background: `#FFFFFF` (white card on cream background)
- Padding: 48px on desktop, 24px on mobile
- Text alignment: Left-aligned (easier to read for 40-60 demographic)

---

### 4. Trust Badges

**Location:** Hero section, below CTA button  
**Style:** Inline, small badges with icons

**Badges:**
1. ✓ Free to try (no credit card)
2. ✓ No installation required
3. ✓ Works on any device

**Design:**
- Font size: 16px (slightly smaller than body)
- Color: `#5A5A5A` (light gray)
- Icons: Green checkmark emoji (✓)
- Spacing: 16px between badges

---

### 5. "As Featured In" Section (Optional)

**Location:** Below testimonials  
**Note:** Only include if we have real press coverage

**Layout:** Horizontal logo bar, grayscale logos  
**Logos:** TechCrunch, Product Hunt, etc. (when applicable)

---

## Implementation Checklist

### Phase 1: Content & Structure
- [ ] Create testimonial data structure in `src/data/testimonials.ts`
- [ ] Add 3 placeholder testimonials (Henry to replace with real ones)
- [ ] Write privacy section copy (plain language, no legalese)
- [ ] Write founder story copy (2-3 sentences)
- [ ] Create trust badge component

### Phase 2: Components
- [ ] Build `<Testimonial>` component
  - Props: `quote`, `name`, `age`, `occupation`, `photoUrl`
  - Responsive card layout
  - Semantic HTML (`<figure>`, `<blockquote>`, `<figcaption>`)
- [ ] Build `<PrivacySection>` component
  - Bullet list with emoji icons
  - Centered layout, max-width 700px
  - Teal background tint
- [ ] Build `<FounderStory>` component
  - Two-column layout (photo + text)
  - Responsive stacking on mobile
- [ ] Build `<TrustBadges>` component
  - Inline badges with checkmarks
  - Flexible wrapping on mobile

### Phase 3: Integration
- [ ] Update `src/app/page.tsx` to include new sections
- [ ] Order sections: Hero → Founder Story → Testimonials → Privacy → Use Cases → Footer
- [ ] Test responsive behavior (breakpoints: 640px, 1024px)
- [ ] Run accessibility audit (axe-core)

### Phase 4: QA
- [ ] Desktop: All sections render correctly, 7:1 contrast
- [ ] Mobile: Stacking works, touch targets 48×48px
- [ ] Screen reader: Proper semantic markup, ARIA labels
- [ ] Edge cases: Long names, missing photos, empty state

---

## Copy Guidelines

**Tone:** Warm, reassuring, conversational (not corporate)  
**Language Level:** 8th grade reading level max  
**Avoid:** Tech jargon, acronyms, "AI" terminology (use "smart assistant")  
**Emphasize:** Privacy, simplicity, real people, no pressure

**Example headlines:**
- ✅ "Your Privacy, Our Promise" (clear, direct)
- ❌ "GDPR-Compliant Data Handling" (jargon-heavy)

**Example copy:**
- ✅ "We don't sell your data. Period."
- ❌ "Your data remains encrypted and is never shared with third parties without explicit consent."

---

## Testing Plan

### Manual Testing
1. **Desktop (1920×1080):** All sections visible, proper spacing, readable text
2. **Mobile (390×844):** Cards stack, text remains readable, touch targets work
3. **Screen reader (VoiceOver/NVDA):** Proper semantic navigation, alt text present
4. **Color contrast:** Run axe-core, verify 7:1 ratio on all text

### User Testing (Aspirational)
- Show landing page to 3+ people aged 40-60
- Ask: "Do you trust this website? Why or why not?"
- Note: Which section builds most trust? Which raises questions?

---

## Out of Scope (Future Tasks)

- Video testimonials (P2 — Phase 7)
- Real-time trust score widget (P2)
- Industry certifications/compliance badges (P2)
- A/B testing different testimonial layouts (P2)

---

## Notes for Agent

- Use placeholder testimonials initially (Henry will replace with real ones)
- Photo URLs can be placeholder images (https://i.pravatar.cc/300?img=X)
- Privacy copy should be Henry-approved before deploying to production
- Founder story copy is placeholder — Henry will revise
- All new components should live in `src/components/landing/`
- Follow existing TypeScript/Tailwind conventions
- Test with 18px base font size (from Task 1)
- Ensure WCAG AAA compliance (7:1 contrast)

---

**Ready to implement!** Spawn agent with label `booey-phase6-task5`.

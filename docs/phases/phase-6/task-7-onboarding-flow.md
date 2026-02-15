# Phase 6 Task 7: Onboarding Flow

**Goal:** Reduce first-time user hesitation and educate 40-60 year olds on how Booey works without being patronizing.

**Priority:** P1 (high-value UX improvement)

**Estimated time:** 2-3 hours

---

## Overview

First-time users in the 40-60 demographic often feel anxious about "breaking something" or "doing it wrong" with new technology. This task addresses that anxiety through:
- Clear "How It Works" explanation
- Reassuring copy throughout
- Outcome-focused messaging (benefits, not features)
- Avoiding "AI" terminology (use "smart assistant")

Based on Phase 6 research: "Never say 'AI' (use 'smart assistant'). Guided first task > product tours. Reassure 'you can't break anything' at every anxiety point."

---

## Changes

### 1. Update Landing Page Hero Copy

**Current:** Generic "AI tools for everyday life"

**New:** Outcome-focused, reassuring copy

```tsx
// src/app/page.tsx - Hero section

<h1>Get things done faster, no tech skills needed</h1>

<p>
  Answer a few simple questions, and our smart assistant does the work. 
  No confusing prompts, no wrong answers — just helpful results in seconds.
</p>

<Link href="#use-cases" className="btn btn-primary btn-lg">
  Try your first tool — free, no signup
</Link>

<p className="text-sm mt-4 text-base-content/60">
  ✓ No credit card  ✓ No installation  ✓ Works on any device
</p>
```

**Changes:**
- Remove "AI" from heading
- Lead with outcome ("Get things done faster")
- Emphasize "no tech skills needed" (reassurance)
- "Smart assistant" instead of "AI"
- "No wrong answers" (anxiety reduction)
- Trust badges below CTA

---

### 2. Add "How It Works" Section

**Location:** After use cases grid, before testimonials

**Design:** 3-step visual guide with icons

```tsx
// src/components/landing/HowItWorks.tsx

<section className="py-12 md:py-16 lg:py-24 bg-base-200">
  <div className="mx-auto max-w-5xl px-4 md:px-6 lg:px-8">
    <h2 className="text-2xl md:text-3xl font-bold text-center mb-12" style={{ color: "#2C3E50" }}>
      How Booey works
    </h2>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      
      {/* Step 1 */}
      <div className="text-center">
        <div className="text-6xl mb-4" aria-hidden="true">🎯</div>
        <h3 className="text-xl font-semibold mb-2" style={{ color: "#2C5682" }}>
          1. Pick a tool
        </h3>
        <p style={{ color: "#2C3E50" }}>
          Choose what you want help with. From writing emails to planning meals.
        </p>
      </div>

      {/* Step 2 */}
      <div className="text-center">
        <div className="text-6xl mb-4" aria-hidden="true">💬</div>
        <h3 className="text-xl font-semibold mb-2" style={{ color: "#2C5682" }}>
          2. Answer questions
        </h3>
        <p style={{ color: "#2C3E50" }}>
          We'll ask 3-5 simple questions. No confusing tech terms, just plain English.
        </p>
      </div>

      {/* Step 3 */}
      <div className="text-center">
        <div className="text-6xl mb-4" aria-hidden="true">✨</div>
        <h3 className="text-xl font-semibold mb-2" style={{ color: "#2C5682" }}>
          3. Get your result
        </h3>
        <p style={{ color: "#2C3E50" }}>
          Copy it, edit it, print it — use it however you like. That's it!
        </p>
      </div>

    </div>

    {/* Reassurance callout */}
    <div className="mt-12 text-center bg-white rounded-lg p-6 shadow-sm">
      <p className="text-lg" style={{ color: "#2C3E50" }}>
        <strong>You can't break anything.</strong> Try as many times as you like, no wrong answers.
      </p>
    </div>

  </div>
</section>
```

---

### 3. Update Terminology Throughout

**Find and replace (case-sensitive):**
- "AI" → "smart assistant" (in user-facing copy, not code/docs)
- "AI tools" → "helpful tools"
- "powered by AI" → "powered by smart technology"

**Files to update:**
- `src/app/page.tsx` (hero, value prop)
- `src/app/layout.tsx` (metadata description)
- `src/components/landing/PrivacySection.tsx` (if mentions AI)
- `src/components/wizard/WelcomeScreen.tsx` (reassuring language)

**Exception:** Keep "AI" in technical contexts (API calls, error messages, admin features)

---

### 4. Add Reassurance to Wizard Welcome Screen

**Current:** Basic welcome screen

**Enhanced:**

```tsx
// src/components/wizard/WelcomeScreen.tsx

<div className="max-w-2xl mx-auto text-center">
  <div className="text-6xl mb-6">👋</div>
  
  <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: "#2C3E50" }}>
    Let's {useCase.title.toLowerCase()}
  </h2>

  <p className="text-lg mb-6" style={{ color: "#2C3E50" }}>
    We'll ask you <strong>{useCase.questions.length} quick questions</strong> (takes about 2 minutes).
  </p>

  {/* Reassurance box */}
  <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-8">
    <p className="text-base" style={{ color: "#2C5682" }}>
      💡 <strong>Tip:</strong> There are no wrong answers. Just answer naturally, like you're talking to a friend.
    </p>
  </div>

  <button onClick={onStart} className="btn btn-primary btn-lg">
    Let's get started
  </button>

  <p className="text-sm mt-4" style={{ color: "#5A5A5A" }}>
    You can go back and change your answers anytime
  </p>
</div>
```

---

### 5. Update Empty States with Reassurance

**History page (when no sessions):**

```tsx
// src/app/history/page.tsx - empty state

<div className="text-center py-16">
  <div className="text-6xl mb-4">🎯</div>
  <h3 className="text-2xl font-bold mb-2">Ready to try your first tool?</h3>
  <p className="text-base-content/70 mb-6">
    Pick any tool from the home page. It only takes 2 minutes, and you can't break anything!
  </p>
  <Link href="/" className="btn btn-primary">
    Browse tools
  </Link>
</div>
```

---

## Implementation Checklist

### Landing Page Updates
- [ ] Update hero heading to outcome-focused ("Get things done faster")
- [ ] Change "AI" to "smart assistant" in hero copy
- [ ] Add trust badges below CTA (no credit card, no install, any device)
- [ ] Create HowItWorks component (3-step visual guide)
- [ ] Add reassurance callout ("You can't break anything")
- [ ] Integrate HowItWorks between use cases and testimonials

### Terminology Updates
- [ ] Find/replace "AI" → "smart assistant" in user-facing copy
- [ ] Update metadata description in layout.tsx
- [ ] Update PrivacySection if it mentions AI

### Wizard Enhancements
- [ ] Update WelcomeScreen with:
  - Question count ("we'll ask X questions")
  - Time estimate ("takes about 2 minutes")
  - Reassurance box ("no wrong answers")
  - Back-button reminder ("you can change answers anytime")

### Empty States
- [ ] Update history page empty state with reassurance
- [ ] Check results page for any anxiety-inducing language

### Build Verification
- [ ] Run `npm run build` — must pass
- [ ] Run `npm run lint` — must pass
- [ ] TypeScript errors: 0

---

## Design Guidelines

### Tone
- **Friendly, not cutesy:** Professional warmth, not childish
- **Reassuring, not patronizing:** Confidence-building, not condescending
- **Outcome-focused:** Benefits ("save time"), not features ("uses GPT-4")

### Visual Style
- Use Sunrise Surf AAA colors (already applied)
- Large, friendly emoji (60-80px) for visual anchors
- Generous whitespace around reassurance callouts
- Soft blue (#E8F4F8) backgrounds for tip boxes
- Ocean Blue (#2C5682) for headings in How It Works

### Accessibility
- All text meets WCAG AAA (7:1 contrast)
- Touch targets 48px minimum
- Reassurance callouts have 2px border for visibility
- Emoji are decorative only (aria-hidden="true")

---

## Success Criteria

1. ✅ Hero copy leads with outcomes, not features
2. ✅ "AI" terminology replaced with "smart assistant" in user-facing copy
3. ✅ HowItWorks section clearly explains 3-step process
4. ✅ Reassurance messaging at key anxiety points (welcome, empty states)
5. ✅ Trust badges visible on landing page
6. ✅ Welcome screen shows question count + time estimate
7. ✅ Build passes with no TypeScript errors
8. ✅ All text maintains WCAG AAA contrast
9. ✅ Tone is warm but professional (not patronizing)
10. ✅ Mobile experience tested (responsive, readable)

---

## Files to Modify

### New Files
- `src/components/landing/HowItWorks.tsx` (3-step guide component)

### Modified Files
- `src/app/page.tsx` (hero copy, HowItWorks integration)
- `src/app/layout.tsx` (metadata description)
- `src/components/wizard/WelcomeScreen.tsx` (reassurance, question count)
- `src/app/history/page.tsx` (empty state reassurance)
- `src/components/landing/PrivacySection.tsx` (terminology check)

---

## Git Workflow

```bash
# Create worktree
mkdir -p /Users/henryhobin/Projects/booey-worktrees/phase-6-onboarding
cd /Users/henryhobin/Projects/booey
git worktree add ../booey-worktrees/phase-6-onboarding -b phase-6/onboarding

# Work in worktree
cd ../booey-worktrees/phase-6-onboarding

# After changes
npm run build  # Verify build
npm run lint   # Verify lint
git add .
git commit -m "feat(phase-6): add onboarding flow and reassuring copy"
git push origin phase-6/onboarding

# Create PR
gh pr create --title "Phase 6 Task 7: Onboarding Flow" \
  --body "Reduces first-time user anxiety through clear explanations and reassuring copy."
```

---

## Testing Notes

**Manual testing checklist:**
- [ ] Hero reads naturally (not corporate-speak)
- [ ] How It Works is scannable (skim in 10 seconds)
- [ ] Welcome screen doesn't feel hand-holdy
- [ ] Empty states feel encouraging, not scolding
- [ ] Mobile: reassurance boxes don't feel cramped
- [ ] Overall tone: "helpful friend" not "tech expert"

**User testing prompt (if available):**
"You want to write a healthier recipe. Can you use this site to do that? Tell me what you're thinking as you go."

Look for: Do they hesitate? Do they read the reassurance? Do they understand the 3-step process?

---

## Notes

- This task focuses on reducing **anxiety**, not teaching technical skills
- The 40-60 demographic has seen plenty of condescending "senior-friendly" interfaces — avoid that trap
- "You can't break anything" is the single most effective reassurance per research
- Time estimates ("2 minutes") set expectations and reduce abandonment

---

**Estimated time:** 2-3 hours  
**Blocking:** None (can start immediately)  
**Dependencies:** Task 6 (Visual Design) complete ✅

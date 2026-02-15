# Task 3: Results Page — Core Actionability

## Problem
The results page is currently a dead-end. Users see AI output but can't do anything with it — no copy, no iteration, no refinement. This kills engagement.

## Requirements

### 1. Copy-to-Clipboard Button
- Add prominent "Copy" button above the AI response
- Use Clipboard API with fallback for older browsers
- Show toast/feedback on successful copy ("Copied!")
- Icon: clipboard or copy icon from Heroicons

### 2. Replace Custom Parser with react-markdown
- Install `react-markdown` and `remark-gfm` (for tables, strikethrough)
- Replace current custom text rendering with proper markdown parser
- Style markdown output (headings, lists, code blocks, links)
- Maintain current typography (18px base font, 1.6 line height)

### 3. Print Support
- Add "Print" button (uses `window.print()`)
- Add `@media print` styles:
  - Hide navigation, buttons, non-essential UI
  - Show only use case name, inputs recap, and AI response
  - Optimize for black & white printing
  - Page breaks after sections

### 4. "Refine This" Iteration Button
- Add "Refine This" button below the AI response
- Opens a modal/dialog with refinement options:
  - Text input: "What would you like to change?"
  - Quick chips: "Make it shorter", "More formal", "Add more detail"
- On submit: appends refinement request to original prompt, regenerates
- Rate limiting applies (counts toward daily quota)

### 5. "Edit Inputs" Button
- Add "Edit Inputs" button that returns to wizard with pre-filled answers
- Preserve user's previous answers in form fields
- Allow them to change 1-2 fields without starting over
- On submit: regenerates with updated inputs

## UI Layout

```
┌─────────────────────────────────────────┐
│ [← Back to Browse]        [Print] [Copy]│
├─────────────────────────────────────────┤
│ Use Case Name (Emoji + Title)           │
│                                          │
│ Your Inputs:                             │
│ • Question 1: Answer 1                   │
│ • Question 2: Answer 2                   │
│                                          │
│ ─────────────────────────────────────    │
│                                          │
│ [AI Response in Markdown]                │
│                                          │
│ ─────────────────────────────────────    │
│                                          │
│ [Edit Inputs] [Refine This]              │
└─────────────────────────────────────────┘
```

## Acceptance Criteria
- [ ] Copy button copies full AI response to clipboard
- [ ] Toast notification confirms successful copy
- [ ] Markdown rendering works (headings, lists, code blocks, links)
- [ ] Print button opens print dialog with clean layout
- [ ] Print styles hide UI chrome, show only content
- [ ] "Refine This" opens modal with text input + quick chips
- [ ] Refinement regenerates response (counts toward quota)
- [ ] "Edit Inputs" returns to wizard with pre-filled answers
- [ ] Updating inputs regenerates response
- [ ] All buttons are 48px+ touch targets
- [ ] TypeScript compiles clean
- [ ] Next.js build passes

## Notes
- Use existing `QuotaBadge` component to show remaining quota
- Loading states should use the rotating messages pattern (if implemented in Task 4)
- Rate limiting applies to refinements and edits (same as initial generation)
- Don't remove existing session history functionality

## Files to Modify
- `src/app/results/page.tsx` - Main results page component
- `src/components/results/` - New components for Copy, Print, Refine modal
- `src/app/api/generate/route.ts` - May need tweaks for refinement flow
- `tailwind.config.ts` - Add print styles plugin if needed
- `package.json` - Add react-markdown + remark-gfm

## Dependencies
- `react-markdown` - Markdown rendering
- `remark-gfm` - GitHub Flavored Markdown support

# Task 4: Wizard Experience Enhancements

## Problem
The wizard needs a streamlined experience with good feedback during loading and helpful guidance for non-technical users.

## Requirements

### ~~1. Welcome/Intro Screen~~ (Removed)
> Removed to streamline the flow. Users now go directly to questions.

### ~~2. Review-Before-Submit Screen~~ (Removed)
> Removed to streamline the flow. The last question submits directly.

### 3. Rotating Loading Messages
- Show while AI is generating response
- Rotate through 3-5 messages every 2-3 seconds
- Messages should be reassuring and describe what's happening
- Example messages:
  - "Analyzing your answers..."
  - "Crafting your personalized response..."
  - "Almost there..."
  - "Putting the finishing touches..."

**UI:**
```
┌─────────────────────────────────────┐
│  [Spinner/Loading Animation]        │
│                                      │
│  Analyzing your answers...           │
│                                      │
│  This usually takes 10-15 seconds    │
└─────────────────────────────────────┘
```

### 4. Helper Text for Form Fields
- Add light gray helper text below each question
- Provide examples or guidance
- Keep it brief (1 line max)

**Example:**
```
What's your main goal for this trip?

[Text input field]

For example: "Relaxation", "Adventure", "Cultural immersion"
```

### 5. Improved Error Messages
- Replace generic "This field is required"
- Use friendlier, conversational tone
- Point to the specific issue

**Examples:**
- ❌ "This field is required"
- ✅ "Just need your answer here 👆"

- ❌ "Invalid input"
- ✅ "Hmm, that doesn't look quite right. Could you try again?"

### 6. Auto-Focus Inputs
- Automatically focus the input field when a new question appears
- Improves keyboard/desktop UX (no extra clicking needed)
- Use `autoFocus` prop or `useEffect` with `.focus()`

## UI Flow

```
Question 1 (with helper text, auto-focus)
    ↓
Question 2 (with helper text, auto-focus)
    ↓
Question 3 (with helper text, auto-focus)
    ↓ (last question submits directly)
Loading Screen (rotating messages)
    ↓
Results Page
```

## Acceptance Criteria
- [ ] Loading screen shows rotating messages (changes every 2-3 seconds)
- [ ] At least 4 different loading messages
- [ ] Helper text appears below all form fields
- [ ] Helper text provides examples or guidance
- [ ] Error messages use friendly, conversational tone
- [ ] Input fields auto-focus when question appears
- [ ] All buttons are 48px+ touch targets
- [ ] Progress indicator updates correctly
- [ ] Last question button submits directly ("Create My Answer")
- [ ] TypeScript compiles clean
- [ ] Next.js build passes

## Notes
- Loading messages should rotate automatically (use `setInterval`)
- Don't break existing wizard functionality (navigation, progress, state management)
- Helper text should be optional in the use case JSON schema (not all questions need it)

## Files to Modify
- `src/components/wizard/Wizard.tsx` - Main wizard orchestrator
- `src/components/wizard/QuestionScreen.tsx` - Question display with helper text, auto-focus, better errors
- `src/components/wizard/LoadingScreen.tsx` - Rotating loading messages
- `src/types/index.ts` - Question type with optional `helperText` field

## Dependencies
None (all standard React/Next.js features)

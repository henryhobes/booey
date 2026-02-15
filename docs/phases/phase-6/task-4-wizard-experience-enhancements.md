# Task 4: Wizard Experience Enhancements

## Problem
The wizard jumps straight into questions with no context, provides no feedback during loading, and offers no chance to review before submitting. This creates anxiety for non-technical users.

## Requirements

### 1. Welcome/Intro Screen
- Show before the first question
- Display use case name (emoji + title)
- Show number of questions and estimated time
- Brief description of what they'll get
- "Let's Get Started" button to proceed

**Example:**
```
✈️ Plan Your Dream Vacation

We'll ask you 3 quick questions (takes about 2 minutes).

You'll get:
• Personalized destination recommendations
• Budget-friendly travel tips
• Day-by-day itinerary suggestions

[Let's Get Started →]
```

### 2. Review-Before-Submit Screen
- Show after the last question, before generating
- Display all questions + user's answers
- "Edit" links next to each answer (jumps back to that question)
- Prominent "Generate My Results" button
- Reduces anxiety: "you can review everything before we start"

**Example:**
```
Review Your Answers

✏️ Where do you want to travel?
   → "Europe, specifically Italy and France"
   [Edit]

✏️ What's your budget range?
   → "$3,000 - $5,000"
   [Edit]

✏️ How many days will you be traveling?
   → "10 days"
   [Edit]

Everything look good?

[← Back] [Generate My Results →]
```

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
Welcome Screen
    ↓
Question 1 (with helper text, auto-focus)
    ↓
Question 2 (with helper text, auto-focus)
    ↓
Question 3 (with helper text, auto-focus)
    ↓
Review Screen (recap all answers with edit links)
    ↓
Loading Screen (rotating messages)
    ↓
Results Page
```

## Acceptance Criteria
- [ ] Welcome screen shows before first question
- [ ] Welcome screen displays use case info + estimated time
- [ ] Review screen shows after last question
- [ ] Review screen displays all Q&A pairs with edit links
- [ ] Edit links jump back to specific question with pre-filled answer
- [ ] Loading screen shows rotating messages (changes every 2-3 seconds)
- [ ] At least 4 different loading messages
- [ ] Helper text appears below all form fields
- [ ] Helper text provides examples or guidance
- [ ] Error messages use friendly, conversational tone
- [ ] Input fields auto-focus when question appears
- [ ] All buttons are 48px+ touch targets
- [ ] Progress indicator updates correctly with new screens
- [ ] TypeScript compiles clean
- [ ] Next.js build passes

## Notes
- Welcome and Review screens count as "steps" in the progress indicator (update step count logic)
- Loading messages should rotate automatically (use `setInterval`)
- Don't break existing wizard functionality (navigation, progress, state management)
- Helper text should be optional in the use case JSON schema (not all questions need it)

## Files to Modify
- `src/components/wizard/Wizard.tsx` - Main wizard component (add welcome/review screens)
- `src/components/wizard/QuestionStep.tsx` - Add helper text, auto-focus, better errors
- `src/components/wizard/LoadingScreen.tsx` - New component for rotating messages
- `src/types/index.ts` - Update Question type to include optional `helperText` field
- `src/data/use-cases.json` - Add helper text to existing questions (example data)

## Dependencies
None (all standard React/Next.js features)

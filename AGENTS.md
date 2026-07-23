# AGENTS.md

## Review guidelines

### Target audience — always front of mind
Booey's users are **non-technical adults aged 40-60**. Every change should be evaluated through their eyes:
- Would a 55-year-old understand this without hesitation?
- Is the language concrete and jargon-free? (No "AI", "prompt", "model", "token", "query")
- Are interactive elements obvious? (Large buttons, clear labels, no hidden gestures)
- Does the reading level stay at 6th-7th grade for user-facing copy?
- Could this accidentally feel patronizing? (Warm and clear ≠ dumbed down)

### UX & design decisions
- Touch targets must be 48px minimum (56px ideal). Flag anything smaller.
- Font sizes must be 16px minimum for body text. Flag small text.
- Animations should be subtle and purposeful (300ms transitions, no flashy effects)
- Color contrast must meet WCAG 2.1 AA. Flag low-contrast text.
- Mobile-first: does this work on a phone held in one hand?
- Navigation should be flat — minimal submenus, no deep hierarchies
- Error states must be specific and actionable ("Check your email address" not "Invalid input")
- Loading states should reassure, not just spin (use descriptive text like "Creating your answer...")

### Use case quality
When PRs add or modify use cases in `src/data/use-cases/`:
- **Title:** Is it outcome-oriented? ("Make This Recipe Healthier" not "AI Recipe Optimizer")
- **Description:** Under 10 words, 6th-7th grade reading level, no jargon
- **Questions:** Are they conversational and clear? Would a non-technical person know exactly what to type?
- **Question count:** 2-4 questions max per use case. More than 4 creates friction.
- **Example scenarios:** Do they reflect real situations a 40-60 year old would encounter?
- **Category fit:** Does the use case belong in its assigned category?

### Prompt quality
When PRs modify AI prompts (in `src/lib/ai/` or API routes):
- Does the system prompt produce warm, clear, actionable output?
- Would the response make sense to someone who's never used AI before?
- Are results structured with clear headings and short paragraphs?
- Is the prompt defensive against confusing or harmful outputs?
- Does it avoid AI jargon in the generated response?

### Code quality
- Import boundaries: `types/ → lib/ → hooks/ → components/ → app/` (no reverse imports)
- No `any` types. Use proper TypeScript throughout.
- Files must stay under 300 lines. Flag oversized files.
- Zod validation at all API boundaries
- All secrets in env vars, never client-side
- Rate limiting and input validation on all user-facing endpoints

### Security — treat as P0
- XSS vectors (especially in AI-generated output rendering)
- Exposed secrets or API keys
- Missing authentication on API routes
- SQL injection or Supabase RLS bypasses
- User input passed unsanitized to AI prompts

### Architecture
- Refer to `CLAUDE.md` for the project map and linked docs
- Check `docs/CONVENTIONS.md` for naming, imports, and patterns
- Check `docs/decisions/` for past architectural decisions — flag if a PR contradicts one without justification
- Wizard-based UI, not chat (ADR 001). Flag anything that drifts toward chatbot UX.
- Try-before-signup must always work (ADR 003). Flag changes that gate features behind auth unnecessarily.

### What NOT to flag
- Minor style preferences (semicolons, trailing commas) — ESLint handles this
- Commit message format — CI handles this
- Typos in code comments (unless they'd confuse a future agent)

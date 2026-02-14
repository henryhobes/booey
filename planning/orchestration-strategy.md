# AI-Orchestrated One-Day Web App Build Strategy

**Project:** Next.js 14 + DaisyUI + Supabase + Claude API → Vercel  
**Timeline:** Ship by midnight  
**Team:** Henry (PM/light coding) + Frank (OpenClaw orchestrator) + Claude Code (CLI coding agent)

---

## Executive Summary

The key to a successful one-day build is **parallel workstreams with clear handoffs** and **Frank as quality gate**. Henry should focus on product decisions and UI polish, Claude Code should handle feature implementation, and Frank should orchestrate infrastructure, run tests, and catch issues before they reach Henry.

**Core Pattern:** Concurrent execution with checkpoint-based synchronization (Microsoft's "concurrent agent pattern" + handoff gates).

---

## 1. Division of Labor

### Henry (Product Owner / UI Polish)
**Primary responsibilities:**
- Define feature scope and priorities (morning kickoff)
- Review UI/UX and make design calls
- Test user flows manually
- Deploy to Vercel (final step)
- Make go/no-go decisions at checkpoints

**What Henry should NOT do:**
- Write boilerplate or config files
- Debug TypeScript errors
- Set up database schemas manually
- Write API routes from scratch

**Time allocation:** 30% defining, 30% reviewing, 40% testing/polishing

---

### Frank (Orchestrator / Quality Gate)
**Primary responsibilities:**
- Initialize project structure and dependencies
- Spawn sub-agents for parallel tasks (DB setup, API scaffolding, etc.)
- Run type checks, linters, and tests after Claude Code sessions
- Monitor build process and catch errors early
- Coordinate handoffs between workstreams
- Keep context files updated (what's done, what's next)
- Generate migration scripts and seed data
- Review Claude Code's output for common pitfalls

**Example orchestration flow:**
```bash
# Morning: Setup
1. Create Next.js project with TypeScript + DaisyUI
2. Configure Supabase client
3. Spawn sub-agent: Generate DB schema from requirements
4. Spawn sub-agent: Create API route templates
5. Write PROJECT_STATUS.md for Henry's review

# Afternoon: Quality gates
1. After Claude Code session → run `npm run build`
2. Check for TypeScript errors → fix or flag for Henry
3. Test API endpoints with curl
4. Update PROJECT_STATUS.md with completed features
```

**Key principle:** Frank should be **proactive**, not reactive. Don't wait for Henry to ask "did that work?" — run the checks and report status.

---

### Claude Code (Feature Implementation)
**Primary responsibilities:**
- Implement React components
- Write API routes and server actions
- Integrate with Supabase and Claude API
- Handle form validation and state management
- Write utility functions and helpers

**How to maximize Claude Code effectiveness:**
- **One feature per session** (minimize context switching)
- **Provide explicit file paths** (avoid "where should I put this?")
- **Include example code snippets** from similar projects
- **Start with type definitions** (types → component → logic)

**What to avoid:**
- Asking Claude Code to "set up the project" (too broad)
- Multiple unrelated features in one session (context bleed)
- Asking for architectural decisions (Henry decides, not Claude)

---

## 2. Parallel Workstreams

### Morning (Hours 1-4): Foundation Phase

**Parallel tracks:**

| Track | Owner | Duration | Deliverable |
|-------|-------|----------|-------------|
| **A: Project Setup** | Frank | 30 min | Next.js + DaisyUI + Supabase client configured |
| **B: Database Schema** | Frank sub-agent | 45 min | Supabase tables, RLS policies, seed data |
| **C: Design System** | Henry + Claude Code | 1 hour | DaisyUI theme config, reusable components |
| **D: Auth Flow** | Frank sub-agent | 1 hour | Supabase auth setup, middleware, protected routes |

**Dependencies:**
- A must complete before B and C start
- D can start immediately after A
- Henry reviews C while D is running

**Checkpoint 1 (Hour 4):**
- ✅ App runs locally
- ✅ Database is seeded
- ✅ Auth works (sign up/login)
- ✅ Design system documented

---

### Afternoon (Hours 5-8): Feature Development

**Parallel tracks:**

| Track | Owner | Duration | Deliverable |
|-------|-------|----------|-------------|
| **E: Core Features** | Claude Code + Henry | 2-3 hours | Main app functionality (forms, displays, interactions) |
| **F: API Integration** | Frank sub-agent | 1 hour | Claude API wrapper, error handling, rate limiting |
| **G: Data Fetching** | Claude Code | 1 hour | Supabase queries, caching, optimistic updates |

**Strategy:**
- Claude Code works on **UI components** while Frank sub-agent builds **API layer**
- Henry bounces between sessions to review and test
- Frank runs `npm run build` after each component is done

**Checkpoint 2 (Hour 8):**
- ✅ All features render without errors
- ✅ API calls work end-to-end
- ✅ TypeScript compiles cleanly
- ✅ No console errors

---

### Evening (Hours 9-12): Polish & Ship

**Sequential (no more parallelism):**

| Track | Owner | Duration | Deliverable |
|-------|-------|----------|-------------|
| **H: Bug Fixes** | Henry + Claude Code | 1-2 hours | Fix issues from testing |
| **I: Responsive Design** | Claude Code | 30 min | Mobile breakpoints, touch interactions |
| **J: Performance** | Frank | 30 min | Image optimization, bundle analysis |
| **K: Deploy** | Henry | 30 min | Vercel deploy, env vars, final smoke test |

**Frank's role in this phase:**
- Monitor for regressions after bug fixes
- Run Lighthouse audits
- Check bundle size
- Validate environment variables before deploy

---

## 3. Quality Gates (Preventing AI Code Bugs)

### Gate 1: Type Safety (Automated)
**Who:** Frank (after every Claude Code session)  
**How:**
```bash
npm run type-check
# If errors → send summary to Henry with file paths
# If clean → move to Gate 2
```

**Common AI pitfalls to catch:**
- Missing TypeScript types (implicit `any`)
- Props mismatch between parent/child components
- Incorrect Supabase query return types

---

### Gate 2: Build Validation (Automated)
**Who:** Frank  
**How:**
```bash
npm run build
# If build fails → flag specific errors
# If succeeds → check bundle size
```

**What this catches:**
- Import errors (wrong paths)
- Missing dependencies
- Server/client component boundaries in Next.js 14

---

### Gate 3: Runtime Testing (Semi-automated)
**Who:** Frank + Henry  
**How:**
- Frank: Test API endpoints with curl or Postman
- Henry: Click through user flows in dev mode

**Checklist:**
- [ ] Forms submit without errors
- [ ] Data persists to database
- [ ] Auth protects correct routes
- [ ] Claude API responses render correctly
- [ ] Error states show user-friendly messages

---

### Gate 4: Code Review (LLM-assisted)
**Who:** Frank (using Claude)  
**How:** After major features, Frank can:
```bash
# Read the new component file
# Use Claude to review for:
# - Security issues (XSS, SQL injection via Supabase)
# - Performance anti-patterns (unnecessary re-renders)
# - Accessibility violations
# - DaisyUI component misuse
```

**Example prompt for Frank:**
```
Review this Next.js component for:
1. Security vulnerabilities
2. Performance issues (React anti-patterns)
3. Accessibility (missing aria labels, keyboard nav)
4. DaisyUI usage (check against docs)

[component code]
```

---

## 4. Context Management (Solving Claude Code's Limits)

### Problem
Claude Code has ~200K token context. A full Next.js project can exceed this quickly.

### Solution: Modular Architecture + Session Planning

#### File Structure (Optimized for Context)
```
booey/
├── app/
│   ├── (auth)/          # Auth-related pages (session 1)
│   ├── (dashboard)/     # Main app pages (session 2)
│   └── api/             # API routes (session 3)
├── components/
│   ├── ui/              # DaisyUI wrappers (session 0)
│   ├── forms/           # Form components (session 4)
│   └── displays/        # Display components (session 5)
├── lib/
│   ├── supabase/        # DB client + queries (built by Frank)
│   ├── claude/          # Claude API wrapper (built by Frank)
│   └── utils/           # Helpers (add as needed)
├── types/
│   └── index.ts         # Shared TypeScript types (START HERE)
└── docs/
    ├── SESSION_PLAN.md  # What to build in each session
    └── DONE.md          # What's already built (avoid re-reading)
```

#### Session Planning Document (SESSION_PLAN.md)
Frank creates this during setup:

```markdown
# Claude Code Session Plan

## Session 0: Design System (30 min)
**Files to create:**
- components/ui/Button.tsx
- components/ui/Input.tsx
- components/ui/Card.tsx

**Context needed:**
- DaisyUI docs (link)
- types/index.ts (for props)

**Exit criteria:** All UI components render in Storybook/test page

---

## Session 1: Auth Pages (45 min)
**Files to create:**
- app/(auth)/login/page.tsx
- app/(auth)/signup/page.tsx

**Dependencies:**
- lib/supabase/auth.ts (Frank builds this)
- components/ui/* (session 0)

**Context needed:**
- Supabase auth docs
- types/index.ts

**Exit criteria:** Can sign up and log in

---

[etc.]
```

#### Context-Saving Techniques

**1. Type-First Development**
Frank generates comprehensive TypeScript types upfront:
```typescript
// types/index.ts
export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Post {
  id: string;
  author_id: string;
  content: string;
  created_at: string;
}

// ... all types defined here
```

Claude Code sessions reference this file instead of redefining types everywhere.

**2. API Contracts**
Frank creates API response templates:
```typescript
// lib/api/contracts.ts
export const API_RESPONSES = {
  getPosts: z.array(PostSchema),
  createPost: PostSchema,
  // ... etc
}
```

Claude Code implements routes matching these contracts.

**3. Progressive Context Loading**
For each session, provide only:
- Relevant types
- Files being edited
- One example of similar pattern

Don't dump the entire codebase.

**4. DONE.md Pattern**
After each session, Frank updates DONE.md:
```markdown
# Completed Features

## Auth System
- ✅ Supabase client configured (lib/supabase/client.ts)
- ✅ Login page (app/(auth)/login/page.tsx)
- ✅ Middleware for protected routes (middleware.ts)

**DO NOT re-implement these. They work.**

## Next Up
- [ ] Dashboard layout
- [ ] Post creation form
```

Claude Code reads this to avoid redoing work.

---

## 5. Monorepo vs Modular Structure

### Recommendation: **Single repo, modular architecture**

**Why not monorepo:**
- Overhead for a one-day build
- Next.js already has good separation (app router, components, lib)
- Deployment is simpler with single Vercel project

**Why modular within repo:**
- Claude Code can work on isolated components
- Frank can scaffold entire modules (e.g., `lib/claude/` with wrapper, types, error handling)
- Easier to parallelize (Henry tests UI while Claude Code builds API layer)

### Folder Ownership (Avoid Conflicts)

| Folder | Primary Owner | When Others Touch |
|--------|---------------|-------------------|
| `types/` | Frank | Never (read-only for Claude Code) |
| `lib/supabase/` | Frank | Claude Code adds query helpers |
| `lib/claude/` | Frank sub-agent | Claude Code uses, doesn't modify |
| `components/ui/` | Claude Code (session 0) | Henry tweaks styles |
| `components/forms/` | Claude Code | Henry reviews |
| `app/` | Claude Code | Frank adds API routes |

**Rule:** If two agents need to edit the same file, they should NOT work in parallel. Use handoffs.

---

## 6. Testing Strategy (Minimum Viable)

### What NOT to do (time sinks)
- ❌ Full E2E test suite with Playwright
- ❌ Unit tests for every function
- ❌ Mocking all API calls
- ❌ Visual regression testing

### What TO do (pragmatic)

#### Level 1: Type Safety (15 min setup, continuous value)
```bash
npm install -D typescript @types/react @types/node
```

TypeScript catches ~40% of bugs before runtime. Zero marginal cost after setup.

#### Level 2: Build Validation (built-in)
```bash
npm run build
```

Next.js build step catches:
- Import errors
- Server/client boundary issues
- Missing environment variables

Frank runs this after every Claude Code session.

#### Level 3: Linting (10 min setup)
```bash
npm install -D eslint eslint-config-next
```

Catches:
- React anti-patterns (missing keys, stale closures)
- Accessibility violations
- DaisyUI component misuse

#### Level 4: Manual Testing Protocol (structured)
**Who:** Henry (30 min before deploy)  
**Checklist:**
- [ ] Create account
- [ ] Log in
- [ ] Perform primary action (post, submit, etc.)
- [ ] Log out
- [ ] Try to access protected route (should redirect)
- [ ] Test on mobile viewport
- [ ] Check console for errors

**Frank can help:** Generate test data, reset DB between test runs

#### Level 5: Critical Path E2E (optional, if time permits)
One Playwright test for the happy path:
```typescript
test('user can sign up and create post', async ({ page }) => {
  await page.goto('/signup');
  // ... fill form, submit
  await expect(page).toHaveURL('/dashboard');
  // ... create post
  await expect(page.locator('[data-testid="post"]')).toBeVisible();
});
```

**Only if:** There's time after all features are done. Nice-to-have, not required.

---

## 7. Frank as Orchestrator & Quality Reviewer

### Frank's Expanded Role

#### Pre-Session: Setup Context
Before each Claude Code session, Frank:
1. Creates session brief (files to edit, dependencies, exit criteria)
2. Ensures all dependencies are ready (e.g., API wrapper exists before UI uses it)
3. Pulls latest code (`git pull`)

#### During Session: Monitor
- Watch for common errors in real-time (if Claude Code logs are visible)
- Stand by to answer questions ("where should I put this file?")

#### Post-Session: Validation Pipeline
```bash
# 1. Type check
npm run type-check || exit 1

# 2. Lint
npm run lint || exit 1

# 3. Build
npm run build || exit 1

# 4. If all pass, run basic smoke test
curl http://localhost:3000/api/health

# 5. Update DONE.md with completed features

# 6. Report to Henry
```

#### Code Review Checklist for Frank

When reviewing Claude Code's output, check for:

**Security:**
- [ ] No raw SQL (Supabase client only)
- [ ] User input is sanitized
- [ ] API keys are in `.env`, not hardcoded
- [ ] RLS policies are enabled in Supabase

**Performance:**
- [ ] No unnecessary `useEffect` (prefer React Query / Supabase subscriptions)
- [ ] Components are memoized where appropriate
- [ ] Images use `next/image`
- [ ] API routes have error handling

**Next.js 14 Specific:**
- [ ] Server Components by default, Client Components marked with `'use client'`
- [ ] No `getServerSideProps` (use App Router patterns)
- [ ] Metadata exported for SEO
- [ ] Loading and error states defined

**DaisyUI:**
- [ ] Using theme classes correctly (`btn`, `card`, etc.)
- [ ] Not fighting the framework with custom CSS
- [ ] Responsive utilities used (`sm:`, `md:`, `lg:`)

**Claude API:**
- [ ] Streaming responses if needed (better UX)
- [ ] Error handling for rate limits
- [ ] Token usage tracked
- [ ] Prompts are in constants, not inline

#### When Frank Should Intervene

**Auto-fix (don't ask Henry):**
- Missing imports
- Formatting issues
- Obvious typos in code

**Flag for Henry:**
- Logic errors (wrong behavior)
- Design decisions (component structure)
- Performance issues requiring tradeoffs

**Block and fix immediately:**
- Security vulnerabilities
- Build-breaking errors
- Data loss risks

---

## Practical Example: Building a Feature End-to-End

### Feature: "AI Post Generator"
User enters a topic, Claude API generates a post, saves to Supabase, displays in feed.

#### Step 1: Frank Sets Up Infrastructure (15 min)
```bash
# Create Claude API wrapper
cat > lib/claude/client.ts << 'EOF'
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

export async function generatePost(topic: string): Promise<string> {
  const response = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: `Write a short social media post about: ${topic}`
    }],
  });
  return response.content[0].text;
}
EOF

# Create API route
cat > app/api/generate-post/route.ts << 'EOF'
import { NextRequest, NextResponse } from 'next/server';
import { generatePost } from '@/lib/claude/client';
import { createPost } from '@/lib/supabase/posts';

export async function POST(req: NextRequest) {
  const { topic, userId } = await req.json();
  
  try {
    const content = await generatePost(topic);
    const post = await createPost({ content, author_id: userId });
    return NextResponse.json({ post });
  } catch (error) {
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}
EOF

# Frank tests this with curl
curl -X POST http://localhost:3000/api/generate-post \
  -H "Content-Type: application/json" \
  -d '{"topic": "AI coding", "userId": "test-123"}'

# If it works, update SESSION_PLAN.md
```

#### Step 2: Claude Code Builds UI (30 min)
**Henry's prompt to Claude Code:**
```
Build a post generator component:
- File: components/forms/PostGenerator.tsx
- Input field for topic (DaisyUI input)
- "Generate" button (DaisyUI btn btn-primary)
- Loading state while API call is in flight
- Display generated post in a card
- "Save" button to persist to feed

Use the API route at /api/generate-post
Reference types from types/index.ts
```

Claude Code implements this in one focused session.

#### Step 3: Frank Validates (5 min)
```bash
npm run type-check  # ✅ Pass
npm run build       # ✅ Pass

# Frank manually tests in browser
# - Enter topic
# - Click generate
# - Verify post appears
# - Check database to confirm save

# Updates DONE.md
echo "- ✅ AI post generator (components/forms/PostGenerator.tsx)" >> docs/DONE.md
```

#### Step 4: Henry Polishes (15 min)
- Adjust button colors
- Add hover states
- Test on mobile
- Tweak generated post formatting

**Total time:** 65 minutes (with parallelism, could be 45 min if Frank works while Claude Code is thinking)

---

## Orchestration Timeline (Sample 12-Hour Schedule)

### 8:00 AM - Kickoff
- [ ] Henry defines scope and priorities
- [ ] Frank creates project structure
- [ ] SESSION_PLAN.md written

### 8:30 AM - Parallel Setup
- [ ] Frank: Supabase schema + seed data
- [ ] Claude Code: Design system components
- [ ] Henry: Review Vercel setup

### 10:00 AM - Checkpoint 1
- [ ] All setup tasks complete
- [ ] App runs locally
- [ ] Auth works

### 10:30 AM - Feature Dev (Parallel)
- [ ] Claude Code: Main UI components (sessions 1-3)
- [ ] Frank sub-agent: API integrations
- [ ] Henry: Test and review each component as it's done

### 2:00 PM - Lunch Break
- [ ] Frank runs full build + lint
- [ ] Fix any issues found

### 3:00 PM - Feature Dev Continues
- [ ] Claude Code: Remaining features
- [ ] Henry: Manual testing + bug list

### 6:00 PM - Checkpoint 2
- [ ] All features implemented
- [ ] TypeScript builds cleanly
- [ ] Manual test pass rate >80%

### 6:30 PM - Bug Bash
- [ ] Henry tests all flows
- [ ] Claude Code fixes bugs
- [ ] Frank validates fixes

### 9:00 PM - Polish
- [ ] Responsive design
- [ ] Loading states
- [ ] Error messages
- [ ] Performance check

### 10:00 PM - Deploy Prep
- [ ] Frank: Final build validation
- [ ] Henry: Set up Vercel env vars
- [ ] Push to main branch

### 10:30 PM - Deploy & Test
- [ ] Deploy to Vercel
- [ ] Smoke test production
- [ ] Fix any production-only issues

### 11:30 PM - Ship! 🚀

---

## Key Success Factors

1. **Frank maintains the SESSION_PLAN.md** — Claude Code should never wonder "what do I build next?"

2. **Henry makes decisions fast** — No bikeshedding. Ship ugly, improve later.

3. **Type everything upfront** — TypeScript types are the contract between parallel workstreams.

4. **Frank auto-fixes trivial issues** — Don't bother Henry with missing imports or formatting.

5. **One feature, one session** — Don't mix auth + UI + API in the same Claude Code session.

6. **Test incrementally** — Don't wait until 11 PM to discover auth is broken.

7. **Frank is the safety net** — Henry should never see a runtime error that Frank could have caught.

---

## Anti-Patterns to Avoid

❌ **"Let's build everything then test"** → Test continuously  
❌ **"Claude Code will handle the whole project"** → Too much context, will hallucinate  
❌ **"Frank just runs commands"** → Frank should be proactive reviewer  
❌ **"We'll add types later"** → Types ARE the architecture, define them first  
❌ **"Henry writes code while Claude Code is idle"** → Henry should review/test, not code  
❌ **"We'll write tests after shipping"** → TypeScript + build validation IS your test suite  
❌ **"Let's use a complex state management library"** → Keep it simple, use React Query + Zustand max

---

## Tooling Recommendations

### Must-Have
- **TypeScript** — Non-negotiable
- **ESLint** — Catches React anti-patterns
- **Prettier** — Auto-formatting (Frank can run on save)
- **Supabase CLI** — For migrations and type generation

### Nice-to-Have
- **React Query** — Better than raw `useEffect` for data fetching
- **Zod** — Runtime validation for API responses
- **Storybook** — If building a component library (probably overkill for one-day build)

### Frank's Automation Scripts

```bash
# validate.sh (Frank runs after every Claude Code session)
#!/bin/bash
set -e

echo "🔍 Type checking..."
npm run type-check

echo "🧹 Linting..."
npm run lint --quiet

echo "🏗️  Building..."
npm run build

echo "✅ All checks passed!"
```

```bash
# reset-db.sh (Frank uses for testing)
#!/bin/bash
npx supabase db reset
npx supabase db seed
echo "🌱 Database reset and seeded"
```

---

## Conclusion

The "Frank as orchestrator" model works because:

1. **Separation of concerns** — Henry owns product, Frank owns quality, Claude Code owns implementation
2. **Parallel execution** — Infrastructure and UI can build simultaneously
3. **Continuous validation** — Catch errors immediately, not at midnight
4. **Context management** — Each Claude Code session is focused and productive
5. **Quality gates** — TypeScript + build checks + Frank's review = 90% of bugs caught pre-Henry

**The key insight:** Frank isn't just a command runner. Frank is the **senior engineer** who reviews code, runs tests, and makes sure the team ships quality software. Henry gets to stay in the product layer, which is where his skills shine.

**Estimated time savings:** ~4 hours compared to traditional solo development, primarily from:
- Parallel workstreams (2 hours saved)
- Auto-validation catching bugs early (1 hour saved)
- Claude Code handling boilerplate (1 hour saved)

---

**Next Steps:**
1. Henry reviews this strategy and adjusts priorities
2. Frank creates initial project structure + SESSION_PLAN.md
3. Kickoff meeting to finalize scope
4. Start building! 🚀

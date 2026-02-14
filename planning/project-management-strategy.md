# Booey - One-Day Build: Project Management Strategy

**Mission:** Ship a production-ready Next.js web app in 8-10 hours with AI assistance.

**Team:** Henry (developer) + Frank (AI orchestrator) + Claude Code (coding agent) + sub-agents

**Timeline:** 5 phases, ~8-10 hours total

---

## 1. TASK MANAGEMENT

### Task Granularity: The 30-60 Minute Rule

Break each phase into **30-60 minute atomic tasks**. Why? 
- Small enough to see progress quickly (dopamine hits matter in marathon builds)
- Large enough to avoid context-switching overhead
- Perfect for time-boxing and status checks

**Example breakdown for "Core Magic" (3hr):**
- [30m] Set up Next.js 14 project + basic routing structure
- [45m] Build use case data model + JSON schema
- [60m] Implement browse/filter UI for use cases
- [45m] Create wizard flow engine (step navigation, state management)

**Red flag:** If a task feels like >90 minutes, it's too big. Split it.

### Tracking System: Markdown Checklist (Fast & Zero Overhead)

**Use:** `~/Projects/booey/planning/BUILD.md` — a simple markdown file with checkboxes.

**Why not Kanban/GitHub Issues?**
- Kanban: UI overhead, drag-drop takes time, context switching
- GitHub Issues: Too much ceremony, labeling, assigning
- Markdown: Edit in VSCode, check boxes, commit. Done in seconds.

**Template structure:**
```markdown
# Booey Build - [DATE]

## Phase 1: Core Magic (3hr) ⏱️ START: 9:00 AM
- [ ] [30m] Project setup + routing (9:00-9:30)
- [ ] [45m] Data model + schema (9:30-10:15)
- [ ] [60m] Browse/filter UI (10:15-11:15)
- [ ] [45m] Wizard engine (11:15-12:00)
**Phase checkpoint:** ✅ Can browse use cases, start a wizard

## Phase 2: Auth (2hr) ⏱️ START: 12:00 PM
...

## Decisions Log
- [10:32] DEFER: Advanced filtering → v2 (too complex)
- [11:45] BUILD: Wizard state persistence (core value)

## Blockers
- [11:20] Supabase RLS syntax issue → Frank researching
```

**Update frequency:** After each task completion. Takes 10 seconds.

### Scope Creep Defense: The "Hell No" Framework

Every feature idea gets ONE question: **"Does this block the core value demo?"**

- **YES (blocking):** Build it now
- **NO (nice-to-have):** Defer to v2
- **MAYBE (enhances):** Apply 15-minute rule ↓

**The 15-Minute Rule:**
If you can't build a working version in 15 minutes, defer it. Polishing can wait.

**Decision framework:**
```
Feature idea appears
    ↓
Does it block core demo? → YES → Build (time-box it)
    ↓ NO
Will users notice in first 5 minutes? → YES → Build (minimal version)
    ↓ NO
DEFER TO V2 (add to backlog.md)
```

**Pre-approved deferrals for Booey:**
- Advanced search/filtering
- User profiles/favorites
- Analytics/tracking
- Email notifications
- Social sharing
- Dark mode
- Accessibility polish beyond basics

**Frank's role:** Actively flag scope creep. When Henry says "it'd be cool if...", interrupt with "Core demo blocker? Y/N?"

---

## 2. PARALLELIZATION

### What Can Run Simultaneously

**Henry (coding)** | **Frank (orchestrating)** | **Sub-agents**
---|---|---
Implementing feature X | Reviewing previous commit | Researching next blocker
Writing component logic | Running type checks | Generating test data
Debugging live issue | Deploying to preview env | Writing documentation
Committing code | Preparing next task context | Security audit of specific file

### File-Level Ownership Model

**Golden rule:** One active writer per file at any moment.

**Ownership boundaries:**
```
Henry (primary write):
- /app/**/*.tsx          (pages, components)
- /lib/wizard-engine.ts  (core logic)
- /components/ui/**      (UI components)

Frank/Sub-agents (read + review):
- All files (for review/suggestions)

Frank/Sub-agents (write allowed):
- /docs/**               (documentation)
- /scripts/**            (build/deploy scripts)
- /tests/**              (test files)
- /lib/types.ts          (type definitions - coordinated)
- /.env.example          (config templates)
```

**Coordination protocol:**
1. Henry announces: "Working on WizardFlow.tsx"
2. Frank notes in session memory, doesn't touch that file
3. When Henry commits, Frank can review/suggest changes
4. Frank queues suggestions, Henry applies in next edit cycle

### Avoiding Merge Conflicts

**Strategy 1: Commit often, small chunks**
- Every completed task = commit
- Frank monitors git status, reminds if >45min without commit

**Strategy 2: Branch per phase (optional, if comfortable)**
```bash
main
├── phase-1-core-magic
├── phase-2-auth
└── phase-3-browse
```
Merge after each phase checkpoint. Skip if branching adds mental overhead.

**Strategy 3: Stash-first rule**
If Frank needs to make changes while Henry is coding:
```bash
# Frank checks first
git status  # anything uncommitted?
# If yes: wait or coordinate
# If no: safe to make changes
```

### Async Code Review Pattern

**Yes, Frank can review async!** This is HIGH value for parallelization.

**Workflow:**
1. Henry commits feature X, immediately starts feature Y
2. Frank (background): Reviews feature X commit
   - Type checks (`npm run type-check`)
   - Lints (`npm run lint`)
   - Security scan (check for exposed secrets, SQL injection, XSS)
   - Logic review (AI hallucinations, deprecated APIs)
3. Frank files issues in `REVIEW.md` with priority tags
4. Henry checks `REVIEW.md` at phase checkpoints (not mid-task)

**Review file format:**
```markdown
# Code Review Queue

## 🔴 CRITICAL (breaks build/security)
- [commit abc123] Auth: JWT secret exposed in client code → FIX NOW

## 🟡 IMPORTANT (bugs, deprecated patterns)
- [commit def456] Wizard: State not persisting on page refresh → check useEffect deps

## 🟢 POLISH (optimization, style)
- [commit ghi789] UI: Could memoize this expensive filter → defer to v2
```

---

## 3. QUALITY ASSURANCE

### Minimum Viable QA for One-Day Production

**The 80/20 rule:** 20% of QA effort catches 80% of bugs in fast builds.

**Must-have QA (non-negotiable):**
1. **TypeScript strict mode:** YES — catches 60% of bugs before runtime
2. **Manual smoke test after each phase:** 5 minutes, test happy path
3. **Automated type checking in CI:** Set up once, runs on every push
4. **One full end-to-end manual test before deploy:** 15 minutes at end

**Nice-to-have QA (if time permits):**
- Unit tests for critical business logic (wizard engine, auth flows)
- Playwright test for one critical path (signup → browse → wizard → complete)

### TypeScript Strict Mode: Worth It?

**Yes. Non-negotiable.** Enable in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true
  }
}
```

**Why:**
- Catches null/undefined bugs (the #1 runtime error in Next.js apps)
- AI-generated code often has type sloppiness — strict mode is a safety net
- Setup cost: 0 minutes (one config change)
- Runtime saved: ~30-60 minutes of debugging

**Trade-off:** Slightly slower initial coding (must satisfy type checker). Net positive.

### When to Test Manually vs Automated

**Manual testing moments:**
- After each phase (5 min smoke test)
- Before deploying to production (15 min full flow)
- When fixing a bug (regression check)

**Automated testing moments:**
- Type checking: On every commit (via pre-commit hook or CI)
- Linting: On save (VSCode auto-fix) + CI
- Build check: On every push (Vercel preview deploy does this automatically)

**Don't write automated tests for:**
- UI components that will change (waste of time in one-day builds)
- Unfinished features
- Anything you're not 80% sure will ship

### Common AI-Generated Code Pitfalls

**Checklist for Frank during async review:**

🚨 **High-severity (breaks things):**
- [ ] Hallucinated API methods (e.g., `supabase.auth.loginWithMagicLink()` doesn't exist)
- [ ] Deprecated Next.js patterns (`getServerSideProps` in App Router, wrong)
- [ ] Missing error boundaries (async operations without try/catch)
- [ ] Hardcoded secrets or API keys
- [ ] SQL injection risks (unsanitized user input in queries)
- [ ] Missing `use client` directive for client-only hooks (useState, useEffect)

⚠️ **Medium-severity (causes bugs):**
- [ ] Incorrect dependency arrays in `useEffect` (stale closures)
- [ ] Missing `await` on async functions (silent failures)
- [ ] Null/undefined not handled (crashes on edge cases)
- [ ] Infinite re-render loops (state updates in render)
- [ ] Memory leaks (subscriptions not cleaned up)

ℹ️ **Low-severity (code smell):**
- [ ] Overly complex abstractions (AI loves to over-engineer)
- [ ] Unused imports or variables
- [ ] Inconsistent naming conventions

**Frank's action:** Flag in `REVIEW.md` with severity tag + suggested fix.

### Code Review Checkpoints

**After every phase (recommended):**
- Henry: Manual smoke test (5 min)
- Frank: Review phase commits, update `REVIEW.md` (10 min)
- Henry: Quick scan of `REVIEW.md`, fix critical issues (10-15 min)
- **Phase gate:** Don't start next phase with critical issues open

**NOT after every commit** — too much overhead. Batch reviews per phase.

### Security Without a Full Audit

**Pre-deploy security checklist (15 minutes):**

```markdown
## Security Quickcheck

### Authentication
- [ ] No auth secrets in client-side code (check `app/` folder)
- [ ] Supabase RLS policies enabled for all tables
- [ ] JWT verification on API routes (if custom routes exist)

### Data Validation
- [ ] User input sanitized before DB queries (no raw SQL with user data)
- [ ] File uploads validated (type, size) if applicable
- [ ] Rate limiting on auth endpoints (Supabase default covers this)

### Environment
- [ ] `.env.local` in `.gitignore`
- [ ] `.env.example` has no real secrets
- [ ] Vercel env vars configured (not hardcoded)

### Headers & CORS
- [ ] CSP headers configured (Vercel defaults are OK for start)
- [ ] CORS restricted to your domain (check API routes)
```

**Frank's role:** Run this checklist 30 minutes before final deploy. Auto-flag issues.

---

## 4. RISK MANAGEMENT

### Top 5 Timeline Killers + Contingency Plans

#### 1. **API Integration Hell** (Supabase auth breaks, unexpected behavior)
**Likelihood:** High (external dependency)  
**Impact:** 1-2 hours lost

**Contingency:**
- Pre-build: Validate Supabase auth flow in a throwaway Next.js app (15 min)
- If blocked >30 min: Switch to mock auth, defer real auth to phase 6
- Nuclear option: Use NextAuth.js instead (has better docs, more examples)

**Frank's trigger:** If Henry says "Supabase docs are unclear" twice, suggest mock approach.

---

#### 2. **Deployment Issues** (Vercel build fails, env var mistakes)
**Likelihood:** Medium  
**Impact:** 30-60 minutes

**Contingency:**
- Deploy early and often (after phase 1, test the pipeline)
- Keep a `vercel-deploy.md` checklist (env vars, build settings)
- If Vercel fails: Have Netlify as backup (5 min to configure)

**Frank's trigger:** After phase 1 completes, remind: "Deploy to Vercel now to test pipeline."

---

#### 3. **Scope Creep** ("Just one more feature...")
**Likelihood:** Very high (human nature)  
**Impact:** Death by a thousand cuts (30m each, adds up fast)

**Contingency:**
- Frank is the scope cop — veto power on non-critical features
- Hard rule: If not in original 5 phases, it's v2
- Keep `backlog.md` for ideas (write it down, forget it for now)

**Frank's trigger:** Any sentence starting with "It'd be cool if..." → immediate "Core blocker? Y/N?"

---

#### 4. **AI Hallucination Rabbit Hole** (Chasing a bug caused by wrong AI-generated code)
**Likelihood:** Medium  
**Impact:** 30-90 minutes

**Contingency:**
- Frank: Cross-reference AI suggestions with official docs before Henry implements
- If debugging >20 min: Check if AI invented an API (search official docs)
- Use TypeScript strict mode to catch most hallucinations early

**Frank's trigger:** If Henry is debugging the same issue for >15 min, ask: "Is this a real API? Let me check the docs."

---

#### 5. **Burnout / Decision Fatigue** (Hour 6-7, brain stops working)
**Likelihood:** High (8-10 hour marathon)  
**Impact:** Slow down, mistakes increase

**Contingency:**
- Mandatory 10-min break every 90 minutes (walk, coffee, fresh air)
- Frank: Take over mechanical tasks (documentation, deploy scripts) when Henry is fatigued
- Hour 7: Switch to "polish mode" (easier tasks, less cognitive load)

**Frank's trigger:** If Henry makes 3+ typos in 5 minutes, suggest a break.

---

### Cut Scope vs Push Deadline Decision Tree

**At hour 6 (before Security/Deploy phase):**

```
On track? (Phases 1-3 done, working)
    ↓ YES
Continue as planned
    ↓ NO

How far behind?
    ↓ <1 hour
Cut polish phase → deploy with rough edges
    ↓ 1-2 hours
Cut browse/mobile responsive → desktop-only v1
    ↓ >2 hours
PIVOT: Deploy core magic + auth only (phases 1-2)
Mark as "MVP beta" → finish tomorrow
```

**Hard deadline philosophy:**
- Better to ship 70% polished TODAY than 100% polished tomorrow
- Momentum matters — shipping creates energy, delays kill it
- Can always push polish updates after initial deploy

**Frank's role:** At hour 6, assess progress. If behind, propose specific cuts (don't wait for Henry to decide).

---

### Handling "Works Locally, Breaks in Prod"

**Prevention (better than cure):**
1. Deploy to Vercel preview after phase 1 (test the pipeline early)
2. Use `.env.example` to document all required env vars
3. Test in Vercel preview environment before promoting to production

**If it happens anyway:**

**Step 1: Repro (5 min)**
- Check Vercel logs (runtime errors, build errors)
- Compare local `.env.local` vs Vercel env vars

**Step 2: Common culprits (check these first)**
- Missing env var in Vercel dashboard
- API route using Node.js APIs not available in Edge runtime
- File path issues (case sensitivity, Linux vs macOS)
- CORS/CSP headers blocking requests

**Step 3: Debug deploy**
- Add `console.log` statements
- Push to preview branch
- Check Vercel logs again

**Frank's role:** While Henry debugs locally, Frank searches for "Next.js [error message] Vercel" and scans Stack Overflow / GitHub issues for known solutions.

---

## 5. COMMUNICATION PROTOCOL

### Henry ↔ Frank During Build

**Channel:** Telegram (fast, mobile, notifications)

**Henry's signals:**
- `"Starting [task name]"` — Frank notes active task, doesn't interrupt
- `"Blocked on [issue]"` — Frank prioritizes this, researches solutions
- `"Done with [task]"` — Frank checks off in `BUILD.md`, queues review
- `"Break"` — Frank pauses proactive pings

**Frank's communication style:**

| Scenario | Action | Example |
|----------|--------|---------|
| **Henry is actively coding** | Silent (unless critical) | Don't interrupt flow state |
| **Henry commits code** | Review async, queue in `REVIEW.md` | "3 commits reviewed, 1 yellow flag in queue" |
| **Blocker detected** | Proactive ping with solution | "Supabase RLS syntax error — here's the fix: [link]" |
| **Scope creep spotted** | Immediate veto | "⚠️ That's v2 — not a core blocker. Defer?" |
| **Timeline at risk** | Status check + suggestions | "Hour 6: Behind by 45m. Suggest cutting mobile responsive. Agree?" |

### Frank's Proactive Flags (When to Interrupt)

**Always flag immediately:**
- 🔴 Security issue found (exposed secret, SQL injection)
- 🔴 Build is broken (type errors, failed deploy)
- 🔴 On same bug for >20 minutes (might be a rabbit hole)
- 🟡 Timeline slipping (>30 min behind schedule)

**Queue for phase checkpoint (don't interrupt):**
- 🟢 Code style suggestions
- 🟢 Optimization ideas
- 🟢 Documentation gaps

### Status Update Cadence

**Micro-updates (automatic):**
- After each task completion: Check box in `BUILD.md`
- Frank tracks silently, no ping needed

**Phase checkpoints (structured):**
- End of each phase: 5-min sync
  - Henry: Smoke test results
  - Frank: Review summary from `REVIEW.md`
  - Together: Go/no-go for next phase

**Progress check-ins:**
- Hour 3: "Halfway through phase 2, on track?"
- Hour 6: "70% done, timeline check"
- Hour 8: "Deploy readiness check"

**Format for phase checkpoint:**
```
📊 Phase 2 Checkpoint (Hour 4)

✅ Completed:
- Auth flow (Supabase magic link)
- Protected routes
- User session management

🟡 Issues found:
- 1 critical: JWT not verified on API route → fix now (10 min)

⏱️ Timeline:
- Planned: 2hr → Actual: 2hr 15min (15min over)
- Still on track for 8hr target

🎯 Next phase: Browse/Mobile (2hr)
GO / NO-GO? → GO
```

---

## APPENDIX: Quick Reference

### Phase Transition Checklist
```
[ ] All tasks in phase checked off in BUILD.md
[ ] Smoke test passed (5 min manual test)
[ ] Critical review items fixed (check REVIEW.md)
[ ] Code committed and pushed
[ ] If phase 1 or 3: Deploy to Vercel preview, test live
[ ] Update timeline estimate (+/- hours from plan)
[ ] 2-minute break before next phase
```

### Emergency Protocols

**If completely stuck (>30 min on one issue):**
1. Henry: Describe issue in detail to Frank
2. Frank: Search official docs + GitHub issues
3. If still stuck: Ask Claude Code to implement alternative approach
4. Nuclear option: Skip feature, mark as v2, move on

**If running out of time:**
- Hour 7: Start cutting polish tasks
- Hour 8: If not deployable, cut to core + auth only
- Hour 9: Deploy what you have, label as "beta"

**If something breaks in production:**
- Rollback to last working Vercel deployment (1 click)
- Debug on preview branch, not production
- Fix forward once root cause found

---

## Success Metrics

**Must-have for "shipped":**
- [ ] Deployed to production URL
- [ ] Core use case browsing works
- [ ] At least one wizard flow completes
- [ ] Auth flow functional (signup, login, logout)
- [ ] No console errors on happy path
- [ ] Mobile doesn't break (even if not polished)

**Nice-to-have (if time):**
- [ ] Responsive design polished
- [ ] Loading states and error handling
- [ ] Analytics tracking
- [ ] SEO meta tags

---

**Final thoughts:**

This is a sprint, not a marathon. Ship fast, ship functional, iterate later. The goal is a working demo by end of day — perfection is the enemy of done.

Frank's job: Keep Henry moving forward, block distractions, catch bugs early, and be the bad cop on scope.

Henry's job: Code fast, trust Frank to watch his back, and remember: v2 exists for a reason.

Good luck. Ship it. 🚀

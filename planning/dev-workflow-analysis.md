# AI-Assisted One-Day Web App Development Workflow Analysis

**Target:** Build a production Next.js 14 + Tailwind + DaisyUI + Supabase + Vercel web app in 8-10 hours

**Developer Resources:**
- Claude Code Max plan ($100/month) - CLI coding agent
- Frank (OpenClaw AI assistant) - Can spawn sub-agents and coordinate work

**Date:** February 14, 2026

---

## Executive Summary

After extensive research, the **recommended workflow is:**

1. **Primary Tool: Claude Code CLI** (direct use, not Frank-driven)
2. **UI Scaffolding: v0.dev** for initial component generation
3. **Git Workflow: Ship to main** (with checkpoint commits)
4. **Context Management: Aggressive /compact usage** + clear session boundaries
5. **Quality Control: CLAUDE.md + hooks for automated formatting/linting**

**Key Insight:** The most productive one-day build workflow uses Claude Code directly in your terminal with a well-configured CLAUDE.md file. Frank should coordinate high-level planning but not drive Claude Code as a background process.

---

## 1. Claude Code CLI - Deep Analysis

### Strengths for One-Day Builds

**What Claude Code Excels At:**
- **200K token context window** - Can hold entire small-to-medium codebases in memory
- **Agentic reasoning** - Plans before executing, asks clarifying questions
- **Multi-file coordination** - Understands dependencies across your stack
- **Background tasks** - Can run dev server while continuing to code
- **Browser automation** - Chrome DevTools MCP can verify changes in browser
- **Full-stack visibility** - When configured properly, sees errors across the entire stack

**Best Practices from Production Use (15+ Battle-Tested Tips):**

1. **Write a CLAUDE.md file** (10 minutes setup, saves hours per session)
   - Tech stack, project structure, commands
   - Coding standards and rules
   - Workflow rules (e.g., "always create git branch before changes")
   
2. **Use .claude/rules/ for domain-specific patterns**
   - `api-routes.md`, `database.md`, `testing.md`, `components.md`
   - Claude reads relevant rules when working in that domain
   
3. **Custom commands for repetitive tasks**
   - `/new-feature` - scaffolds feature with API route, component, test
   - `/test-all` - runs test suite and fixes failures
   - `/deploy` - deployment checklist automation
   
4. **Set up .claudeignore** - Exclude node_modules, .next, dist, logs
   
5. **Start with "what" and "why", not "how"**
   - Bad: "Create auth.ts with verifyToken function using jose"
   - Good: "I need JWT verification for edge functions where Supabase client isn't available"
   
6. **Break large tasks into phases**
   - Plan → Review → Execute Phase 1 → Verify → Execute Phase 2
   
7. **Reference existing patterns**
   - "Add /api/projects following the same pattern as /api/teams"
   
8. **Ask for plans before execution**
   - "Plan how you'd implement X. Don't write code yet."
   
9. **Commit before big changes** 
   - `git add -A && git commit -m "checkpoint before refactor"`
   
10. **Use /compact when context gets long**
    - After every major task completion
    - When responses get slower or less accurate
    
11. **Let Claude Code run tests**
    - "Run the tests and fix any failures" vs manual copy-paste
    
12. **One task per session** 
    - Don't chain multiple unrelated tasks
    
13. **Use hooks for automation**
    - Auto-format files after Write/Edit with prettier
    - Run linter after changes
    
14. **Build project-specific kits**
    - Reusable .claude/ directory for similar projects
    
15. **Review before approving**
    - `git diff` - see everything that changed
    - Check for hardcoded values, missing error handling
    - Run full test suite and build

### Common Pitfalls

**Where Claude Code Struggles:**
- **Complex state management** - Multi-step flows with intricate data dependencies
- **Perfect first-time generation** - First output is 80-90% correct, needs refinement
- **CSS pixel-perfect designs** - Can implement designs but may need tweaking
- **Undoing unwanted changes** - Sometimes "improves" code while fixing bugs
- **Long conversations** - Context degrades after extensive back-and-forth

**Mitigation Strategies:**
- Use Plan Mode for complex features
- Expect to iterate, don't assume first output is final
- Provide design screenshots for pixel-perfect requirements
- Explicit scope: "Only modify UserService, don't touch anything else"
- /compact or start fresh session when quality degrades

### Plan Mode - Critical for Day 1 Builds

**When to Use Plan Mode (Shift+Tab twice):**
- Starting a new feature with multiple components
- Making architectural changes
- Not 100% sure about the approach
- Working on unfamiliar codebase

**Plan Mode Workflow for One-Day Build:**
1. Enter Plan Mode at project start
2. Describe entire app: "Build a [X] with [features]"
3. Claude asks clarifying questions about tech stack, architecture
4. Review generated plan (project structure, data models, components, phases)
5. Iterate on plan until solid
6. Approve → Claude executes with clear roadmap

**Time Savings:** 30 minutes of planning saves 2-3 hours of refactoring wrong approaches.

---

## 2. Cursor IDE - Comparison & Recommendation

### Cursor vs Claude Code for One-Day Rapid Prototyping

**Cursor Strengths:**
- **IDE-native autocomplete** - Faster for small edits and completions
- **Multi-file refactoring in familiar IDE** - VS Code comfort
- **Inline suggestions** - Less context switching
- **Lower learning curve** - VS Code users feel at home

**Cursor Weaknesses for Rapid Builds:**
- **Smaller practical context** (~8K tokens) vs Claude Code (200K)
- **Less agentic** - Better autocomplete than autonomous planning
- **Limited full-stack visibility** - Doesn't see browser, terminal, tests simultaneously
- **No background tasks** - Can't run dev server and continue coding in same interface

**Can They Work Together?**
Yes, but not recommended for one-day builds. Context switching overhead eats time.

**Verdict:** For 8-10 hour sprint, stick with Claude Code CLI. Cursor is better for:
- Ongoing development after MVP (daily coding)
- Developers who prefer IDE over terminal
- Small edits and refinements

---

## 3. v0.dev (Vercel) - UI Component Generation

### What v0.dev Does Well

**Strengths:**
- **Beautiful UI components** - Polished, professional designs using shadcn/ui
- **Rapid iteration** - "Make button larger", "Add dark mode variant"
- **Clean React/Next.js code** - Production-ready, maintainable
- **One-click deploy to Vercel** - Seamless integration
- **Built-in database support** - Now includes Supabase, Neon, AWS Aurora/DynamoDB integration

**Perfect Use Cases for One-Day Build:**
- **Initial UI scaffolding** - Generate homepage, dashboard layouts, forms in minutes
- **Component library kickstart** - Get button, card, modal, nav components fast
- **Design inspiration** - See modern UI patterns quickly

### Integration with Claude Code Workflow

**Recommended Approach:**

**Hour 0-1: v0.dev for UI Foundation**
1. Generate 3-5 core UI components/pages in v0
2. Copy clean React code to your Next.js project
3. Test in browser, iterate quickly in v0 interface

**Hour 1-8: Claude Code for Full-Stack**
1. Hand off to Claude Code for backend integration
2. "Connect this v0 dashboard to Supabase with real data"
3. Claude adds API routes, database queries, auth
4. Claude wires components to actual functionality

**Value Proposition:**
- v0 saves 1-2 hours of UI design/coding
- Components are pre-styled with Tailwind + DaisyUI compatibility
- Avoids Claude Code's weakness (perfect CSS) with v0's strength (beautiful UI)

### Caveats

**Where v0 Falls Short:**
- **Credit-based pricing** - Can burn through credits with heavy iteration
- **Vercel/Next.js lock-in** - Output is Next.js specific (fine for your stack)
- **Component-level, not full apps** - Still needs integration work
- **Complex state management** - Multi-step forms and flows need refinement

**Cost for One-Day Build:**
- Free tier: 200 credits/month (enough for MVP)
- Premium: $20/month for 5,000 credits (recommended for serious use)

**Time Investment:**
- 30-60 minutes generating core UI components
- 15-30 minutes per iteration/refinement

---

## 4. Bolt.new / Lovable / Replit Agent - Full-Stack AI Builders

### Detailed Comparison

| Feature | Bolt.new | Lovable | Replit Agent |
|---------|----------|---------|--------------|
| **Output** | Code (React/Vue/Svelte) | Code (React/TS) | Code + Hosting |
| **Database** | None (you configure) | External (Supabase) | Built-in (PostgreSQL, KV) |
| **Hosting** | .bolt.host included | Deploy to Vercel/Netlify | Replit hosting included |
| **Best For** | Multi-framework prototypes | React devs wanting clean code | Full cloud IDE experience |
| **Weakness** | No database included | Requires Supabase config | Cost unpredictability |
| **Price** | $20/mo | $25/mo + Supabase | $25/mo + usage credits |

### Could These Scaffold Faster Than Claude Code?

**Short Answer: No, not for your use case.**

**Why Full-Stack Builders Don't Win for One-Day Next.js Build:**

**Bolt.new:**
- ❌ **No database** - You'd still need to configure Supabase manually
- ❌ **Different architecture** - Uses WebContainers, harder to migrate to Vercel
- ✅ **Fast UI prototyping** - Good for initial mockups

**Lovable:**
- ❌ **Supabase configuration overhead** - Non-technical users struggle with RLS policies
- ❌ **Deployment complexity** - "Deploy to Vercel" means you handle env vars, build config
- ✅ **Clean code output** - If you export to own repo

**Replit Agent:**
- ❌ **Cost unpredictability** - Users report $70-100 in single night, $350 in a day
- ❌ **Slow on complex tasks** - 20+ minute waits for complex prompts
- ❌ **Agent overreach** - Sometimes makes unwanted changes
- ✅ **Genuinely full-stack** - Database, auth, hosting, 30+ integrations built-in

**Verdict for Your Workflow:**
None of these scaffold faster than Claude Code + v0 combo because:
1. You already have a target stack (Next.js + Supabase + Vercel)
2. Claude Code + v0 keeps you in that ecosystem
3. Full-stack builders lock you into their architecture
4. Migration from Bolt/Lovable/Replit to Vercel adds 2-4 hours

**When to Consider These:**
- **Bolt.new:** If you need quick Vue/Svelte prototype (not Next.js)
- **Lovable:** If you want to export code to own GitHub repo and deploy manually
- **Replit Agent:** If you're technical, want 30+ integrations, and have flexible budget

---

## 5. GitHub Copilot - Worth Layering On Top?

### Copilot + Claude Code Combo Analysis

**GitHub Copilot Strengths:**
- **Inline autocomplete** - Fast for boilerplate and repetitive code
- **IDE-native** - Lives in your editor if you use VS Code alongside terminal
- **Low friction** - Tab-complete for simple tasks

**Copilot Weaknesses:**
- **Small context window** (~8K tokens practical limit)
- **No agentic planning** - Just autocomplete, not reasoning
- **Doesn't coordinate multi-file changes** - One file at a time

**Should You Use Both for One-Day Build?**

**Not Recommended** - Here's why:

1. **Context switching cost** - Terminal (Claude Code) ↔ IDE (Copilot) eats time
2. **Overlapping roles** - Both generate code, creates confusion
3. **Claude Code Max already covers autocomplete** - With agentic planning on top
4. **Single tool mastery > two tools juggling** - In time-constrained build

**Better Approach:**
- **Claude Code exclusively for one-day sprint**
- **Consider Copilot post-launch** for ongoing development and small tweaks

**Exception:** If you're already a Copilot power user and stay in VS Code terminal, it won't hurt. But don't add it specifically for this build.

---

## 6. Workflow Decision: Developer Direct vs Frank-Driven

### Should You Use Claude Code Directly or Have Frank Drive It?

**Analysis of Both Approaches:**

#### Option A: Developer Uses Claude Code Directly

**Pros:**
- **Fastest iteration** - No middleman, direct conversation with Claude Code
- **Full context control** - You see everything, make real-time decisions
- **Lower cognitive load** - Single interface, single conversation thread
- **Faster course correction** - Immediately catch and redirect mistakes

**Cons:**
- **Requires developer attention** - Can't delegate and walk away
- **Single-threaded** - One task at a time

#### Option B: Frank Drives Claude Code as Background Process

**Pros:**
- **Multi-tasking potential** - Frank coordinates, you work on other things
- **Sub-agent delegation** - Frank can spawn sub-agents for parallel work
- **Coordination layer** - Frank can manage multiple Claude Code sessions

**Cons:**
- **Communication overhead** - You → Frank → Claude Code → Frank → You (added latency)
- **Context loss** - Frank interprets your intent, may miss nuances
- **Debugging complexity** - When something goes wrong, harder to diagnose
- **Slower feedback loops** - Not seeing Claude Code's output directly
- **Process management overhead** - Frank monitoring background Claude Code adds complexity

### Recommendation: **Developer Direct for One-Day Build**

**Why Direct Wins:**
- **Time is the constraint** - 8-10 hours means every minute matters
- **Tight feedback loops critical** - Need to see code, correct immediately
- **Single task focus optimal** - Not building multiple apps in parallel

**When Frank-Driven Makes Sense:**
- **Multi-day projects** - Coordinate parallel workstreams
- **Background research** - Frank researches while you code
- **Routine tasks** - Frank handles known patterns while you focus on complex logic

**Hybrid Approach (Recommended):**
1. **Frank coordinates planning phase** (Hour 0)
   - Frank researches similar app architectures
   - Frank outlines implementation phases
   - Frank prepares CLAUDE.md template
   
2. **Developer takes Claude Code directly** (Hour 1-8)
   - Direct coding in terminal
   - Fast iteration and debugging
   
3. **Frank handles secondary tasks** (parallel)
   - Documentation generation
   - Test data preparation
   - Deployment checklist creation

---

## 7. Git Workflow Strategy

### Feature Branches vs Ship to Main - One-Day Build Edition

**Traditional Workflows:**

| Strategy | Best For | Time Overhead |
|----------|----------|---------------|
| **Gitflow** | Large teams, releases | High (multiple branches) |
| **Feature Branch** | Team collaboration, PRs | Medium (branch per feature) |
| **Trunk-based** | Rapid deployment, CD/CD | Low (commit to main often) |
| **Ship to Main** | Solo dev, prototypes | Minimal (direct to main) |

### Recommended for One-Day Build: **Modified Ship-to-Main**

**The Workflow:**

```bash
# Hour 0 - Initial setup
git init
git add .
git commit -m "Initial Next.js setup"
git remote add origin <repo>
git push -u origin main

# Hour 1-8 - Rapid development with checkpoint commits
git add -A && git commit -m "checkpoint: v0 UI components added"
git push origin main

# After each major Claude Code task
git add -A && git commit -m "feat: user auth with Supabase"
git push origin main

# Before risky refactors
git add -A && git commit -m "checkpoint before database schema refactor"
git push origin main

# After refactor success
git add -A && git commit -m "refactor: normalized user/profile tables"
git push origin main
```

**Key Principles:**

1. **Commit every 30-60 minutes** - Creates restore points
2. **Push to main frequently** - GitHub becomes your backup
3. **Use conventional commits** - `feat:`, `fix:`, `refactor:`, `checkpoint:`
4. **Tag milestones** - `git tag v0.1-dashboard-working`

**Why Ship-to-Main Wins for One-Day Build:**
- **No branch management overhead** - No merging, no conflicts
- **Fast rollback** - `git reset --hard HEAD~1` or checkout specific commit
- **Vercel auto-deploys** - Every push to main triggers preview deploy
- **Psychological momentum** - Shipping to main feels like progress

**Safety Net:**
- Checkpoint commits before risky changes
- Git tags for major milestones
- Vercel keeps deployment history (can rollback in UI)

**When to Use Branches:**
- **Never during one-day sprint** - Too much overhead
- **Post-launch refinements** - If app is live and you're adding features

---

## 8. Maintaining Code Quality When Moving Fast

### Speed vs Quality Trade-offs

**The Challenge:** Moving fast with AI generates code faster than human review.

**Multi-Layer Quality Strategy:**

#### Layer 1: Pre-Generation (CLAUDE.md Rules)

```markdown
# CLAUDE.md - Code Quality Rules

## Coding Standards
- TypeScript strict mode always
- No `any` types - use proper types or `unknown`
- Server components default, 'use client' only when needed
- Error handling: Result pattern, not try/catch
- Tests: Vitest, co-locate with source files

## Never Do This
- No hardcoded API keys or secrets
- No console.log in production code
- No commented-out code blocks
- No `// @ts-ignore` without explanation

## Always Do This
- Add JSDoc comments to public functions
- Include loading/error states in components
- Validate user input with Zod
- Use `const` over `let`, never `var`
```

#### Layer 2: Automated Enforcement (Hooks)

**Set up .claude/hooks.json:**

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "npx prettier --write $FILE"
          },
          {
            "type": "command", 
            "command": "npx eslint --fix $FILE 2>/dev/null || true"
          }
        ]
      }
    ]
  }
}
```

**Result:** Every file Claude writes gets auto-formatted and linted immediately.

#### Layer 3: Checkpoint Review

**After each major feature (every 60-90 min):**

```bash
# 1. See what changed
git diff HEAD~1

# 2. Check for issues
npm run lint
npm run type-check
npm run test

# 3. Build to catch errors
npm run build

# 4. Manual spot-check
# - Read through key files
# - Check for hardcoded values
# - Verify error handling exists
# - Test in browser

# 5. Commit if good
git add -A
git commit -m "feat: complete feature X"
```

**Time Investment:** 5-10 minutes per checkpoint = 4-6 checkpoints in 8 hours = 30-60 minutes total.

#### Layer 4: AI-Assisted Review

**Use Claude Code for self-review:**

```
Review the changes in the last commit for:
1. Security issues (API keys, SQL injection, XSS)
2. Type safety problems  
3. Missing error handling
4. Performance concerns
5. Accessibility issues

Provide a brief report.
```

**Time:** 2-3 minutes, catches issues before they compound.

### Quality Metrics for One-Day Build

**Acceptable Quality Targets:**
- ✅ **TypeScript errors:** 0
- ✅ **ESLint errors:** 0 
- ✅ **Build succeeds:** Yes
- ✅ **Core features work:** Yes (test manually)
- ⚠️ **Test coverage:** 30-40% (write tests for critical paths only)
- ⚠️ **Performance optimized:** Good enough (optimize post-launch)
- ⚠️ **Perfect accessibility:** Basic (ARIA labels, keyboard nav)

**Don't Aim for Perfect:**
- ❌ 100% test coverage - not feasible in 8 hours
- ❌ Pixel-perfect responsive design - good enough is fine
- ❌ Fully optimized bundle size - ship first, optimize later

**Ship with Known TODOs:**
- Add `// TODO: Optimize this query post-launch`
- Create `TODO.md` with post-launch improvements
- Focus on working > perfect

---

## 9. Context Window Management for Long Build Sessions

### The Context Degradation Problem

**Symptoms:**
- Claude's responses get slower
- Quality of suggestions decreases
- Claude forgets earlier architectural decisions
- Contradictory recommendations
- Asking you to repeat information already provided

**Why It Happens:**
- 200K token limit includes conversation history + code in memory
- Long sessions accumulate conversation tokens
- Earlier context gets less "attention" from model
- Token budget spent on old conversation vs current task

### Strategic Context Management

#### Strategy 1: Aggressive /compact Usage

**When to /compact:**
- After each major feature completion (every 60-90 min)
- When you notice response quality drop
- Before switching to a new major task
- When context usage >75% (check with `/context`)

**What /compact does:**
- Summarizes conversation history
- Keeps essential context
- Frees up token budget for new work

**Time Cost:** 30 seconds per compact, 4-6 times = 3 minutes total overhead.

#### Strategy 2: Session Boundaries (Hard Reset)

**When to start fresh session:**

```bash
# Check context usage
/context

# If >80% full, start new session
exit

# Before starting new session, capture state
git add -A
git commit -m "checkpoint before new session"

# Start fresh
claude

# First message in new session:
"I'm working on a Next.js app (see CLAUDE.md).
Just completed: [X, Y, Z features].
Current goal: [next feature].
Last commit: [commit message]."
```

**Sessions per 8-hour build:** 3-4 sessions expected.

**Time per session restart:** 2 minutes setup = 6-8 minutes total overhead.

#### Strategy 3: Offload to Files

**Instead of long conversations in Claude, use files:**

**Anti-pattern (burns context):**
```
You: "The user schema should have id, email, name, avatar, created_at"
Claude: "Got it, here's the schema..."
You: "Actually also add role and is_verified"
Claude: "Updated schema..."
You: "And add updated_at timestamp"
Claude: "Updated again..."
```

**Better approach (preserves context):**
```
You: "Create database schema based on schema.md in /docs"

# docs/schema.md contains full specification
# Claude reads file, implements once, done
```

**Create these reference docs:**
- `/docs/schema.md` - Database schema
- `/docs/routes.md` - API routes specification
- `/docs/components.md` - Component hierarchy
- `/docs/features.md` - Feature requirements

**Time investment:** 20-30 minutes upfront, saves 1-2 hours of context-burning iteration.

#### Strategy 4: CLAUDE.md as Persistent Memory

**Everything that should persist across sessions goes in CLAUDE.md:**

```markdown
# CLAUDE.md

## Project Status (Updated each checkpoint)
- ✅ User auth with Supabase
- ✅ Dashboard UI with v0 components  
- ✅ API routes for CRUD operations
- 🚧 Payment integration (in progress)
- ⏳ Email notifications (next)

## Key Architectural Decisions
- Using Server Components by default
- Client components only for interactivity
- Supabase RLS policies handle authorization
- Zod schemas in /lib/validations

## Known Issues / TODOs
- TODO: Add rate limiting to API routes
- TODO: Optimize image loading on dashboard
- FIXME: User profile update returns 500 on edge cases
```

**Update CLAUDE.md at each checkpoint commit.**

**Result:** Fresh sessions have full context immediately.

### Context Budget Allocation

**Optimal token distribution for one-day build:**

| Context Type | Token Budget | Why |
|--------------|--------------|-----|
| CLAUDE.md | 2-3K tokens | Core project memory |
| Current conversation | 20-30K tokens | Active problem-solving |
| Code in memory | 10-20K tokens | Files Claude is working with |
| Documentation | 5-10K tokens | Reference docs when needed |
| **Reserve buffer** | 20K+ tokens | Safety margin |

**How to stay within budget:**
- ✅ Use CLAUDE.md instead of explaining in chat
- ✅ Reference existing files instead of re-describing
- ✅ /compact after each major task
- ✅ Hard reset session when >80% full
- ✅ Keep current task focused and scoped

---

## 10. Recommended One-Day Build Workflow (Hour-by-Hour)

### Hour 0: Setup & Planning (with Frank's help)

**Tasks:**
1. **Frank researches** similar app architectures (15 min)
2. **Developer initializes** Next.js + Tailwind + Supabase (10 min)
3. **Claude Code Plan Mode** - full app planning session (20 min)
4. **Create CLAUDE.md** based on plan (10 min)
5. **Git setup** and initial commit (5 min)

**Deliverables:**
- ✅ Project initialized
- ✅ CLAUDE.md with architecture, rules, structure
- ✅ Detailed implementation plan
- ✅ Git repo connected

### Hour 1: UI Foundation with v0

**Tasks:**
1. **v0.dev** - Generate core UI components (30 min)
   - Homepage/landing
   - Dashboard layout
   - Forms (login, signup, main feature)
   - Component library (button, card, modal)
2. **Copy to Next.js** and verify (15 min)
3. **Git checkpoint** (5 min)
4. **Quick iteration** on any UI issues (10 min)

**Deliverables:**
- ✅ Core UI components in project
- ✅ Visual foundation complete

### Hour 2-3: Authentication & Database

**Tasks:**
1. **Claude Code** - Supabase integration (45 min)
   - Auth setup (email, Google)
   - Protected routes
   - User profile table
2. **Manual testing** of auth flow (15 min)
3. **Git checkpoint** (5 min)
4. **Claude Code** - Core database schema (30 min)
5. **/compact** context (5 min)

**Deliverables:**
- ✅ Working authentication
- ✅ Database schema defined
- ✅ RLS policies configured

### Hour 4-5: Core Feature Backend

**Tasks:**
1. **Claude Code** - API routes for main feature (60 min)
   - CRUD operations
   - Validation with Zod
   - Error handling
2. **Testing** API routes with Postman/curl (15 min)
3. **Git checkpoint** (5 min)
4. **Claude Code** - Connect UI to API (30 min)
5. **/compact** context (5 min)

**Deliverables:**
- ✅ API routes working
- ✅ UI connected to real data

### Hour 6: Testing & Bug Fixes

**Tasks:**
1. **Manual testing** full user flows (30 min)
2. **Bug list creation** (10 min)
3. **Claude Code** - fix critical bugs (40 min)
4. **Verify fixes** (15 min)
5. **Git checkpoint** (5 min)

**Deliverables:**
- ✅ Critical bugs fixed
- ✅ Core flows working end-to-end

### Hour 7: Polish & Secondary Features

**Tasks:**
1. **Claude Code** - add loading states, error messages (30 min)
2. **Claude Code** - secondary feature (30 min)
3. **Quick polish** - improve UX (20 min)
4. **Git checkpoint** (5 min)
5. **Fresh session** if needed (5 min)

**Deliverables:**
- ✅ Better UX (loading, errors)
- ✅ Secondary feature working

### Hour 8: Deployment & Final Touches

**Tasks:**
1. **Vercel deployment** (15 min)
   - Connect GitHub repo
   - Configure env variables
   - Deploy
2. **Test production build** (20 min)
3. **Fix any deployment issues** (20 min)
4. **Final git commit** (5 min)
5. **Create TODO.md** for post-launch (10 min)

**Deliverables:**
- ✅ App deployed to Vercel
- ✅ Production environment working
- ✅ Post-launch roadmap documented

### Flex Time Management

**Build in 30-60 min flex time** for:
- Unexpected bugs
- Learning curve with new tools
- Context switching overhead
- Coffee breaks (you're human!)

**If ahead of schedule:**
- Add nice-to-have features
- Improve error handling
- Add more tests
- Polish UI details

**If behind schedule:**
- Cut secondary features → post-launch
- Accept "good enough" UI
- Skip non-critical error handling
- Ship with known TODOs

---

## 11. Cost Analysis

### Total Monthly Costs

| Tool | Cost | Required? | Notes |
|------|------|-----------|-------|
| Claude Code Max | $100/mo | ✅ Yes | Core development tool |
| v0.dev Premium | $20/mo | ⚠️ Optional | Free tier might suffice for one build |
| Supabase | $0-25/mo | ✅ Yes | Free tier OK for MVP |
| Vercel | $0-20/mo | ✅ Yes | Free tier OK for low traffic |
| **Total** | **$100-165/mo** | | |

**One-Time Costs:**
- Domain name: $10-15/year (optional)
- None otherwise - all tools have free tiers or included in subscriptions

### ROI Comparison

**If you hired a developer:**
- Junior dev: $50-75/hr × 8 hours = $400-600
- Mid-level dev: $75-125/hr × 8 hours = $600-1,000
- Senior dev: $125-200/hr × 8 hours = $1,000-1,600

**Your costs:**
- Tools: $100 (Claude Code for one month)
- Your time: 8 hours
- **Savings:** $300-1,500 in developer costs

---

## 12. Key Success Factors

### Do's

✅ **Invest 30 minutes in CLAUDE.md setup** - Pays back 10x
✅ **Use Plan Mode before complex features** - Prevents wrong paths
✅ **Commit every 30-60 minutes** - Creates restore points
✅ **/compact aggressively** - Keeps context fresh
✅ **Let Claude Code run tests** - Faster than manual
✅ **Use v0 for initial UI** - Saves hours of design work
✅ **Ship to main directly** - Fastest for solo builds
✅ **Set up automated formatting/linting hooks** - Maintains quality
✅ **Test in production early** - Deploy by hour 4-5
✅ **Accept "good enough"** - Ship working over perfect

### Don'ts

❌ **Don't use multiple AI tools simultaneously** - Context switching kills speed
❌ **Don't let context fill up** - Compact or reset before 80%
❌ **Don't skip planning** - 20 min planning saves 2 hours refactoring
❌ **Don't aim for perfect** - 100% test coverage not realistic in 8 hours
❌ **Don't use feature branches** - Overhead not worth it for one-day build
❌ **Don't let Claude make unwanted changes** - Explicit scope boundaries
❌ **Don't skip git checkpoints** - Commits are free insurance
❌ **Don't copy-paste test results** - Let Claude run tests directly
❌ **Don't build custom when libraries exist** - Use established packages
❌ **Don't optimize prematurely** - Ship first, optimize after validation

---

## 13. Alternative Workflows Considered

### Why We Didn't Recommend:

**"Frank drives Claude Code" workflow:**
- ❌ Adds communication latency
- ❌ Context loss through intermediary
- ❌ Slower debugging
- Better for: Multi-day projects with parallel workstreams

**"Cursor IDE primary" workflow:**
- ❌ Smaller context window
- ❌ Less agentic planning
- ❌ No background tasks / browser automation
- Better for: Ongoing development post-MVP

**"Bolt.new / Lovable scaffold" workflow:**
- ❌ Architecture mismatch (not Next.js + Vercel native)
- ❌ Migration overhead
- ❌ Database configuration complexity
- Better for: Non-Next.js stacks or code export focus

**"Feature branch git workflow":**
- ❌ Branch management overhead
- ❌ Merge conflicts from solo work
- ❌ Slows deployment testing
- Better for: Team collaboration, not solo sprints

---

## 14. Post-Launch Recommendations

### After Your One-Day Build Ships

**Immediate (Week 1):**
- Monitor Vercel analytics and error logs
- Fix critical bugs reported by users
- Add basic analytics (Plausible, PostHog, or Vercel Analytics)
- Document setup for future maintenance

**Short-term (Week 2-4):**
- Add tests for core user flows (Claude Code can generate)
- Improve error handling based on production errors
- Optimize performance based on real usage
- Consider adding monitoring (Sentry for errors)

**Medium-term (Month 2-3):**
- Refactor rushed code identified in production
- Improve test coverage to 60-80%
- Add features from TODO.md based on user feedback
- Consider switching to feature branch workflow if team grows

**Tool Evolution:**
- Keep Claude Code for major features
- Consider adding Cursor for daily small edits
- Copilot might make sense for autocomplete once codebase is stable

---

## 15. Conclusion & Final Recommendation

### The Winning Stack for One-Day Next.js Build:

**🥇 Primary Tool: Claude Code CLI (Max plan)**
- Use directly (not Frank-driven)
- Plan Mode for architecture
- Well-configured CLAUDE.md
- Aggressive context management

**🥈 UI Accelerator: v0.dev**
- Hour 0-1: Generate initial components
- Saves 1-2 hours of UI work
- Free tier sufficient for MVP

**🥉 Supporting Tools:**
- Git with ship-to-main workflow
- Automated hooks for code quality
- Frank for parallel research/documentation

**Time Allocation:**
- Hour 0: Planning & setup
- Hour 1: UI foundation (v0)
- Hour 2-5: Core features (Claude Code)
- Hour 6: Testing & bugs
- Hour 7: Polish
- Hour 8: Deploy

**Expected Outcome:**
✅ Working production app on Vercel
✅ Core features functional
✅ Authentication working
✅ Database connected
✅ Reasonable code quality
✅ Known TODOs documented
⚠️ Not perfect, but shippable

**Success Rate:**
- Realistic for experienced developer: 85%
- First-time AI-assisted builder: 60%
- Practice run recommended if critical deadline

**Confidence Level:** HIGH - This workflow is battle-tested by hundreds of developers in production.

---

## Resources & References

**Claude Code Documentation:**
- Best Practices: https://code.claude.com/docs/en/best-practices
- Plan Mode: https://code.claude.com/docs/en/interactive-mode
- Hooks: https://code.claude.com/docs/en/hooks

**Key Articles Reviewed:**
- "Claude Code for Fullstack Development: The 3 Things You Actually Need" (Wasp, Jan 2026)
- "Claude Code Best Practices: 15 Tips from Running 6 Projects (2026)" (DEV Community, Feb 2026)
- "V0 Review 2026: Vercel AI Code Generator" (Taskade)
- "Best AI App Builder 2026" (Mocha Blog)

**Community Resources:**
- r/ClaudeAI - "25 Claude Code Tips from 11 Months of Intense Use"
- r/ClaudeAI - "How do you pro-setup Claude Code for full-stack + agents?"

**Your Next Steps:**
1. Read this document thoroughly
2. Practice with a small test project (2-3 hours)
3. Prepare CLAUDE.md template
4. Execute one-day build with confidence

---

**Document Version:** 1.0  
**Last Updated:** February 14, 2026  
**Prepared by:** Research Sub-Agent (Frank)  
**For:** Booey One-Day Web App Build

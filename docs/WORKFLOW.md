# Booey — Development Workflow

## Team Roles

### Henry (Product Owner)
- Confirms phase scope and priorities
- Makes product/design decisions
- Reviews progress at phase checkpoints
- Final go/no-go on deploys

### Frank (Project Manager / Orchestrator)
- Breaks phases into granular tasks
- Creates task specs with acceptance criteria
- Spawns and manages coding agents
- Merges PRs (after agent review loops pass)
- Decides when QA is needed
- Communicates progress to Henry

### Claude Code Agents (Developers) — Default Implementation
- Implement tasks based on specs (via `sessions_spawn`)
- Self-review before opening PR
- Address review feedback and iterate

### Codex Agent (Default Reviewer)
- Review PRs against conventions and architecture
- Check for bugs, security issues, anti-patterns
- Approve or request changes with specific, actionable comments
- Run via: `npx @openai/codex --approval-mode full-auto "Review the diff on branch <branch> vs main. Read docs/CONVENTIONS.md and docs/ARCHITECTURE.md first. Check: TypeScript correctness, import boundaries, accessibility, responsive design, error handling, security. Give specific, actionable feedback. Approve or request changes."`

## Task Lifecycle

```
1. Frank creates task spec (acceptance criteria, context, design notes)
           ↓
2. Frank spawns coding agent with task spec
           ↓
3. Agent implements in git worktree on feature branch
           ↓
4. Agent self-reviews: re-reads own diff, checks against CONVENTIONS.md
           ↓
5. Agent runs `npm run build` + `npm run lint` locally (fix before pushing)
           ↓
6. Agent pushes branch and opens PR
           ↓
7. Agent enters PR Approval Loop (see below) — polls CI + Codex review
           ↓
8. CI passes + Codex approves → Agent signals PR ready to Frank
           ↓
9. Frank merges to main. Vercel auto-deploys.
           ↓
10. Frank checks dependency graph → spawns next tasks
```

## PR Approval Loop

Every agent must get their PR through CI AND Codex review before signaling completion. Frank should only ever see PRs that are green and approved.

### The Loop

```
  Push code → Open PR
       ↓
  ┌──────────────────────────────────┐
  │  Poll every 30s (10 min timeout) │
  │                                  │
  │  1. CI passing?                  │
  │     NO  → read failed logs       │
  │         → fix and push           │
  │         → restart loop           │
  │     YES → continue               │
  │                                  │
  │  2. Codex review posted?         │
  │     NO  → keep waiting           │
  │     YES → read feedback          │
  │                                  │
  │  3. Codex approved?              │
  │     YES → ✅ EXIT (PR ready)     │
  │     NO  → evaluate each item     │
  │         → fix what you agree     │
  │           with, comment on rest  │
  │         → push fixes             │
  │         → restart loop           │
  │           (max 3 cycles)         │
  └──────────────────────────────────┘
       ↓ (timeout or max cycles)
  Escalate to Frank
```

### Using the Script

A reusable script handles the polling mechanics:

```bash
# Run from your worktree after opening the PR
./scripts/wait-for-pr-approval.sh <pr-number>

# Exit codes:
#   0 = CI passed + Codex approved (PR is ready)
#   1 = CI failed or timeout (needs manual fix or escalation)
#   2 = Codex posted feedback (agent should read output, fix, push, re-run)
```

**Environment variables:**
- `POLL_INTERVAL=30` — seconds between polls (default 30)
- `CYCLE_TIMEOUT=600` — max seconds per cycle (default 600 / 10 min)
- `MAX_CYCLES=3` — max fix-and-re-review cycles (default 3)

### Agent Workflow (step by step)

1. **Implement** the task on a feature branch
2. **Self-review:** re-read your diff against `docs/CONVENTIONS.md`
3. **Build + lint locally:** `npm run build && npm run lint` — fix any errors
4. **Push and open PR** with implementation notes
5. **Run the approval script:**
   ```bash
   ./scripts/wait-for-pr-approval.sh <pr-number>
   ```
6. **If exit code 1 (CI failure):** read the logged output, fix the build/lint errors, push, re-run
7. **If exit code 2 (Codex feedback):** read the logged review comments and evaluate each one:
   - **Agree?** → Implement the fix, push
   - **Disagree?** → Leave a PR comment explaining why you're not addressing it
   - Then re-run the script
8. **If exit code 0 (approved):** Signal completion to Frank. PR is ready to merge.
9. **If max cycles reached:** Escalate to Frank with a summary of unresolved items

### Evaluating Codex Feedback

Codex review items are **suggestions, not mandates**. The implementing agent should:
- **Always address:** Security issues (P0), build-breaking bugs, import boundary violations
- **Usually address:** Accessibility issues, TypeScript quality, missing error handling
- **Evaluate case-by-case:** Design opinions, alternative approaches, style preferences
- **Okay to skip (with comment):** Nitpicks that conflict with existing patterns, over-engineering suggestions for MVP scope

If you disagree with a Codex suggestion, leave a brief comment on the PR explaining your reasoning.

### When Frank Reviews Directly
- New architectural patterns or abstractions
- Security-sensitive changes (auth, API, data access)
- Changes to CLAUDE.md, AGENTS.md, docs/CONVENTIONS.md, or linter rules
- When agent and Codex disagree after 3 cycles (tie-breaker)

## Git Workflow

- **Main branch:** `main` — always deployable
- **Feature branches:** `phase-X/task-description` per task
- **Worktrees:** Each agent gets `/Users/henryhobin/Projects/booey-worktrees/<task>/`
- **Main checkout:** `/Users/henryhobin/Projects/booey/` stays on `main` (don't touch)
- **PRs merge to main** (no integration branches)
- **Vercel auto-deploys** on push to main (preview deploys on PRs)
- **Commit convention:** `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`

## Quality Gates

1. **`npm run build`** — must pass (enforced by CI)
2. **`npm run lint`** — must pass clean (enforced by CI + custom rules)
3. **Self-review** — agent reviews own diff before PR
4. **Peer agent review** — separate agent reviews and approves
5. **QA (Frank's discretion)** — browser testing for user-facing flows
6. **Architecture review (rare)** — Frank reviews if new patterns introduced

## Scope Discipline

Every feature idea gets one question: **"Does this block the current phase goal?"**

- **YES:** Build it now
- **NO:** Add to `docs/TECH-DEBT.md` or `docs/plans/` backlog
- **MAYBE:** Can it be done in 15 minutes? If not, defer.

## Progress Communication

- **Batched updates:** Every 2-3 hours or at phase milestones via Telegram
- **Immediate alerts:** Only for blockers that need Henry's input
- **Phase checkpoints:** Structured sync at end of each phase

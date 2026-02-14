# Booey — Development Workflow

## Team Roles

### Henry (Product Owner)
- Confirms phase scope and priorities
- Makes product/design decisions
- Reviews progress at phase checkpoints
- Tests user flows manually
- Final go/no-go on deploys

### Frank (Project Manager / Orchestrator)
- Breaks phases into granular tasks (30-60 min each)
- Creates GitHub Issues and manages the project board
- Spawns and manages Claude Code coding agents
- Triggers Codex PR reviews
- Decides when QA is needed after merge
- Creates bug tasks from QA findings
- Communicates progress to Henry (batched every 2-3 hours)
- Acts as scope cop — vetoes non-critical features

### Claude Code Agents (Developers)
- Implement tasks based on issue descriptions
- Include implementation notes/spec in the PR description
- Submit PRs with `Fixes #<issue>` to auto-link
- Address review comments and iterate until approved

### Codex Agent (Code Reviewer)
- Reviews PRs against the implementation spec
- Checks for bugs, security issues, best practices
- Approves or requests changes with specific comments
- Coding agents iterate on feedback until approved

## Task Lifecycle

```
1. Frank creates GitHub Issue (task description, acceptance criteria)
           ↓
2. Frank assigns Claude Code agent to the task
           ↓
3. Agent implements on a feature branch
           ↓
4. Agent submits PR with implementation notes + `Fixes #<issue>`
           ↓
5. Codex reviews PR → approves or comments
           ↓
6. If comments: agent addresses feedback, pushes updates, Codex re-reviews
           ↓
7. PR approved → merged to main
           ↓
8. Frank decides: QA needed?
   - YES → Browser QA, create bug tasks if issues found
   - NO → Mark task done
           ↓
9. Frank checks dependency graph → spawns next available tasks
```

## Two-Tier Task System

Not every task needs the full review cycle:

### Large Tasks (full cycle)
- New features, complex logic, AI integration
- Spec/implementation notes in PR description
- Full Codex review required

### Small Tasks (lightweight)
- Styling tweaks, config changes, bug fixes
- Implement directly, PR with brief description
- Codex review only (no spec needed)

Frank decides which tier each task gets when creating it.

## Task Management

### GitHub Issues + Projects Board
- **Single source of truth** for task status
- Kanban columns: `Queued → In Progress → PR Review → Merged → QA → Done`
- Labels: `phase-1`, `phase-2`, `feature`, `bug`, `blocked`, `small-task`
- PRs auto-close issues via `Fixes #<number>` in PR body
- Henry can check progress anytime on the GitHub Projects board

### Frank's Local State
- `memory/projects/booey/state.md` — active agents, pipeline status, recent updates
- `memory/projects/booey/dependencies.json` — task dependency graph for parallelization

### Progress Communication
- **Batched updates:** Every 2-3 hours or at phase milestones via Telegram
- **Immediate alerts:** Only for blockers that need Henry's input
- **Phase checkpoints:** Structured sync at end of each phase (what's done, what's next, any issues)

## Git Workflow

- **Main branch:** `main` — always deployable
- **Feature branches:** `phase-X/task-description` per task
- **PRs merge to main** (no integration branches for MVP)
- **Vercel auto-deploys** on every push to main (preview deploys on PRs)
- **Commit convention:** `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`

## Quality Gates

1. **TypeScript strict mode** — catches type errors before runtime
2. **Build validation** — `npm run build` must pass before PR merge
3. **Codex review** — catches bugs, security issues, anti-patterns
4. **QA (Frank's discretion)** — browser testing for user-facing flows
5. **Pre-deploy security check** — 15-min checklist before production deploy

## Scope Creep Defense

Every feature idea gets one question: **"Does this block the core demo?"**

- **YES:** Build it now
- **NO:** Add to v2 backlog in `docs/BACKLOG.md`
- **MAYBE:** Can it be done in 15 minutes? If not, defer.

Frank has veto power on non-critical additions.

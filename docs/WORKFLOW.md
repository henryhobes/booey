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

### Coding Agents (Developers)
- Implement tasks based on specs
- Self-review before opening PR
- Address review feedback and iterate

### Review Agents (Code Reviewers)
- Review PRs against conventions and architecture
- Check for bugs, security issues, anti-patterns
- Approve or request changes with specific, actionable comments

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
5. Agent opens PR with implementation notes + `Fixes #<issue>` (if applicable)
           ↓
6. Agent-to-agent review loop begins (see below)
           ↓
7. All reviewers satisfied → Frank merges to main
           ↓
8. Vercel auto-deploys. Frank QAs if user-facing change.
           ↓
9. Frank checks dependency graph → spawns next tasks
```

## Agent-to-Agent Review Loop

Inspired by OpenAI's "Ralph Wiggum Loop" — agents review each other until all are satisfied, minimizing human review burden.

### How It Works

1. **Self-Review (mandatory):** Before opening PR, the coding agent:
   - Re-reads its own diff (`git diff main...HEAD`)
   - Checks against `docs/CONVENTIONS.md` (import boundaries, naming, patterns)
   - Verifies `npm run build` and `npm run lint` pass
   - Writes a self-review summary in the PR description

2. **Peer Agent Review:** Frank spawns a review agent (Codex or Claude Code) with:
   ```
   Review PR #X on branch <branch> against main.
   Read docs/CONVENTIONS.md and docs/ARCHITECTURE.md first.
   Check: TypeScript correctness, import boundaries, accessibility,
   responsive design, error handling, security, code quality.
   Give specific, actionable feedback. Approve or request changes.
   ```

3. **Iteration Loop:** If reviewer requests changes:
   - Coding agent addresses each comment
   - Pushes fixes
   - Reviewer re-reviews
   - Loop until reviewer approves (max 3 cycles)

4. **Frank's Role:** Reviews architecture-level decisions only. Does NOT review individual code lines unless flagged by agents.

### When Frank Reviews Directly
- New architectural patterns or abstractions
- Security-sensitive changes (auth, API, data access)
- Changes to CLAUDE.md, docs/CONVENTIONS.md, or linter rules
- When agents disagree (tie-breaker)

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

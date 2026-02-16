# Task 0010: PR Lifecycle Auto-Merge Workflow

## Goal
Auto-merge agent-authored PRs when CI passes AND Claude Code review is clean. Closes the autonomous dev loop.

## Implementation
The research agent already created the workflow at `.github/workflows/pr-lifecycle.yml`. It needs:

1. **Minor fix**: The review check's `✅` detection is too broad. Change the approval check to look for the string `APPROVED` (not just any `✅` emoji).

2. **Add `agent-authored` label to repo**: The workflow requires this label. Create it.

3. **Update sub-agent instructions**: All future agent-spawned PRs should include `--label agent-authored` in the `gh pr create` command.

## Files
- `.github/workflows/pr-lifecycle.yml` (already drafted by research agent, needs refinement)
- Task spec docs

## Safety gates (all implemented in workflow)
- `agent-authored` label required
- `needs-human` label blocks merge
- >7 commits → auto-escalates with `needs-human`
- Sensitive files (auth, middleware, supabase, migrations, .env, workflows) → blocks merge
- All 4 CI checks must pass (lint, typecheck, build, test)
- Claude review must contain `APPROVED` with zero CRITICAL/WARNING markers

# Task 0012: Tighten workflow triggers to avoid unnecessary runs on main

## Problem
When a PR merges to main, check_suite/push events trigger PR Lifecycle, Claude Code Review, and CI on main. PR Lifecycle and Review exit early (no open PR) but waste Actions minutes.

## Fix

### pr-lifecycle.yml
The `check_suite` trigger fires on main pushes. Add an early filter: only run when the check_suite is for a non-main branch (PR branches).

In the `auto-merge` job, change the existing (no condition) to:
```yaml
  auto-merge:
    # Skip if this is a push to main (no PR to merge)
    if: github.event.check_suite.head_branch != github.event.repository.default_branch || github.event_name != 'check_suite'
    runs-on: ubuntu-latest
```

Actually simpler: in the "Resolve PR number" step, the check_suite path already exits if no open PR is found. The issue is it still spins up a runner. Better approach: add a condition at the job level.

For `check_suite` events, filter out the default branch:
```yaml
  auto-merge:
    if: >
      github.event_name != 'check_suite' || 
      github.event.check_suite.head_branch != 'main'
    runs-on: ubuntu-latest
```

### claude-review.yml  
Already has `paths-ignore` for markdown and `pull_request` trigger (not push). The `skipped` runs are from the `issue_comment` and `pull_request_review_comment` triggers matching merge-related comments. These are already handled by the `if` condition on the job — they show as "skipped" which costs nothing.

No change needed for claude-review.yml.

### ci.yml
CI running on main pushes is actually fine — it validates that main is green after merge. No change needed.

## Files
- `.github/workflows/pr-lifecycle.yml` — add job-level condition

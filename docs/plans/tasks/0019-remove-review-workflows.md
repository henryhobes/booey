# Task 0019: Remove GitHub Actions Review Workflows

## Summary
Delete the 3 GitHub Actions workflows that handled PR reviews and auto-merge. These are being replaced by Frank's local orchestration using Claude Max subscription.

## Changes

### Delete these files:
1. `.github/workflows/claude-review.yml` — Claude Code Action PR review (replaced by local review agent)
2. `.github/workflows/pr-lifecycle.yml` — Auto-merge orchestration (replaced by Frank)
3. `.github/workflows/ci-auto-retry.yml` — CI error commenting + @claude retry (Frank reads CI logs directly)

### Keep:
- `.github/workflows/ci.yml` — Still needed for lint/typecheck/build/test

### Update:
- `CLAUDE.md` — Remove references to deleted workflows if any exist
- `AGENTS.md` — Remove references to Claude Code Action review process if any

## Notes
- The `agent-authored` label can stay (still useful as a signal)
- The `agent-approved` label is no longer needed but harmless to keep
- CI workflow is unchanged

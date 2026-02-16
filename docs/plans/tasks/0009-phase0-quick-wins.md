# Task 0009: Phase 0 — Dev Workflow Quick Wins

Three changes to reduce manual PR intervention by ~80%.

## Change 1: Add pre-commit validation to CLAUDE.md

In `CLAUDE.md`, update the "Workflow Summary" section. After step 3, make it crystal clear that agents MUST run validation before pushing. Update step 3 to:

```
3. Implement → self-review → run ALL checks before committing:
   ```bash
   npm run lint && npm run typecheck && npm run build && npm test
   ```
   Fix ALL errors before pushing. Do NOT push code that fails any check.
```

Also add a new section right after "## Quick Start":

```markdown
## Pre-Push Checklist (MANDATORY)

Before pushing ANY code, run all checks:

```bash
npm run lint && npm run typecheck && npm run build && npm test
```

Do NOT push code that fails any of these. Fix errors locally first. This prevents CI failures and wasted review cycles.
```

## Change 2: CI auto-retry workflow

Create `.github/workflows/ci-auto-retry.yml`:

```yaml
name: CI Auto-Retry

on:
  check_suite:
    types: [completed]

permissions:
  contents: read
  pull-requests: write
  actions: read

jobs:
  auto-retry:
    # Only run when CI fails on bot-authored PRs
    if: >
      github.event.check_suite.conclusion == 'failure' &&
      github.event.check_suite.app.slug == 'github-actions'
    runs-on: ubuntu-latest
    steps:
      - name: Find associated PR
        id: pr
        uses: actions/github-script@v7
        with:
          script: |
            const prs = await github.rest.pulls.list({
              owner: context.repo.owner,
              repo: context.repo.repo,
              head: `${context.repo.owner}:${context.payload.check_suite.head_branch}`,
              state: 'open'
            });
            if (prs.data.length === 0) return;
            const pr = prs.data[0];
            // Only act on bot-authored PRs (from our coding agents)
            const botIndicators = ['[bot]', 'github-actions'];
            const isBot = botIndicators.some(b => pr.user.login.includes(b));
            // Also check if PR was created by our agent workflow (title prefixes)
            const isAgentPR = pr.title.startsWith('fix:') || pr.title.startsWith('feat:') || pr.title.startsWith('refactor:');
            if (!isBot && !isAgentPR) return;
            core.setOutput('number', pr.number);
            core.setOutput('found', 'true');

      - name: Get failed job logs
        if: steps.pr.outputs.found == 'true'
        id: logs
        uses: actions/github-script@v7
        with:
          script: |
            const jobs = await github.rest.actions.listJobsForWorkflowRun({
              owner: context.repo.owner,
              repo: context.repo.repo,
              run_id: context.payload.check_suite.check_runs_url ? 
                context.payload.check_suite.id : context.payload.check_suite.id,
              filter: 'latest'
            });
            const failedJobs = jobs.data.jobs.filter(j => j.conclusion === 'failure');
            if (failedJobs.length === 0) return;
            
            let errorSummary = '## CI Failed — Please Fix\n\nThe following CI checks failed:\n\n';
            for (const job of failedJobs) {
              errorSummary += `### ❌ ${job.name}\n`;
              // Get log for this job
              try {
                const log = await github.rest.actions.downloadJobLogsForWorkflowRun({
                  owner: context.repo.owner,
                  repo: context.repo.repo,
                  job_id: job.id
                });
                // Extract last 50 lines (most relevant error info)
                const lines = log.data.split('\n');
                const tail = lines.slice(-50).join('\n');
                errorSummary += `\`\`\`\n${tail}\n\`\`\`\n\n`;
              } catch (e) {
                errorSummary += `Could not retrieve logs.\n\n`;
              }
            }
            errorSummary += '\n@claude Please fix these CI failures. Read the error messages above, identify the issues, and push a fix commit.';
            core.setOutput('comment', errorSummary);

      - name: Comment on PR
        if: steps.pr.outputs.found == 'true' && steps.logs.outputs.comment
        uses: actions/github-script@v7
        with:
          script: |
            await github.rest.issues.createComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: ${{ steps.pr.outputs.number }},
              body: `${{ steps.logs.outputs.comment }}`
            });

```

## Change 3: Fix review concurrency

In `.github/workflows/claude-review.yml`, change:

```yaml
concurrency:
  group: claude-review-${{ github.event.pull_request.number || github.event.issue.number }}
  cancel-in-progress: true
```

To:

```yaml
concurrency:
  group: claude-review-${{ github.event.pull_request.number || github.event.issue.number }}
  cancel-in-progress: false
```

This prevents new PRs from cancelling in-progress reviews on other PRs (they have different group keys). And for the SAME PR, `false` means a new push will queue behind the current review instead of cancelling it. This is what we want — the review finishes, then the new push triggers a fresh one.

## Files to modify
- `CLAUDE.md`
- `.github/workflows/ci-auto-retry.yml` (new file)
- `.github/workflows/claude-review.yml`

## Testing
- Open a PR with a deliberate lint error → CI should fail → auto-retry workflow should comment → Claude Code Action should respond and fix
- Open two PRs simultaneously → both should get reviews (no cancellation)

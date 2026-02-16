# Task 0017: Fix remaining review warnings + CRITICALs always block

## Fix 1: PR title injection in Telegram curl (from PR #52 review)
In the "Notify via Telegram" step, the PR title is interpolated into a shell variable and passed to curl. A crafted title could break the command.

Fix: Use `gh pr view` with `--json` and pipe to jq, then use proper quoting. Or better: move the whole notification to a github-script step that uses the GitHub API env vars.

Simplest fix: quote the variable and use `--data-urlencode`:
```yaml
      - name: Notify via Telegram
        if: steps.review.outputs.passed == 'true'
        env:
          TELEGRAM_BOT_TOKEN: ${{ secrets.TELEGRAM_BOT_TOKEN }}
          TELEGRAM_CHAT_ID: ${{ secrets.TELEGRAM_CHAT_ID }}
          PR_NUMBER: ${{ steps.pr.outputs.number }}
          PR_TITLE: ${{ steps.pr.outputs.head_ref }}
        run: |
          TITLE=$(gh pr view "${PR_NUMBER}" --json title --jq .title 2>/dev/null || echo "PR #${PR_NUMBER}")
          curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
            --data-urlencode "chat_id=${TELEGRAM_CHAT_ID}" \
            --data-urlencode "text=🤖 Auto-merged PR #${PR_NUMBER}: ${TITLE}" \
            || true
```
Using `--data-urlencode` properly escapes the title.

## Fix 2: steps.pr.outputs.number in shell blocks (from PR #57 review)
The merge step and telegram step still use `${{ steps.pr.outputs.number }}` directly in shell. Move to env var:

```yaml
        env:
          PR_NUMBER: ${{ steps.pr.outputs.number }}
        run: |
          echo "🚀 Auto-merging PR #${PR_NUMBER}"
          gh pr merge "${PR_NUMBER}" --squash --auto --delete-branch
          # fallback...
```

## Fix 3: Fix-request 🔄 triggers false positive in-progress detection (from PR #54 review)
The "Check review status" step checks for `🔄` as an in-progress signal. But the fix-request comment also contains `🔄`. 

Fix: Only check for in-progress markers in the REVIEW comment (which we already isolated as `reviewComment`), not in fix-request comments. The current logic already only checks `body` which is `reviewComment.body`, so this might already be fine. But to be safe, also check that the comment does NOT contain `<!-- pr-lifecycle-fix-request -->` before treating `🔄` as in-progress.

## Fix 4: CRITICALs always block + require needs-human
Change the review check logic: if `🚨 CRITICAL` is found in the review, ALWAYS add `needs-human` label and never auto-merge, regardless of fix attempts.

```javascript
if (criticalCount > 0) {
  // CRITICALs ALWAYS block — add needs-human label
  await github.rest.issues.addLabels({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: prNumber,
    labels: ['needs-human']
  });
  await github.rest.issues.createComment({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: prNumber,
    body: `🚨 **Auto-merge blocked**: Review found ${criticalCount} CRITICAL issue(s). A human must review and merge manually.`
  });
  core.info('CRITICAL issues found — requires human review');
  return;
}
```

The unlimited fix loop only applies to WARNINGs now. CRITICALs = always needs-human.

## Files
- `.github/workflows/pr-lifecycle.yml`

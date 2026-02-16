# Task 0013: Add review fix loop to pr-lifecycle

## Goal
When Claude's review has warnings or criticals, pr-lifecycle should comment `@claude` asking it to address the issues. If Claude pushes a fix, the new push triggers a re-review, and the loop continues. If Claude doesn't push (decides the issues don't need fixing), merge anyway (CI already passed).

## Design

In pr-lifecycle.yml, modify the review check step. Currently it returns early if warnings/criticals are found. Instead:

1. If review has CRITICAL or WARNING markers:
   - Check if we already asked Claude to fix (look for a previous `<!-- pr-lifecycle-fix-request -->` comment)
   - If we haven't asked yet: post a comment asking `@claude` to address the review issues
   - If we HAVE already asked and the review still has warnings: Claude chose not to fix them → merge anyway (it's a judgment call, not a blocker)
2. If review is clean (APPROVED, no warnings/criticals): merge as before

This means:
- First time warnings detected → ask Claude to fix
- Claude pushes fix → new review triggered → pr-lifecycle runs again
- If new review is clean → merge
- If new review still has warnings → we've already asked once → merge anyway
- If Claude doesn't push (no new commits after our ask) → next time pr-lifecycle triggers (e.g., via comment event), it sees we already asked → merge anyway

## Implementation

In the "Check review status" step, replace the warning/critical blocking logic with:

```javascript
// If warnings or criticals found, check if we already requested a fix
const WARNING_COUNT = (body.match(/⚠️ WARNING/g) || []).length;
const CRITICAL_COUNT = (body.match(/CRITICAL/g) || []).length;

if (WARNING_COUNT > 0 || CRITICAL_COUNT > 0) {
  // Check if we already posted a fix request
  const allComments = await github.rest.issues.listComments({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: prNumber,
    per_page: 100
  });
  
  const alreadyRequested = allComments.data.some(c => 
    c.body && c.body.includes('<!-- pr-lifecycle-fix-request -->')
  );
  
  if (!alreadyRequested) {
    // First time seeing issues — ask Claude to fix
    core.setOutput('needs_fix', 'true');
    core.setOutput('fix_summary', `Found ${CRITICAL_COUNT} critical and ${WARNING_COUNT} warning issues.`);
    return;
  }
  
  // Already asked once — Claude either fixed what it could or disagreed. Merge anyway.
  core.info('Already requested fixes once. Merging despite remaining warnings.');
  core.setOutput('passed', 'true');
  return;
}
```

Then add a new step after "Check review status" and before "Checkout":

```yaml
- name: Request review fixes from Claude
  if: steps.review.outputs.needs_fix == 'true'
  uses: actions/github-script@v7
  with:
    script: |
      await github.rest.issues.createComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: ${{ steps.pr.outputs.number }},
        body: [
          '<!-- pr-lifecycle-fix-request -->',
          '🔄 **Review has issues** — ${{ steps.review.outputs.fix_summary }}',
          '',
          '@claude Please address the CRITICAL and WARNING items from the review above. If you believe any are false positives, you can skip them — the PR will be merged on the next cycle.',
        ].join('\n')
      });
```

## Files
- `.github/workflows/pr-lifecycle.yml`

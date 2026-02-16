# Task 0014: Unlimited review fix loop (bounded by commit limit)

## Change
Replace the "ask once then merge" logic with "keep asking until Claude stops pushing or hits commit limit".

## Logic

In the review status check, when warnings/criticals are found:

1. Find the MOST RECENT `<!-- pr-lifecycle-fix-request -->` comment
2. Find the MOST RECENT commit on the PR
3. Compare timestamps:
   - If latest commit is NEWER than latest fix request → Claude pushed a fix, but review still has issues → ask again
   - If latest commit is OLDER than latest fix request → Claude was asked but didn't push → merge anyway (nothing to fix)
4. If no fix request exists yet → first time, ask for fix

The 7-commit safety limit in the earlier step still catches runaway loops.

## Implementation

Replace the `if (criticalCount > 0 || warningCount > 0)` block in the "Check review status" step with:

```javascript
if (criticalCount > 0 || warningCount > 0) {
  const allComments = await github.rest.issues.listComments({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: prNumber,
    per_page: 100
  });

  // Find the most recent fix request comment
  const fixRequests = allComments.data.filter(c =>
    c.body && c.body.includes('<!-- pr-lifecycle-fix-request -->')
  );
  
  if (fixRequests.length === 0) {
    // Never asked — request fix
    core.info(`Found ${criticalCount} critical and ${warningCount} warning issues. Requesting fixes.`);
    core.setOutput('needs_fix', 'true');
    core.setOutput('fix_summary', `Found ${criticalCount} critical and ${warningCount} warning issues.`);
    return;
  }

  // We've asked before. Did Claude push new commits since?
  const lastFixRequest = fixRequests[fixRequests.length - 1];
  const lastFixRequestTime = new Date(lastFixRequest.created_at);

  const commits = await github.rest.pulls.listCommits({
    owner: context.repo.owner,
    repo: context.repo.repo,
    pull_number: prNumber,
    per_page: 100
  });
  const lastCommit = commits.data[commits.data.length - 1];
  const lastCommitTime = new Date(lastCommit.commit.committer.date);

  if (lastCommitTime > lastFixRequestTime) {
    // Claude pushed after our request, but review still has issues — ask again
    core.info(`Claude pushed after fix request but review still has ${criticalCount} critical and ${warningCount} warning. Requesting another round.`);
    core.setOutput('needs_fix', 'true');
    core.setOutput('fix_summary', `Still ${criticalCount} critical and ${warningCount} warning after fix attempt.`);
    return;
  }

  // Claude didn't push after our last request — nothing more to fix. Merge.
  core.info('Claude did not push new commits after fix request. Merging with remaining warnings.');
  core.setOutput('passed', 'true');
  core.setOutput('comment_id', reviewComment.id);
  return;
}
```

## Files
- `.github/workflows/pr-lifecycle.yml`

## Safety
- 7-commit limit still enforced in the safety step (runs before review check)
- Each fix request is a new `@claude` comment, so the loop is visible in PR timeline
- If Claude keeps pushing but can never satisfy the reviewer, commits accumulate → 7-commit limit → needs-human escalation

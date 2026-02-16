# Task 0015: Use agent-approved label as merge signal

## Change
Replace timestamp-based "did Claude push?" logic with an explicit `agent-approved` label.

## How it works

1. pr-lifecycle "Check review status" step: when review contains APPROVED with no warnings/criticals → add `agent-approved` label to PR
2. pr-lifecycle triggers on `pull_request: [labeled]` (already does) → sees `agent-approved` + `agent-authored` → merge
3. When review has issues → ask @claude to fix (same as now, no label added)
4. When Claude is asked to fix and the next review comes back clean → add label → merge
5. When Claude doesn't push (nothing to fix) → the review hasn't changed, so pr-lifecycle won't re-trigger. BUT we need a way to detect this.

Actually, the simpler approach: keep the current flow but add the label as a visible artifact when merging. The timestamp logic works for detection; the label is just for visibility.

## Revised approach

Keep the timestamp-based detection (it works), but:
1. When pr-lifecycle decides to merge (either clean review or Claude didn't push) → add `agent-approved` label before merging
2. Create the `agent-approved` label in the repo
3. This makes the merge decision visible in the PR timeline

## Implementation

### Create label
`gh label create "agent-approved" --description "Review approved by AI - ready for auto-merge" --color "0e8a16"`

### In pr-lifecycle.yml
Add a step before "Squash merge PR" that adds the label:

```yaml
      - name: Add agent-approved label
        if: steps.review.outputs.passed == 'true'
        uses: actions/github-script@v7
        with:
          script: |
            await github.rest.issues.addLabels({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: ${{ steps.pr.outputs.number }},
              labels: ['agent-approved']
            });
```

## Files
- `.github/workflows/pr-lifecycle.yml`

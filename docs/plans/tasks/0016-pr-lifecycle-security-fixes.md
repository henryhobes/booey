# Task 0016: Fix pr-lifecycle security issues from Claude review

## CRITICAL: Script injection vulnerabilities

GitHub Actions `${{ }}` expressions are interpolated BEFORE the script runs. If an attacker controls the value (e.g., PR labels, branch names), they can inject arbitrary JavaScript.

### Fix pattern
Instead of:
```javascript
const labels = JSON.parse('${{ steps.pr.outputs.labels }}');
```

Use environment variables:
```yaml
env:
  PR_LABELS: ${{ steps.pr.outputs.labels }}
  PR_NUMBER: ${{ steps.pr.outputs.number }}
  HEAD_SHA: ${{ steps.pr.outputs.head_sha }}
```
```javascript
const labels = JSON.parse(process.env.PR_LABELS);
const prNumber = parseInt(process.env.PR_NUMBER, 10);
const headSha = process.env.HEAD_SHA;
```

Apply this pattern to ALL `${{ steps.*.outputs.* }}` usage inside `actions/github-script` blocks throughout pr-lifecycle.yml.

## WARNINGS to fix

1. **Contradictory comment**: Header says "not --auto" but code uses --auto. Update the comment to match reality.
2. **Broad APPROVED match**: Change `body.includes('APPROVED')` to `body.includes('✅ APPROVED')` to avoid false positives.
3. **Broad CRITICAL match**: Change `body.includes('CRITICAL')` to `body.includes('🚨 CRITICAL')`.
4. **Fragile in-progress detection**: Make the review-in-progress check more specific.

## Files
- `.github/workflows/pr-lifecycle.yml`

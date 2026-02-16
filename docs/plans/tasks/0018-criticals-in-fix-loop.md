# Task 0018: Put CRITICALs through fix loop (revert always-block)

## Change
Remove the "CRITICALs always block" logic. CRITICALs should go through the same unlimited fix loop as WARNINGs.

## Implementation

In `.github/workflows/pr-lifecycle.yml`, find and DELETE the entire "CRITICALs ALWAYS require human review" block (the one that adds needs-human label and returns early for criticals).

Then combine criticals and warnings into one check:

```javascript
if (criticalCount > 0 || warningCount > 0) {
  // ... existing fix loop logic (already handles this correctly)
  // Just update the log messages to include criticalCount
}
```

Also update the fix_summary messages to include both counts:
- `Found ${criticalCount} critical and ${warningCount} warning issue(s).`

## Files
- `.github/workflows/pr-lifecycle.yml`

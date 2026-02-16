Create a pull request for the current branch.

Before creating the PR, follow these steps precisely:

## 1. Gather context

Run these in parallel:
- `git status` to check for uncommitted changes
- `git log --oneline main..HEAD` to see all commits on this branch
- `git diff main...HEAD --stat` to see all changed files
- `git diff main...HEAD` to see the full diff
- `git branch --show-current` to get the branch name
- `gh repo view --json nameWithOwner --jq '.nameWithOwner'` to get the repo

If there are uncommitted changes, commit them first with an appropriate message before proceeding.

## 2. Push the branch

Push the current branch to origin with `-u` to set upstream tracking:
```
git push -u origin <branch-name>
```

## 3. Write the PR description

Analyze all the commits and changes, then write the PR using this exact template. Every section is required. Short answers are valid — the point is to capture what's non-obvious, not to be verbose.

```
gh pr create --title "<short title under 70 chars>" --body "$(cat <<'EOF'
## Summary

<1-3 bullet points describing what this PR does>

## What's non-obvious here?

<Why wasn't the straightforward approach good enough? If it was, say so — a short answer is a valid answer. But if you hit something unexpected, this is where it goes. What would surprise someone reading the diff?>

## What alternatives were considered?

<The dead ends, the approaches that looked right but broke something, the tradeoff that drove the final decision. This is the stuff that's impossible to reconstruct from the diff and most expensive to re-learn. If no meaningful alternatives were considered, say "None — straightforward implementation.">

## What should the next session know?

<Written for the future LLM, not the PR approver. Examples: "This module's tests are order-dependent." "The API doesn't actually validate X despite what the docs say." "Don't try caching this — causes race conditions in the settlement flow." Forward-looking, practical, durable. If nothing, say "Nothing specific.">

---

🤖 Generated with [Claude Code](https://claude.ai/code)
EOF
)"
```

## Important

- Keep the title short and descriptive (under 70 chars), using imperative mood ("Add X", "Fix Y", not "Added X")
- The three learning questions are the most important part. Think carefully about each one. Do not fill them with generic boilerplate.
- If you genuinely have nothing non-obvious to report, say so briefly. Do not fabricate complexity.
- Do not skip any section. Every section must be present in the PR body.
- Use the `gh pr create` command directly. Do not use the GitHub web UI.
- After creating the PR, print the PR URL so the user can see it.

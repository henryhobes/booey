# Task 0011: Telegram notification on PR auto-merge

## Goal
When pr-lifecycle.yml auto-merges an agent PR, send a Telegram message to Henry so he knows it shipped.

## Implementation
Add a step after the merge in `.github/workflows/pr-lifecycle.yml` that calls the Telegram Bot API.

Add two new repo secrets:
- `TELEGRAM_BOT_TOKEN` — the bot token
- `TELEGRAM_CHAT_ID` — Henry's chat ID (5013434616)

Add this step after "Comment merge confirmation":

```yaml
- name: Notify via Telegram
  if: steps.review.outputs.passed == 'true'
  env:
    TELEGRAM_BOT_TOKEN: ${{ secrets.TELEGRAM_BOT_TOKEN }}
    TELEGRAM_CHAT_ID: ${{ secrets.TELEGRAM_CHAT_ID }}
  run: |
    PR_NUMBER=${{ steps.pr.outputs.number }}
    PR_TITLE=$(gh pr view "${PR_NUMBER}" --json title --jq .title 2>/dev/null || echo "PR #${PR_NUMBER}")
    MESSAGE="🤖 Auto-merged PR #${PR_NUMBER}: ${PR_TITLE}"
    curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
      -d chat_id="${TELEGRAM_CHAT_ID}" \
      -d text="${MESSAGE}" \
      -d parse_mode="HTML" || true
```

Note: The `|| true` ensures the workflow doesn't fail if Telegram is unreachable.

## Secrets needed
Henry needs to add these to the repo:
- Settings → Secrets → Actions → New repository secret
- `TELEGRAM_BOT_TOKEN`: Get from OpenClaw config or @BotFather
- `TELEGRAM_CHAT_ID`: 5013434616

## Files
- `.github/workflows/pr-lifecycle.yml`

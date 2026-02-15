#!/usr/bin/env bash
# wait-for-pr-approval.sh — Poll CI + Codex review until PR is approved
#
# Usage: ./scripts/wait-for-pr-approval.sh <pr-number>
#
# Behavior:
#   1. Polls every 30s for CI status and Codex review
#   2. If CI fails → prints failed job logs for agent to fix
#   3. If Codex posts feedback → prints comments for agent to evaluate
#   4. Exits 0 when: CI passes AND Codex approves (or no actionable feedback after 3 cycles)
#   5. Exits 1 on timeout (10 min per cycle, max 3 cycles)
#
# Environment:
#   POLL_INTERVAL  — seconds between polls (default: 30)
#   CYCLE_TIMEOUT  — seconds before giving up on one cycle (default: 600)
#   MAX_CYCLES     — max fix-and-re-review cycles (default: 3)

set -euo pipefail

PR_NUMBER="${1:?Usage: wait-for-pr-approval.sh <pr-number>}"
POLL_INTERVAL="${POLL_INTERVAL:-30}"
CYCLE_TIMEOUT="${CYCLE_TIMEOUT:-600}"
MAX_CYCLES="${MAX_CYCLES:-3}"

log() { echo "[pr-approval] $(date '+%H:%M:%S') $*"; }

# ── Wait for CI to pass ──────────────────────────────────────────────
wait_for_ci() {
  local elapsed=0
  log "Waiting for CI checks on PR #${PR_NUMBER}..."

  while (( elapsed < CYCLE_TIMEOUT )); do
    # Get check status
    local checks
    checks=$(gh pr checks "$PR_NUMBER" 2>&1) || true

    # Count statuses
    local pending failing passing
    pending=$(echo "$checks" | grep -c "pending\|queued\|in_progress" || true)
    failing=$(echo "$checks" | grep -c "fail" || true)
    passing=$(echo "$checks" | grep -c "pass" || true)

    if (( failing > 0 )); then
      log "CI FAILED ($failing job(s)). Getting failed logs..."
      # Get the failed run IDs
      gh pr checks "$PR_NUMBER" --json name,state,detailsUrl 2>/dev/null | \
        jq -r '.[] | select(.state == "FAILURE") | "\(.name): \(.detailsUrl)"'

      # Get the most recent failed run log
      local run_id
      run_id=$(gh run list --branch "$(gh pr view "$PR_NUMBER" --json headRefName -q .headRefName)" \
        --status failure --limit 1 --json databaseId -q '.[0].databaseId' 2>/dev/null || echo "")
      if [[ -n "$run_id" ]]; then
        log "Failed run logs:"
        gh run view "$run_id" --log-failed 2>/dev/null | tail -50
      fi
      return 1
    fi

    if (( pending == 0 && passing > 0 )); then
      log "CI PASSED ($passing check(s))"
      return 0
    fi

    log "CI pending ($pending pending, $passing passing)... waiting ${POLL_INTERVAL}s"
    sleep "$POLL_INTERVAL"
    elapsed=$((elapsed + POLL_INTERVAL))
  done

  log "CI TIMEOUT after ${CYCLE_TIMEOUT}s"
  return 1
}

# ── Wait for Codex review ────────────────────────────────────────────
wait_for_codex_review() {
  local elapsed=0
  local last_review_count="${1:-0}"
  log "Waiting for Codex review on PR #${PR_NUMBER}..."

  while (( elapsed < CYCLE_TIMEOUT )); do
    # Check for reviews from codex bot
    local reviews
    reviews=$(gh pr view "$PR_NUMBER" --json reviews \
      --jq '[.reviews[] | select(.author.login == "codex-bot" or .author.login == "openai-codex" or (.body | test("codex|Codex"; "i")))] | length' 2>/dev/null || echo "0")

    if (( reviews > last_review_count )); then
      log "New Codex review detected (total: $reviews)"

      # Get the latest review state
      local state
      state=$(gh pr view "$PR_NUMBER" --json reviews \
        --jq '[.reviews[] | select(.author.login == "codex-bot" or .author.login == "openai-codex" or (.body | test("codex|Codex"; "i")))] | last | .state' 2>/dev/null || echo "UNKNOWN")

      log "Review state: $state"

      # Print review comments
      log "Review content:"
      gh pr view "$PR_NUMBER" --json reviews \
        --jq '[.reviews[] | select(.author.login == "codex-bot" or .author.login == "openai-codex" or (.body | test("codex|Codex"; "i")))] | last | .body' 2>/dev/null || true

      # Print inline comments
      gh pr view "$PR_NUMBER" --json reviewThreads \
        --jq '.reviewThreads[] | select(.comments[0].author.login == "codex-bot" or .comments[0].author.login == "openai-codex") | "[\(.path):\(.line)] \(.comments[0].body)"' 2>/dev/null || true

      if [[ "$state" == "APPROVED" ]]; then
        log "APPROVED by Codex"
        return 0
      else
        log "Changes requested by Codex — agent should evaluate and address"
        return 2  # Special exit code: review posted but not approved
      fi
    fi

    # Also check PR comments (Codex sometimes posts as a comment, not a review)
    local comments
    comments=$(gh pr view "$PR_NUMBER" --json comments \
      --jq '[.comments[] | select(.author.login == "codex-bot" or .author.login == "openai-codex" or (.body | test("Codex Review|codex review"; "i")))] | length' 2>/dev/null || echo "0")

    if (( comments > last_review_count )); then
      log "Codex comment detected"
      gh pr view "$PR_NUMBER" --json comments \
        --jq '[.comments[] | select(.author.login == "codex-bot" or .author.login == "openai-codex" or (.body | test("Codex Review|codex review"; "i")))] | last | .body' 2>/dev/null || true
      # Comments don't have APPROVED/CHANGES_REQUESTED state — treat as feedback
      return 2
    fi

    log "No Codex review yet... waiting ${POLL_INTERVAL}s"
    sleep "$POLL_INTERVAL"
    elapsed=$((elapsed + POLL_INTERVAL))
  done

  log "REVIEW TIMEOUT after ${CYCLE_TIMEOUT}s — Codex may not be configured for this repo"
  return 1
}

# ── Main loop ────────────────────────────────────────────────────────
main() {
  local cycle=0

  while (( cycle < MAX_CYCLES )); do
    cycle=$((cycle + 1))
    log "=== Cycle ${cycle}/${MAX_CYCLES} ==="

    # Step 1: Wait for CI
    if ! wait_for_ci; then
      log "CI failed — fix errors and push, then re-run this script"
      echo "ACTION_NEEDED=ci_fix" 
      exit 1
    fi

    # Step 2: Wait for Codex review
    local review_exit=0
    wait_for_codex_review "$((cycle - 1))" || review_exit=$?

    case $review_exit in
      0)
        log "✅ PR #${PR_NUMBER} approved! CI passing + Codex approved."
        echo "ACTION_NEEDED=none"
        exit 0
        ;;
      2)
        log "Codex requested changes (cycle ${cycle}/${MAX_CYCLES})"
        if (( cycle >= MAX_CYCLES )); then
          log "Max cycles reached. Escalating to Frank."
          echo "ACTION_NEEDED=escalate"
          exit 1
        fi
        echo "ACTION_NEEDED=address_feedback"
        # Agent should read the output above, push fixes, then this script continues
        exit 2
        ;;
      *)
        log "Review timeout or error. Escalating."
        echo "ACTION_NEEDED=timeout"
        exit 1
        ;;
    esac
  done
}

main

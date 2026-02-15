#!/bin/bash
# Worktree cleanup script for agents
# Usage: ./scripts/cleanup-worktree.sh <task-name>
#
# Example: ./scripts/cleanup-worktree.sh fix-mobile-nav

set -e

if [ $# -ne 1 ]; then
  echo "Usage: $0 <task-name>"
  echo "Example: $0 fix-mobile-nav"
  exit 1
fi

TASK_NAME=$1
WORKTREE_DIR="/Users/henryhobin/Projects/booey-worktrees/${TASK_NAME}"

echo "🧹 Cleaning up worktree ${TASK_NAME}..."

# Check if worktree exists
if [ ! -d "${WORKTREE_DIR}" ]; then
  echo "⚠️  Worktree not found at ${WORKTREE_DIR}"
  exit 1
fi

# Remove worktree
git worktree remove "${WORKTREE_DIR}" --force

echo "✅ Worktree ${TASK_NAME} removed"

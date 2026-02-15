#!/bin/bash
# Worktree setup script for agents
# Usage: ./scripts/setup-worktree.sh <task-name> <branch-name>
#
# Example: ./scripts/setup-worktree.sh fix-mobile-nav phase-6/fix-mobile-nav

set -e

if [ $# -ne 2 ]; then
  echo "Usage: $0 <task-name> <branch-name>"
  echo "Example: $0 fix-mobile-nav phase-6/fix-mobile-nav"
  exit 1
fi

TASK_NAME=$1
BRANCH_NAME=$2
WORKTREE_DIR="/Users/henryhobin/Projects/booey-worktrees/${TASK_NAME}"

echo "🌳 Creating worktree for ${TASK_NAME}..."

# Check if worktree already exists
if [ -d "${WORKTREE_DIR}" ]; then
  echo "⚠️  Worktree already exists at ${WORKTREE_DIR}"
  echo "Run: ./scripts/cleanup-worktree.sh ${TASK_NAME}"
  exit 1
fi

# Create worktree
git worktree add "${WORKTREE_DIR}" -b "${BRANCH_NAME}"

# Install dependencies
echo "📦 Installing dependencies..."
cd "${WORKTREE_DIR}"
npm install

echo ""
echo "✅ Worktree ready at ${WORKTREE_DIR}"
echo "Next steps:"
echo "  cd ${WORKTREE_DIR}"
echo "  # ... make your changes ..."
echo "  ./scripts/agent-test.sh"

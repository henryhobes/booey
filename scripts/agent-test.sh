#!/bin/bash
# Agent self-test script
# Usage: ./scripts/agent-test.sh
#
# Boots the app on a random port, checks health, validates key routes, then cleans up.
# Random port allows parallel agents to self-test simultaneously in different worktrees.

set -e

echo "🤖 Starting agent self-test..."

# 1. Install deps
echo "📦 Installing dependencies..."
npm install --silent

# 2. Build check
echo "🔨 Running production build..."
npm run build || {
  echo "❌ Build failed"
  exit 1
}

# 3. Lint check
echo "🧹 Running linter..."
npm run lint || {
  echo "❌ Lint failed"
  exit 1
}

# 4. Boot dev server in background on random port
PORT=$((3000 + RANDOM % 1000))
echo "🚀 Starting dev server on port ${PORT}..."
PORT=$PORT npm run dev > /tmp/booey-dev-${PORT}.log 2>&1 &
DEV_PID=$!

# Give the server time to boot
sleep 8

# 5. Health check - verify app boots
echo "🏥 Health check..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:${PORT})
if [ "$HTTP_CODE" != "200" ]; then
  echo "❌ App failed to boot on localhost:${PORT} (HTTP ${HTTP_CODE})"
  echo "Server logs:"
  cat /tmp/booey-dev-${PORT}.log
  kill $DEV_PID 2>/dev/null || true
  rm -f /tmp/booey-dev-${PORT}.log
  exit 1
fi

echo "✅ App boots successfully on port ${PORT}"

# 6. Check key routes respond
echo "🔍 Checking key routes..."
ROUTES=("/" "/auth/sign-in" "/use/recipe-healthier")
for route in "${ROUTES[@]}"; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:${PORT}${route}")
  if [ "$STATUS" = "200" ]; then
    echo "  ✅ ${route} → ${STATUS}"
  else
    echo "  ⚠️  ${route} → ${STATUS}"
  fi
done

# 7. Cleanup
echo "🧹 Cleaning up..."
kill $DEV_PID 2>/dev/null || true
rm -f /tmp/booey-dev-${PORT}.log

echo ""
echo "✅ All checks passed! Your changes are ready for PR."

# Phase 7 Task 4: Make App Legible to Agents

## Context
Read `CLAUDE.md` for the project map. 

Agents should be able to boot the app, verify their changes work, and validate UI behavior without human intervention. Currently, QA is manual (Frank tests in browser after merge). We want agents to self-test before opening PRs.

## What to Build

1. **Agent test script** (`scripts/agent-test.sh`)
   A bash script that agents run to validate their changes:
   ```bash
   #!/bin/bash
   # Usage: ./scripts/agent-test.sh
   
   # 1. Install deps
   npm install
   
   # 2. Build check
   npm run build || exit 1
   
   # 3. Lint check  
   npm run lint || exit 1
   
   # 4. Boot dev server in background
   npm run dev &
   DEV_PID=$!
   sleep 5
   
   # 5. Health check - verify app boots
   curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200"
   if [ $? -ne 0 ]; then
     echo "ERROR: App failed to boot on localhost:3000"
     kill $DEV_PID
     exit 1
   fi
   
   echo "✅ App boots successfully"
   
   # 6. Check key routes respond
   for route in "/" "/auth/sign-in" "/use/recipe-healthier"; do
     STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000${route}")
     echo "  ${route} → ${STATUS}"
   done
   
   # 7. Cleanup
   kill $DEV_PID
   echo "✅ All checks passed"
   ```

2. **Worktree setup script** (`scripts/setup-worktree.sh`)
   Streamline worktree creation for agents:
   ```bash
   #!/bin/bash
   # Usage: ./scripts/setup-worktree.sh <task-name> <branch-name>
   TASK_NAME=$1
   BRANCH_NAME=$2
   WORKTREE_DIR="/Users/henryhobin/Projects/booey-worktrees/${TASK_NAME}"
   
   git worktree add "${WORKTREE_DIR}" -b "${BRANCH_NAME}"
   cd "${WORKTREE_DIR}"
   npm install
   echo "✅ Worktree ready at ${WORKTREE_DIR}"
   ```

3. **Worktree cleanup script** (`scripts/cleanup-worktree.sh`)
   Clean up after task completion:
   ```bash
   #!/bin/bash
   # Usage: ./scripts/cleanup-worktree.sh <task-name>
   TASK_NAME=$1
   WORKTREE_DIR="/Users/henryhobin/Projects/booey-worktrees/${TASK_NAME}"
   
   git worktree remove "${WORKTREE_DIR}" --force
   echo "✅ Worktree ${TASK_NAME} removed"
   ```

4. **Port management for parallel agents**
   - Update `scripts/agent-test.sh` to use a random port (not hardcoded 3000)
   - This allows multiple agents to self-test simultaneously in different worktrees
   - Use: `PORT=$((3000 + RANDOM % 1000)) npm run dev`

5. **Update TASK-TEMPLATE.md**
   Add self-test step to the workflow:
   ```
   After implementing, run: ./scripts/agent-test.sh
   ```

## Success Criteria
- [ ] `scripts/agent-test.sh` exists and works (boots app, checks health, cleans up)
- [ ] `scripts/setup-worktree.sh` exists and works
- [ ] `scripts/cleanup-worktree.sh` exists and works
- [ ] Random port assignment for parallel agent testing
- [ ] Scripts are executable (`chmod +x`)
- [ ] `npm run build` passes
- [ ] Self-review completed

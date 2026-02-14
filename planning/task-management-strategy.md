# Task Management Strategy for AI Orchestrator (Frank)

**Date:** 2026-02-14  
**Context:** Multi-agent software development workflow for weekend Next.js project

---

## Executive Summary

**Recommended Approach:** **GitHub Issues + Local Markdown Hybrid**

- **GitHub Issues + Projects (Kanban)** as the single source of truth for Henry's visibility
- **Local markdown files** for Frank's internal state (agent assignments, pipeline tracking, detailed notes)
- **Setup time:** ~10 minutes
- **Update overhead:** ~30-60 seconds per task transition
- **Henry visibility:** <10 seconds (glance at GitHub Project board)

---

## Research Findings

### 1. GitHub Issues + GitHub Projects (Kanban)

#### Capabilities via `gh` CLI

✅ **Fully supported operations:**
- Create issues with labels, assignees, milestones: `gh issue create --title "..." --label "feature" --assignee "@me"`
- Add issues to projects: `gh project item-add <project-id> --owner <owner> --url <issue-url>`
- Edit project item fields (move between columns): `gh project item-edit --id <item-id> --field-id <status-field-id> --single-select-option-id <column-id>`
- List project items: `gh project item-list <project-id>`
- Link PRs to issues automatically: Include `Fixes #123` or `Closes #123` in PR body

✅ **Automation:**
- GitHub Projects has built-in automation (auto-move on PR merge, issue close, etc.)
- PRs linked via keywords (`Fixes #123`) auto-close issues on merge
- Native integration with GitHub Actions

#### Pros:
- **Single source of truth** - Henry can view progress on GitHub web UI or mobile
- **Professional appearance** - Standard industry tooling
- **Native integrations** - PRs, commits, reviews all linked
- **Persistent** - Survives beyond the weekend if project continues
- **Multi-user** - Easy to add collaborators if needed

#### Cons:
- **API overhead** - Every task update requires API calls (rate limits possible)
- **Field ID lookups** - Moving cards requires knowing project/field/option IDs (can cache these)
- **Network dependency** - Requires internet connection
- **Verbose updates** - More ceremony than editing a local file

---

### 2. Pure Markdown (BUILD.md / TASKS.md)

#### Structure Example:

```markdown
# BUILD.md - Booey Development Pipeline

## Queued
- [ ] #1 Set up Next.js project with TypeScript
- [ ] #2 Design database schema
- [ ] #3 Build authentication system

## In Progress
- [~] #4 Create landing page (Agent: agent-abc123, Started: 2026-02-14 10:30)

## PR Review  
- [PR] #5 User profile component (PR#42, Reviewer: Codex-1)

## Merged
- [x] #6 Project setup (Merged: 2026-02-14 09:15)

## Blocked
- [!] #7 Payment integration (Blocked by: #2 database schema)
```

#### Pros:
- **Instant updates** - No API calls, just file edits
- **Zero setup** - Create file and start working
- **Offline-first** - No network dependency
- **Version controlled** - Git tracks all changes
- **Grep-friendly** - Easy to search and parse

#### Cons:
- **No dashboard** - Henry must open file or get updates via messages
- **Manual maintenance** - Frank must maintain formatting consistency
- **No native PR linking** - Can reference but not auto-link
- **Scales poorly** - Gets messy with >20-30 tasks

---

### 3. GitHub Issues + Local Markdown Hybrid ⭐ **RECOMMENDED**

#### Architecture:

**GitHub Issues/Projects:**
- Official task board (Kanban view)
- Each task = one GitHub Issue
- Project columns: Queued → In Progress → PR Review → Merged → QA → Done
- Labels: `feature`, `bug`, `blocked`, `urgent`
- Henry can view progress instantly on GitHub

**Local Markdown (`memory/projects/booey/state.md`):**
```markdown
# Booey Project State

Last updated: 2026-02-14 14:00 EST

## Active Agents
- agent-abc123: Working on #42 (landing page) - Started 14:15
- agent-def456: Working on #43 (auth system) - Started 14:20

## Pipeline Status
- Queued: 8 tasks
- In Progress: 2 tasks (2 agents active)
- PR Review: 1 task (#41 waiting for Codex)
- Merged: 3 tasks (awaiting QA)
- Done: 0 tasks

## Blocked Tasks
- #44 (payment): Waiting for #39 (database schema)

## Recent Updates
- 14:15: Started #42, spawned agent-abc123
- 14:10: #41 moved to PR Review, assigned Codex-1
- 14:05: #40 merged via PR#39
```

**Dependency Graph (`memory/projects/booey/dependencies.json`):**
```json
{
  "tasks": {
    "1": {"id": 1, "title": "Project setup", "depends_on": [], "status": "done"},
    "2": {"id": 2, "title": "Database schema", "depends_on": [1], "status": "in_progress"},
    "3": {"id": 3, "title": "Auth system", "depends_on": [2], "status": "queued"},
    "4": {"id": 4, "title": "Payment integration", "depends_on": [2], "status": "blocked"}
  }
}
```

#### Workflow:

1. **Frank creates task:**
   ```bash
   gh issue create --title "Build landing page" \
     --body "Create responsive landing page with hero section" \
     --label "feature" \
     --project "Booey Weekend Build"
   ```

2. **Frank updates local state:**
   - Append to `state.md`: Task created, added to queue

3. **Frank assigns work to agent:**
   - Spawn Claude Code CLI agent: `claude -s coding-session-123`
   - Update `state.md`: Add to "Active Agents" section
   - Move GitHub issue to "In Progress" column:
     ```bash
     gh project item-edit --id <item-id> --field-id <status-field> \
       --project-id <project-id> --single-select-option-id <in-progress-id>
     ```

4. **Agent completes work:**
   - Agent creates PR with `Fixes #42` in body
   - Frank moves GitHub issue to "PR Review"
   - Frank updates `state.md`: Remove from active agents, update pipeline status

5. **PR merged (via email notification):**
   - GitHub auto-closes issue (via `Fixes #42`)
   - Frank moves to "QA" column
   - Frank updates `state.md`

#### Pros:
- ✅ Best of both worlds
- ✅ Henry gets instant visibility (GitHub Projects board)
- ✅ Frank has fast local updates (markdown files)
- ✅ Professional appearance
- ✅ Native GitHub integrations
- ✅ Survives network issues (can update markdown offline, sync later)

#### Cons:
- ⚠️ Dual-write risk (GitHub and markdown can drift)
- ⚠️ Moderate complexity (manage both systems)

---

### 4. Other Approaches Considered

#### Linear / Jira / Notion
**Verdict:** ❌ **Too heavy for weekend build**
- Setup time: >30 minutes
- Learning curve for Frank
- Over-engineered for 48-hour project
- API complexity

#### GitHub Actions for Automation
**Verdict:** ⚠️ **Optional enhancement, not core strategy**
- Could auto-notify Frank on PR events
- Could auto-update project boards
- Setup time: ~20-30 minutes per workflow
- **Recommendation:** Start without, add if needed

---

## Task Parallelization Strategy

### Dependency Graph Management

**File:** `memory/projects/booey/dependencies.json`

**Algorithm:**
1. Parse dependency graph on each heartbeat
2. Identify tasks with no unmet dependencies (leaves of the graph)
3. Sort by priority/urgency
4. Spawn agents up to concurrency limit (e.g., 3-4 concurrent agents)
5. Update state when agent claims a task

**Example:**
```
Tasks: [1, 2, 3, 4, 5]
Dependencies:
  2 → 1 (task 2 depends on task 1)
  3 → 1
  4 → 2
  5 → 3

Parallel execution:
  Wave 1: Start task 1
  Wave 2: Start tasks 2, 3 (both depend only on completed task 1)
  Wave 3: Start tasks 4, 5 (depend on completed tasks 2, 3)
```

### Agent Assignment Tracking

**File:** `memory/projects/booey/state.md` (Active Agents section)

Track:
- Agent session ID
- Task number
- Start time
- PID of background process
- Last heartbeat

**Cleanup orphaned agents:**
```bash
# Check if agent process still alive
ps -p <pid> || mark_agent_failed
```

---

## Handling Blocked Tasks

### Detection:
- Dependency not met (graph-based)
- External blocker (API key needed, design not ready)
- Technical blocker (bug in dependency)

### Actions:
1. Move GitHub issue to "Blocked" label
2. Add comment explaining blocker
3. Update `state.md` with blocker reason
4. Notify Henry if blocker requires his action

### Auto-unblock:
- On heartbeat, check if blockers resolved
- Move back to "Queued" when ready

---

## Progress Communication to Henry

### Principles:
- **Proactive, not noisy**
- **Batch updates** (every 2-4 hours, not every task)
- **Highlight blockers** (these need his attention)
- **Celebrate wins** (merged features, milestones)

### Update Cadence:

**Morning kickoff (9 AM):**
```
🏗️ Booey Build - Day 1 Kickoff

Queued: 12 tasks
Starting with: 
  • #1 Project setup
  • #2 Database schema

GitHub board: https://github.com/henry/booey/projects/1
```

**Progress updates (every 3-4 hours or major milestone):**
```
📊 Progress Update

✅ Completed: 
  • #1 Project setup (merged)
  • #2 Database schema (merged)

🚧 In Progress:
  • #3 Auth system (PR in review)
  • #4 Landing page (coding)

⚠️ Blocked:
  • #7 Payment - needs Stripe API key

Next up: #5 User profiles, #6 Settings page
```

**Blockers (immediate notification):**
```
🚨 Blocker Alert

Task #7 (Payment integration) is blocked:
Need: Stripe API key for test environment

Can you provide when convenient?
```

**End of day summary:**
```
🌙 Day 1 Complete

✅ Merged: 5 features
🚧 In progress: 2 features  
📝 Queued: 5 tasks remaining

Tomorrow's priority: Auth system, user profiles

Sleep well! 🚀
```

---

## Recommended Setup (15-minute guide)

### Step 1: Create GitHub Project (5 min)

```bash
# Create project
gh project create --owner henry --title "Booey Weekend Build"

# Note the project ID (output will show: Created project #1)
export PROJECT_ID=1

# Create custom Status field with columns (if not auto-created):
# Queued, In Progress, PR Review, Merged, QA, Done
# (Can be done via web UI faster than CLI)
```

### Step 2: Create local tracking files (3 min)

```bash
mkdir -p ~/Projects/booey/planning
mkdir -p ~/memory/projects/booey

# Create state file
cat > ~/memory/projects/booey/state.md << 'EOF'
# Booey Project State

Last updated: YYYY-MM-DD HH:MM EST

## Active Agents
(none)

## Pipeline Status
- Queued: 0 tasks
- In Progress: 0 tasks
- PR Review: 0 tasks
- Merged: 0 tasks
- Done: 0 tasks

## Blocked Tasks
(none)

## Recent Updates
(none)
EOF

# Create dependency graph
cat > ~/memory/projects/booey/dependencies.json << 'EOF'
{
  "tasks": {}
}
EOF

# Create project config
cat > ~/memory/projects/booey/config.json << 'EOF'
{
  "project_id": "PROJECT_ID_HERE",
  "repo": "henry/booey",
  "max_concurrent_agents": 3,
  "field_ids": {
    "status": "FIELD_ID_HERE"
  },
  "status_option_ids": {
    "queued": "OPTION_ID_HERE",
    "in_progress": "OPTION_ID_HERE",
    "pr_review": "OPTION_ID_HERE",
    "merged": "OPTION_ID_HERE",
    "qa": "OPTION_ID_HERE",
    "done": "OPTION_ID_HERE"
  }
}
EOF
```

### Step 3: Get field/option IDs (5 min)

```bash
# List project fields
gh project field-list $PROJECT_ID --owner henry

# Note the Status field ID

# List field options (via project view or API)
# Update config.json with actual IDs
```

### Step 4: Test workflow (2 min)

```bash
# Create first issue
gh issue create --repo henry/booey \
  --title "Test task" \
  --body "Testing the workflow" \
  --label "test" \
  --project "Booey Weekend Build"

# Move it to In Progress
# (use gh project item-edit with actual IDs)

# Update state.md manually
```

---

## Best Practices for AI Agents Managing GitHub

### 1. **Cache Metadata**
Store project ID, field IDs, option IDs in `config.json` to avoid repeated lookups.

### 2. **Atomic Updates**
Update GitHub first (source of truth), then update local markdown. If GitHub fails, don't update local state.

### 3. **Idempotent Operations**
Check current state before updating (don't move a card that's already in the target column).

### 4. **Error Handling**
```bash
if gh issue create ...; then
  update_local_state
else
  log_error "GitHub API failed, will retry on next heartbeat"
fi
```

### 5. **Rate Limiting**
- GitHub API: 5,000 requests/hour for authenticated users
- For weekend build: ~100 tasks × 5 transitions = 500 requests (well within limits)
- Cache `gh project item-list` output, refresh every 5-10 minutes

### 6. **Structured Commits**
When agents commit code, use conventional commits:
```
feat: add landing page hero section

Implements responsive design for above-fold content.

Fixes #42
```

### 7. **PR Templates**
Create `.github/pull_request_template.md`:
```markdown
## Description
<!-- What does this PR do? -->

## Related Issues
Fixes #

## Testing
- [ ] Tested locally
- [ ] No console errors
- [ ] Responsive on mobile
```

### 8. **Label Strategy**
- `feature`: New functionality
- `bug`: Bug fix
- `blocked`: Waiting on dependency
- `urgent`: High priority
- `review-needed`: Waiting for PR review

---

## Example: Full Task Lifecycle

### Creating a Task

```bash
# Frank receives instruction: "Build user profile page"

# 1. Create GitHub issue
ISSUE_URL=$(gh issue create \
  --repo henry/booey \
  --title "Build user profile page" \
  --body "Create responsive user profile page with avatar, bio, settings link" \
  --label "feature" \
  --project "Booey Weekend Build" \
  --json url -q .url)

ISSUE_NUM=$(echo $ISSUE_URL | grep -oE '[0-9]+$')

# 2. Update dependency graph
# (if it depends on task #2)
jq '.tasks["'$ISSUE_NUM'"] = {
  "id": '$ISSUE_NUM',
  "title": "Build user profile page",
  "depends_on": [2],
  "status": "queued"
}' ~/memory/projects/booey/dependencies.json > /tmp/deps.json
mv /tmp/deps.json ~/memory/projects/booey/dependencies.json

# 3. Update state.md
echo "- $(date '+%H:%M'): Created #$ISSUE_NUM (user profile page), added to queue" \
  >> ~/memory/projects/booey/state.md
```

### Assigning to Agent

```bash
# Check dependencies
jq -r '.tasks["'$ISSUE_NUM'"].depends_on[]' ~/memory/projects/booey/dependencies.json
# Returns: 2
# Check if task #2 is done...
# If yes, proceed:

# 1. Spawn agent
SESSION_ID="agent-profile-$(date +%s)"
claude -s $SESSION_ID --background << 'EOF'
Build user profile page per issue #$ISSUE_NUM in henry/booey repo.
Include: avatar upload, bio edit, settings link.
Create PR when done with "Fixes #$ISSUE_NUM" in description.
EOF

# 2. Move GitHub issue to In Progress
ITEM_ID=$(gh project item-list $PROJECT_ID --owner henry \
  --format json | jq -r '.items[] | select(.content.number=='$ISSUE_NUM') | .id')

gh project item-edit \
  --id $ITEM_ID \
  --project-id $PROJECT_ID \
  --field-id $STATUS_FIELD_ID \
  --single-select-option-id $IN_PROGRESS_OPTION_ID

# 3. Update state.md
# Add to Active Agents section:
# - $SESSION_ID: Working on #$ISSUE_NUM (user profile) - Started $(date '+%H:%M')
```

### PR Created

```bash
# Agent creates PR with "Fixes #$ISSUE_NUM"
# Frank receives notification (via GitHub webhook or email)

# 1. Move GitHub issue to PR Review
gh project item-edit \
  --id $ITEM_ID \
  --project-id $PROJECT_ID \
  --field-id $STATUS_FIELD_ID \
  --single-select-option-id $PR_REVIEW_OPTION_ID

# 2. Update state.md
# Remove from Active Agents
# Add to Recent Updates: "14:30: #$ISSUE_NUM moved to PR Review (PR#45)"

# 3. Assign Codex reviewer (separate workflow)
```

### PR Merged

```bash
# Frank receives email: "PR #45 merged"
# GitHub auto-closes issue #$ISSUE_NUM (via "Fixes #")

# 1. Move to QA column
gh project item-edit \
  --id $ITEM_ID \
  --project-id $PROJECT_ID \
  --field-id $STATUS_FIELD_ID \
  --single-select-option-id $QA_OPTION_ID

# 2. Update dependencies.json
jq '.tasks["'$ISSUE_NUM'"].status = "qa"' \
  ~/memory/projects/booey/dependencies.json > /tmp/deps.json
mv /tmp/deps.json ~/memory/projects/booey/dependencies.json

# 3. Update state.md
# Increment "Merged" count
# Add to Recent Updates

# 4. Check if this unblocks other tasks
# (search for tasks that depend on $ISSUE_NUM)
```

---

## Maintenance Overhead Analysis

### Per-Task Cost (Estimated)

**GitHub-only approach:**
- Create issue: 30s (1 API call)
- Move through 6 columns: 6 × 20s = 120s (6 API calls)
- Total: ~150s = 2.5 minutes per task

**Hybrid approach (recommended):**
- Create issue: 30s (1 API call)
- Move through 6 columns: 6 × 15s = 90s (6 API calls + quick markdown updates)
- Update local state: 6 × 5s = 30s
- Total: ~120s = 2 minutes per task

**For 50 tasks over weekend:**
- Total overhead: 50 × 2min = 100 minutes (1.67 hours)
- Spread over 48 hours: ~3-4 minutes per hour
- **Acceptable for Frank**

---

## Final Recommendation

### Use: **GitHub Issues + Local Markdown Hybrid**

**Why:**
1. **Henry gets professional dashboard** - GitHub Projects board, mobile-friendly, real-time
2. **Frank gets fast local state** - No waiting on API for quick checks
3. **Resilient** - Works offline (update markdown), sync when online
4. **Scalable** - If project continues beyond weekend, GitHub Issues already established
5. **Standard tooling** - `gh` CLI, markdown, JSON - all familiar tools
6. **Low overhead** - ~2 minutes per task, well within constraints

**Setup:** 15 minutes  
**Overhead:** <2 minutes per task  
**Henry visibility:** <10 seconds (open GitHub Projects board)  
**Frank efficiency:** High (local files for frequent reads, GitHub for authoritative state)

### Implementation Checklist

- [ ] Create GitHub Project with Kanban columns
- [ ] Set up local tracking files (`state.md`, `dependencies.json`, `config.json`)
- [ ] Cache field/option IDs in config
- [ ] Create helper scripts for common operations (create task, move task, assign agent)
- [ ] Test full lifecycle with one dummy task
- [ ] Set up heartbeat to check for orphaned agents
- [ ] Configure progress update schedule (morning/afternoon/evening)

### Success Metrics

- Frank can create and track 50+ tasks over the weekend
- Henry can check progress in <30 seconds
- No more than 5% of Frank's time spent on task management
- Zero task-tracking blockers (system never prevents Frank from working)

---

## Appendix: Helper Scripts

### `create-task.sh`
```bash
#!/bin/bash
# Usage: create-task.sh "Title" "Body" "feature" "2,3"
# Args: title, body, label, depends_on (comma-separated issue nums)

TITLE="$1"
BODY="$2"
LABEL="$3"
DEPENDS="$4"

ISSUE_URL=$(gh issue create \
  --repo henry/booey \
  --title "$TITLE" \
  --body "$BODY" \
  --label "$LABEL" \
  --project "Booey Weekend Build" \
  --json url -q .url)

ISSUE_NUM=$(echo $ISSUE_URL | grep -oE '[0-9]+$')

# Update dependencies.json
jq '.tasks["'$ISSUE_NUM'"] = {
  "id": '$ISSUE_NUM',
  "title": "'"$TITLE"'",
  "depends_on": ['"$DEPENDS"'],
  "status": "queued"
}' ~/memory/projects/booey/dependencies.json > /tmp/deps.json
mv /tmp/deps.json ~/memory/projects/booey/dependencies.json

echo "Created issue #$ISSUE_NUM: $TITLE"
```

### `move-task.sh`
```bash
#!/bin/bash
# Usage: move-task.sh 42 in_progress

ISSUE_NUM=$1
NEW_STATUS=$2

CONFIG=~/memory/projects/booey/config.json
PROJECT_ID=$(jq -r '.project_id' $CONFIG)
STATUS_FIELD=$(jq -r '.field_ids.status' $CONFIG)
OPTION_ID=$(jq -r '.status_option_ids["'$NEW_STATUS'"]' $CONFIG)

ITEM_ID=$(gh project item-list $PROJECT_ID --owner henry \
  --format json | jq -r '.items[] | select(.content.number=='$ISSUE_NUM') | .id')

gh project item-edit \
  --id $ITEM_ID \
  --project-id $PROJECT_ID \
  --field-id $STATUS_FIELD \
  --single-select-option-id $OPTION_ID

jq '.tasks["'$ISSUE_NUM'"].status = "'$NEW_STATUS'"' \
  ~/memory/projects/booey/dependencies.json > /tmp/deps.json
mv /tmp/deps.json ~/memory/projects/booey/dependencies.json

echo "Moved issue #$ISSUE_NUM to $NEW_STATUS"
```

### `ready-tasks.sh`
```bash
#!/bin/bash
# List tasks with no unmet dependencies (ready to work on)

jq -r '
  .tasks 
  | to_entries 
  | map(select(.value.status == "queued")) 
  | map(select(
      .value.depends_on 
      | map(. as $dep | 
          ($tasks[($dep|tostring)].status == "done" or $tasks[($dep|tostring)].status == "merged")
        ) 
      | all
    ))
  | .[] 
  | "#\(.key): \(.value.title)"
' ~/memory/projects/booey/dependencies.json
```

---

**End of Research Document**

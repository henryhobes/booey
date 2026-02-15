# Phase 7: Workflow Enhancement

**Goal:** Transform from ad-hoc agent workflow to systematic agent-first engineering, inspired by OpenAI's Harness Engineering approach.

**Reference:** https://openai.com/index/harness-engineering/

## Tasks

| # | Task | Type | Status |
|---|------|------|--------|
| 1 | Restructure CLAUDE.md → docs/ knowledge base | Repo (docs) | ⬜ queued |
| 2 | Agent-to-agent review loops | Repo (workflow) | ⬜ queued |
| 3 | Custom ESLint rules enforcing architecture | Repo (code) | ⬜ queued |
| 4 | Make app legible to agents (self-test capability) | Repo (code) | ⬜ queued |
| 5 | Execution plans as first-class artifacts | Repo (docs) | ⬜ queued |
| 6 | Daily doc-gardening cron job | Cron | ⬜ queued |

## Dependencies
- Task 1 first (foundational — everything references the new docs structure)
- Tasks 2-5 can run in parallel after Task 1
- Task 6 after Task 1 (needs docs structure to garden)

## Principles
- CLAUDE.md = table of contents (~100 lines), not encyclopedia
- Repository knowledge is the system of record (not Slack, not heads)
- Enforce architecture mechanically (linters > documentation)
- Agents review agents (humans review architecture, not code)
- Progressive disclosure: agents start small, dig deeper as needed

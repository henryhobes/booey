# Task Template

Standardized format for agent task specs. Every task follows this structure.

---

## Task: [Task Name]

**Repo:** `/Users/henryhobin/Projects/booey/`
**Worktree:** `/Users/henryhobin/Projects/booey-worktrees/<task-name>/`
**Branch:** `phase-X/<task-name>`
**Base:** `main`

### Context
Brief description of project state and what's already been built. Always includes:
- "Read `CLAUDE.md` in the repo root for the project map."
- Link to relevant docs (architecture, conventions, decisions) the agent should read.

### What to Build
Numbered list of specific deliverables:
1. **Component/File Name** (`path/to/file.tsx`)
   - Detailed behavior description
   - Props, routing, data flow
   - Edge cases to handle

### Design Notes
- UX guidance (mobile-first, target demographic, tone)
- Which theme/components to use
- Accessibility requirements

### Success Criteria
- [ ] Feature works as described
- [ ] `npm run build` passes (full Next.js build)
- [ ] `npm run lint` passes clean
- [ ] TypeScript strict mode — no `any` types
- [ ] Responsive on mobile (min 375px width)
- [ ] All edge cases handled (empty states, errors, loading)
- [ ] Self-review completed (see workflow step 6)
- [ ] PR description includes implementation notes + self-review summary

### Workflow
1. Set up worktree: `git worktree add /Users/henryhobin/Projects/booey-worktrees/<task-name> -b phase-X/<task-name>`
2. Work in the worktree directory (not the main checkout)
3. Install dependencies: `cd <worktree> && npm install`
4. Read `CLAUDE.md` and any docs linked in Context above
5. Implement everything in "What to Build"
6. **Self-review before PR:**
   - Run `git diff main...HEAD` and re-read your own changes
   - Check against `docs/CONVENTIONS.md` (import boundaries, naming, patterns)
   - Verify `npm run build` and `npm run lint` pass
   - Fix any issues found
7. Commit with descriptive messages (`feat:`, `fix:`, etc.)
8. Push and open PR against `main`
9. Include in PR description:
   - What was built (summary)
   - Self-review findings (what you checked, any concerns)
   - `Fixes #<issue>` if applicable
10. Wait for CI (GitHub Actions) to pass
11. Write task doc at `docs/phases/phase-X/task-N-<name>.md`

### Return Format
- ✅ **"PR #X ready for review"** — all success criteria met, self-review done
- ⚠️ **"PR #X needs guidance"** — hit a decision point or ambiguity
- ❌ **"Blocked on X"** — can't proceed without external input

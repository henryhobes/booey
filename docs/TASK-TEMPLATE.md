# Task Template

This is the standardized format Frank uses when assigning tasks to sub-agents. Every task spec follows this structure.

---

## Task: [Task Name]

**Repo:** `/Users/henryhobin/Projects/booey/`
**Worktree:** `/Users/henryhobin/Projects/booey-worktrees/<task-name>/`
**Branch:** `phase-X/<task-name>`
**Base:** `main`

### Context
Brief description of project state and what's already been built. Always includes "Read `CLAUDE.md` in the repo root for full project context."

### What to Build
Numbered list of specific deliverables:
1. **Component/File Name** (`path/to/file.tsx`)
   - Detailed behavior description
   - Props, routing, data flow
   - Edge cases to handle

2. **Another Component** (`path/to/other.ts`)
   - Same level of detail

### Design Notes
- UX guidance (mobile-first, target demographic, tone)
- Which theme/components to use
- Accessibility requirements

### Success Criteria
Explicit, measurable conditions that define "done":
- [ ] Feature X works as described (specific behavior)
- [ ] `npm run build` passes with no errors
- [ ] `npm run lint` passes clean
- [ ] TypeScript strict mode — no `any` types
- [ ] Responsive on mobile (min 375px width)
- [ ] All edge cases handled (empty states, errors, loading)
- [ ] PR description matches what was built
- [ ] Codex review passed (or all in-scope issues resolved)

### Workflow
1. Set up worktree: `cd /Users/henryhobin/Projects/booey && git worktree add /Users/henryhobin/Projects/booey-worktrees/<task-name> -b phase-X/<task-name>`
2. Work in the worktree directory (not the main checkout)
3. Install dependencies: `cd /Users/henryhobin/Projects/booey-worktrees/<task-name> && npm install`
4. Implement everything in "What to Build"
5. Run `npm run build` and `npm run lint` to verify
6. Commit with descriptive message(s)
7. Push and open PR against `main` with description of what was built
8. Write task doc at `docs/phases/phase-X/task-N-<name>.md` (spec, what was built, learnings)
9. Update `docs/phases/phase-X/OVERVIEW.md` to reflect what was actually built
10. Run Codex review: `npx @openai/codex --approval-mode full-auto "Review the diff on branch phase-X/<task-name> vs main. Check for: TypeScript errors, accessibility, responsive design, error handling, code quality. Give specific feedback."` (from worktree directory)
11. If Codex flags issues, fix them, push, re-review (max 3 cycles)
12. Report back with: PR number + link, Codex approval status, any remaining flags or blockers

### Return Format
One of:
- ✅ **"PR #X ready to merge"** — all success criteria met, Codex approved
- ⚠️ **"PR #X needs guidance"** — implemented but hit a decision point or ambiguity
- ❌ **"Blocked on X"** — can't proceed without external input/dependency

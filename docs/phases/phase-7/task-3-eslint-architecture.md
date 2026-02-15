# Phase 7 Task 3: Custom ESLint Rules Enforcing Architecture

## Context
Read `CLAUDE.md` for the project map. Read `docs/CONVENTIONS.md` for the import boundary rules.

We need to mechanically enforce architectural conventions so agents can't accidentally violate them. Linter errors should include remediation instructions (so agents self-fix without human intervention).

## What to Build

1. **ESLint flat config** (`eslint.config.mjs`)
   - Set up ESLint 9 flat config (we already have `eslint` and `eslint-config-next` in devDependencies)
   - Add `eslint-plugin-import` (or equivalent) for import boundary enforcement

2. **Import boundary rules**
   Enforce the dependency direction from `docs/CONVENTIONS.md`:
   ```
   types/        → (no imports from src/)
   lib/utils/    → types/
   lib/supabase/ → types/, lib/utils/
   lib/ai/       → types/, lib/utils/
   hooks/        → lib/, types/
   components/   → hooks/, lib/, types/
   app/          → components/, hooks/, lib/, types/
   app/api/      → lib/, types/ (NO component or hook imports)
   ```
   
   Use `no-restricted-imports` or `import/no-restricted-paths` to enforce this.
   
   **Error messages must include remediation:**
   ```
   "Components cannot import from app/ pages. Move shared logic to lib/ or hooks/. See docs/CONVENTIONS.md."
   ```

3. **File size rule**
   - Warn at 250 lines, error at 300 lines per file
   - Error message: "File exceeds 300 lines. Split into sub-components or extract logic to lib/. See docs/CONVENTIONS.md."

4. **Naming convention rules**
   - Components must be PascalCase
   - Hooks must start with `use`
   - Utility files must be camelCase or kebab-case

5. **No `any` type rule**
   - `@typescript-eslint/no-explicit-any` set to error

6. **Update `package.json`**
   - Add `"lint": "eslint src/"` if not already scoped
   - Ensure `npm run lint` runs the new rules

## Design Notes
- Use ESLint 9 flat config format (not legacy `.eslintrc`)
- Keep rules focused on architecture enforcement, not style (Prettier handles style)
- Every error message should tell the agent HOW to fix it, not just WHAT is wrong
- Don't break existing code — if current code violates new rules, fix it in this PR

## Success Criteria
- [ ] `eslint.config.mjs` with all rules above
- [ ] Import boundaries mechanically enforced
- [ ] File size limits enforced
- [ ] All existing code passes `npm run lint` (fix violations)
- [ ] `npm run build` passes
- [ ] Error messages include remediation instructions
- [ ] Self-review completed against `docs/CONVENTIONS.md`

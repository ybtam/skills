# Contribution workflow

## Sources and scope

Edit baseline decisions in `standards/`, then run `bun run skills:bundle`. The baseline copies under skill references are committed distribution artifacts. Specialized skills maintain their own references. Each skill must work when installed alone.

Keep applications in `apps/`, shared code in `packages/` only for real consumers, and shared configuration in `configs/`. Organize domain code into contexts and named feature folders with nearby tests. Add local instruction letters only for distinct requirements, without repeating inherited rules. Create ADRs only for consequential trade-offs.

Keep root guidance focused and route conditional work with links that say when to read them. Verify commands and paths against their sources when revising instructions. Preserve deliberate policies and the letter format. AGENTS.md is this repository's canonical guidance; compatibility files need a demonstrated consumer requirement.

## Checks

Use the Bun version recorded in `.bun-version` and `package.json`. If dependencies are missing, run `bun install --frozen-lockfile`.

- After baseline edits: `bun run skills:bundle` regenerates distributed references.
- `bun run check` validates skill freshness and portability, types, tests, lint, and formatting.
- `bun run build` builds the website and checks static output and links.
- `git diff --check` checks whitespace errors in the diff.

Tests should verify behavior rather than wording. Perfectionist runs through Oxlint; an ESLint runner is not a fallback. Use checks appropriate to the scope and complete required checks. Report actual passes, failures, and skipped checks; repeat or broaden verification only when changes, failures, or unresolved concerns justify it.

Review the result against the specification first, then for code quality. Keep local verification distinct from remote CI and publishing or deployment.

# Improve AGENTS.md and CLAUDE.md

## Outcome

Create the independently installable `improve-agent-docs` skill and apply its approach to this repository. Preserve letter format, project choices, authorization boundaries, and required checks. Implementation starts after structured plan approval.

## Findings

The repository has root, skills, and website AGENTS.md files, no root CLAUDE.md, and nine published skills. `tune-agent-instructions` already audits instruction-related behavior. Shared baseline sources live in `standards/`; `scripts/skills.ts` distributes them. Tests cover isolated skill reference closure, and the website reads the catalog from source. Untracked `.serena/` is unrelated.

The AIHero guide recommends a focused root, conditional references, scoped instructions, contradiction review, and removal of stale or redundant advice. Apply these without arbitrary word limits or weakening deliberate constraints. Do not copy the article or encode its numerical instruction-budget claim as a rule.

Source: https://www.aihero.dev/a-complete-guide-to-agents-md

Current Claude Code documentation describes native AGENTS.md support with version/configuration conditions. Imports load eagerly; ordinary links can route optional reading. Check target compatibility rather than automatically adding a symlink.

Source: https://code.claude.com/docs/en/memory#agentsmd

## Chosen approach

Create a dedicated skill for document structure, scope, accuracy, and AGENTS/CLAUDE compatibility. Keep `tune-agent-instructions` focused on behavioral diagnosis across prompts, skills, and instructions; clarify the distinction where needed without making either skill depend on the other.

Alternative: extend the existing skill, saving a catalog entry but combining this workflow with its model-specific behavioral audit. A generic instruction generator would encourage boilerplate and exceed the request. The dedicated skill is the recommendation.

## Skill design

Create `skills/improve-agent-docs/SKILL.md` with name, description, and version metadata. Use Astra for this skill and all AGENTS.md revisions. Include a short bundled reference only for compatibility details and attribution; no runtime dependency or sibling-skill requirement.

Inspect relevant ancestor, root, and nested guidance; resolve links, imports, symlinks, and scope. Verify documented commands against repository sources. Audit questions remain read-only. Edit requests reuse existing authorization and applicable review requirements. Distinguish conflicts resolved by scope or instruction priority from unresolved choices requiring user input.

Explain which instructions stay, move, merge, or are removed, with reasons. Keep universal constraints accessible at the root. Reuse appropriate references; add files only for useful conditional content. Preserve unique CLAUDE.md content and deliberate policies. Never blindly replace files or edit personal, vendor, or generated guidance. Check broken links, import cycles, and standalone reference closure.

Use qualified offline notes when browsing is unavailable; verify current official docs for version-specific claims. Report review coverage and limitations, including untested runtime loading. Do not turn this skill into a requirement to rewrite every repository.

## Repository changes

1. Shorten root `AGENTS.md` while retaining the letter, purpose, read-only questions, unrelated-work protection, Git/destructive-operation boundaries, best-model policy, bounded delegation, approval gate, and local-versus-live verification distinction. Add Bun and actual check commands through clear routing.
2. Add task-triggered Markdown links to the skill and website letters, CONTEXT.md, existing issue-tracker/triage/domain docs, and the approved scope plan. Remove historical setup provenance from the operating instructions.
3. Put conditional contribution details in `docs/agents/contributing.md`: authoritative standards and bundling, source organization, consequential ADRs, verification commands, Perfectionist through Oxlint, and specification then code-quality review. Root directs contributors there before changes. Keep safety and approval rules at the root.
4. Refine `skills/AGENTS.md` only for redundant inherited guidance and necessary authoring details. Preserve the website letter's distinct technical constraints; edit only justified links or clarity issues.
5. Keep AGENTS.md canonical here. Do not add a redundant CLAUDE.md by default or change user/global settings. The new skill supports existing CLAUDE.md files and compatibility bridges when needed. State explicitly if Claude runtime loading has not been tested.
6. Update the guidance paragraph in `standards/baseline.md` to teach selective references and preservation of deliberate rules, retaining mandatory letter-style root guidance. Regenerate distributed copies with `bun run skills:bundle`. This clarifies the baseline; it does not record a target-project migration.
7. Register the new specialized skill in `scripts/skills.ts` without unrelated baseline references. Update README catalog counts, install example, distinction, and attribution. Ten skills will be exposed by existing website generation; no website feature work.

## Verification

Use existing validation and isolated-copy tests; extend specialized-reference preservation coverage for the new skill if it includes references. Check changed document links and retention of original policy meaning. Walk through audit-only, authorized edits, contradictory files, stale commands, standalone installation, unique Claude instructions, and nested scope. Label walkthroughs separately from live agent evaluations.

Run `bun run skills:bundle`, `bun run check`, `bun run build`, and `git diff --check`. Install locked dependencies only if needed. Verify generated catalog inclusion. Report unrelated failures without expanding scope. Avoid wording-snapshot tests and new dependencies.

Acceptance: independently usable skill; applied repository guidance; preserved policy meaning; valid references; actual local check results reported. No commit, push, publishing, deployment, global installation, personal instruction edits, or unrelated cleanup.

## Review gate

This plan is canonical Markdown; the self-contained HTML renders the same content. Approval covers this scope and the choice to keep AGENTS.md canonical without adding CLAUDE.md here. Requested changes revise both artifacts before another review. Closing review without a decision does not authorize implementation.

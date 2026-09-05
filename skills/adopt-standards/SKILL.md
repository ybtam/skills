---
name: adopt-standards
description: Bring an existing repository toward selected project standards through a bounded, reviewed migration that preserves current behavior and unrelated work.
metadata:
  version: 0.1.0
---

# Adopt standards

Use this skill when an existing repository has standards to adopt. Adoption is a migration from observed behavior, not a license to replace the architecture.

1. Inspect current behavior and boundaries: runtime, package manager, applications, dependencies, scripts, CI, tests, agent guidance, installed skills, integrations, and `.project-standards.json` if present. Check the working tree and preserve unrelated edits.
2. Read [references/baseline.md](references/baseline.md) to compare defaults with the repository. Read [references/questionnaire.md](references/questionnaire.md) only for unresolved project decisions. Record terms, exceptions, and the exact areas in scope.
3. Define a bounded migration with current behavior, target behavior, invariants, affected paths, checks, and rollback points. Read [references/migrations.md](references/migrations.md) for migration and failure rules. For Yi's repositories, write the Markdown/HTML plan under `.codex/plans/<date>-<slug>/`, run the gated Plannotator review, and wait for approval before implementation.
4. Apply one coherent area at a time. Preserve project architecture unless the approved scope says otherwise. Use Oxlint/Oxfmt and compatible Oxlint JavaScript plugins for sorting; never introduce an ESLint runner. Update runtime project configuration only after reporting incompatibility and agreeing a resolution.
5. Install and configure selected upstream prerequisites explicitly. Read [references/integrations.md](references/integrations.md) when adding Matt Pocock or stack skills, Codegraph, Plannotator, or agent MCP integrations. Initialize Codegraph after source exists and verify its query; verify Plannotator review operation without overwriting existing configuration.
6. Run affected format, lint, type, meaningful test, build, CI configuration, and integration checks. Keep successful area versions unchanged when another area fails. Record partial state and remaining work in `.project-standards.json`; do not claim adoption from changed files alone.

Completion means the reviewed scope is applied, existing behavior invariants hold, applicable checks pass, and the recorded state names every successful, partial, and unresolved area.

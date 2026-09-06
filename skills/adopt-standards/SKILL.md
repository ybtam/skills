---
name: adopt-standards
description: Bring an existing repository toward selected project standards through a bounded, reviewed migration that preserves current behavior and unrelated work.
metadata:
  version: 0.1.0
---

# Adopt standards

Use the best model available in the host to generate every plan artifact.

Use this skill when an existing repository has standards to adopt. Adoption migrates observed behavior and preserves the project architecture unless the approved scope says otherwise.

1. Inspect current behavior boundaries: runtime, package manager, applications, dependencies, scripts, CI, tests, agent guidance, installed skills, integrations, and `.project-standards.json` when present. Check the working tree and preserve unrelated edits.
2. Before any package-manifest mutation, dependency installation, Changesets initialization, workflow or credential change, publication, or production change, ask whether the owner intends to set up release automation. A no or defer records only the target release state in approved state work; it does not configure release automation.
3. On yes, complete the full owner release interview in the bundled references and include its settled choices in the target migration plan. Invoke and use `release-with-changesets` only when it is available and invocable; otherwise use the bundled questionnaire and references and explicitly report that the supporting skill did not run. Do not create a hard sibling-skill dependency or claim an explicit-only skill ran. Keep GitHub-only, owner-selection, and external-action boundaries in the bundled references.
4. Do not make release changes until the interview has settled and the target plan is approved. Read [references/baseline.md](references/baseline.md), compare it with the repository, and use [references/questionnaire.md](references/questionnaire.md) only for unresolved project decisions. Record terms, exceptions, and exact areas in scope.
5. Define a bounded migration: current behavior, target behavior, invariants, affected paths, checks, and rollback points. Read [references/migrations.md](references/migrations.md) for failure rules. For Yi's repositories, write Markdown and HTML under `.codex/plans/<date>-<slug>/`, run gated Plannotator review, and wait for approval before edits.
6. Apply one coherent area at a time, and apply only the approved migration. Keep Oxlint/Oxfmt as the lint/format path and run Perfectionist through Oxlint's JavaScript-plugin support; do not add an ESLint runner. Report incompatibility and agree a resolution before changing runtime or project configuration.
7. Install or configure selected upstream prerequisites explicitly. Read [references/integrations.md](references/integrations.md) when adding Matt Pocock or stack skills, Codegraph, Plannotator, agent settings, or MCP integrations. Initialize Codegraph when source exists and verify its query; verify the Plannotator review operation without overwriting existing configuration.
8. Run affected formatting, lint, type checks, meaningful tests, builds, CI-configuration checks, and integration checks. Keep successful area versions unchanged when another area fails. Record partial state and remaining work in `.project-standards.json`; do not claim adoption from changed files alone.

Completion means the reviewed scope is applied, existing behavior invariants hold, applicable checks pass, and recorded state names every successful, partial, and unresolved area.

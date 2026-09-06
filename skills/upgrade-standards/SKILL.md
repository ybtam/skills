---
name: upgrade-standards
description: Compare applied repository standards with the current baseline and migrate selected areas to newer verified versions.
metadata:
  version: 0.1.0
---

# Upgrade standards

Use the best model available in the host to generate every plan artifact.

Use this skill when a repository has recorded standards and selected tooling needs to advance.

1. Inspect actual files and `.project-standards.json`, then compare them with the current bundled baseline. Read [references/state.md](references/state.md) for version semantics and preservation of unknown or newer records. Identify drift, exceptions, prerequisites, and areas already ahead.
2. Before any package-manifest mutation, dependency installation, Changesets initialization, workflow or credential change, publication, or production change, ask whether the owner intends to set up release automation. A no or defer records only the target release state in approved state work; it does not configure release automation.
3. On yes, complete the full owner release interview in the bundled references and include its settled choices in the target upgrade plan. Invoke and use `release-with-changesets` only when it is available and invocable; otherwise use the bundled questionnaire and references and explicitly report that the supporting skill did not run. Do not create a hard sibling-skill dependency or claim an explicit-only skill ran. Keep GitHub-only, owner-selection, and external-action boundaries in the bundled references.
4. Do not make release changes until the interview has settled and the target plan is approved. Read [references/baseline.md](references/baseline.md), then ask only missing or changed decisions through [references/questionnaire.md](references/questionnaire.md). Preserve explicit project choices and exceptions.
5. Select a bounded set of upgrades, preferring a direct migration to the latest supported version. Read [references/migrations.md](references/migrations.md) when intervening versions, deprecated replacements, rollback, or partial failure matter. For Yi's repositories, prepare Markdown and HTML under `.codex/plans/<date>-<slug>/`, run gated Plannotator review, and wait for approval before edits.
6. Apply prerequisites and coupled changes together, including shared configs and dependent applications. Keep Oxlint/Oxfmt as the lint/format path and verify natural sorting through Oxlint's JavaScript-plugin support; do not add an ESLint runner. Install or verify Codegraph, Plannotator, and selected upstream skills where applicable. Read [references/integrations.md](references/integrations.md) for integration routing.
7. Run affected formatting, lint, type checks, meaningful tests, builds, CI-configuration checks, and integration checks. Advance only areas whose required checks pass. Preserve previous successful versions and record failed or partial upgrades as unresolved work in `.project-standards.json`.

Completion means selected standards are on verified versions, project choices remain intact, and state accurately records successful, partial, and deferred upgrades.

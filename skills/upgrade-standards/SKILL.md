---
name: upgrade-standards
description: Compare applied repository standards with the current baseline and migrate selected areas to newer verified versions.
metadata:
  version: 0.1.0
---

# Upgrade standards

Use this skill when a repository already has recorded standards and the baseline or selected tooling has advanced.

1. Inspect the actual files and `.project-standards.json`, then compare them with the current bundled baseline. Read [references/state.md](references/state.md) for version semantics and preservation of unknown or newer records. Identify drift, exceptions, prerequisites, and areas already ahead.
2. Read [references/baseline.md](references/baseline.md) for current defaults. Ask only decisions that changed or are missing, using [references/questionnaire.md](references/questionnaire.md) for relevant branches. Preserve project choices and explicit exceptions.
3. Select a bounded set of areas and prefer direct migration to the latest supported version. Read [references/migrations.md](references/migrations.md) when intervening versions, deprecated replacements, rollback, or partial failure matter. Prepare the required reviewed plan; for Yi use gated Markdown/HTML Plannotator review under `.codex/plans/<date>-<slug>/` before edits.
4. Apply prerequisites and coupled changes together, including shared configs and dependent applications. Keep Oxlint/Oxfmt as the lint/format path and verify natural sorting through Oxlint's JavaScript-plugin support. Do not add an ESLint runner. Install or verify Codegraph, Plannotator, and selected upstream skills from official sources as needed; read [references/integrations.md](references/integrations.md) for integration routing.
5. Run affected format, lint, type, meaningful tests, production builds, and integration checks. Advance only the areas whose required checks pass. Preserve the previous successful versions for failed or partial areas and record unresolved migration work in `.project-standards.json`.

Completion means selected standards are on verified versions, project choices remain intact, and state accurately records successful, partial, and deferred upgrades.

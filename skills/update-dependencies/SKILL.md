---
name: update-dependencies
description: Update repository dependencies across applications and workspaces, including major migrations, with official guides and affected-project verification.
metadata:
  version: 0.1.0
---

# Update dependencies

Use the best model available in the host to generate every plan artifact.

Use this skill when dependency versions need maintenance in a single project or monorepo.

1. Inspect runtime, package manager, lockfiles, workspace graph, constraints, direct and transitive dependents, scripts, CI, and working tree. Preserve local edits. Read [references/state.md](references/state.md) for recording partial success and [references/migrations.md](references/migrations.md) for grouping, rollback, and failure rules.
2. Identify outdated, deprecated, incompatible, and coupled packages. For every major update, consult the package's official migration guide and release notes before editing. Propose deprecated replacements explicitly; do not treat a broad latest-version command as a migration plan. Report runtime incompatibility and agree a project-scoped resolution before changing runtime configuration.
3. Define a bounded reviewed update plan grouped by coherent dependency families and affected applications. For Yi use Markdown/HTML under `.codex/plans/<date>-<slug>/` with gated Plannotator approval before mutations. Keep standards, skill maintenance, CI publication, and deployment changes outside scope unless explicitly selected.
4. Update the correct manifest and lockfile with the repository's existing package manager. Update code/config only where required by official migration guidance. Preserve compatibility pins and project exceptions unless the approved plan changes them.
5. Run affected formatting, Oxlint, Oxfmt, type checks, meaningful tests, production builds, workspace resolution, and critical browser or Storybook checks where applicable. Verify every dependent application and package. Advance recorded versions only for passing groups; preserve successful state and record remaining work when a group fails.

Completion means the approved dependency groups are migrated with official guidance, affected dependents pass their checks, lockfile state is coherent, and partial or unresolved work is recorded honestly.

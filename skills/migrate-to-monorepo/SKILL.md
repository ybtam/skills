---
name: migrate-to-monorepo
description: Move an existing application into package-manager workspaces and a suitable monorepo layout while keeping it working and updating every affected path.
metadata:
  version: 0.1.0
---

# Migrate to a monorepo

Use this skill when an existing repository needs workspace boundaries for multiple applications or real shared packages. Inspect and verify the existing app before adding new apps.

1. Inspect the current app, runtime and package manager, scripts, imports, dependency graph, configs, tests, Docker contexts, CI paths, agent guidance, and working tree. Preserve local edits and record the current behavior that must survive.
2. Read [references/questionnaire.md](references/questionnaire.md) for unresolved workspace, application, backend, deployment, and package ownership choices. Read [references/migrations.md](references/migrations.md) for move ordering, path updates, rollback, and partial state. Define `apps/` for deployable applications and `packages/` only for concrete shared consumers or ownership needs.
3. Create a bounded reviewed migration plan with old/new paths, workspace package names, dependency and script changes, import/config/Docker/CI impacts, invariants, and verification. For Yi use canonical Markdown plus self-contained HTML and gated Plannotator approval under `.codex/plans/<date>-<slug>/` before moving files.
4. Move the existing application first, then update workspace manifests, imports, scripts, shared TypeScript/Oxlint/Oxfmt configuration, tests, Docker contexts, and CI paths. Introduce context and feature directories only when approved and useful. Keep framework routing entrypoints where required. Use Turborepo when multiple apps or shared packages warrant it.
5. Read [references/integrations.md](references/integrations.md) when configuring selected agent skills, Codegraph, Plannotator, or MCP integrations after paths settle. Reinitialize/index Codegraph against the resulting source and verify a query; preserve agent settings.
6. Run root and app commands, workspace dependency resolution, formatting, lint, type checks, meaningful tests, production builds, Docker validation where available, and relevant CI checks. Update `.project-standards.json` only for areas whose checks pass; record skipped execution and remaining issues.

Completion means the existing application still works at its new boundary, workspace dependencies and all affected paths resolve, checks pass, and the migration state is accurate.

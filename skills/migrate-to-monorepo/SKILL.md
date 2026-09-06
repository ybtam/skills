---
name: migrate-to-monorepo
description: Move an existing application into package-manager workspaces with a suitable monorepo layout while keeping it working and updating every affected path.
metadata:
  version: 0.1.0
---

# Migrate to a monorepo

Use this skill when an existing repository needs workspace boundaries for multiple applications or real shared packages. Inspect and verify the existing application before adding new applications.

1. Inspect the current application, runtime, package manager, scripts, imports, dependency graph, configs, tests, Docker contexts, CI paths, agent guidance, and working tree. Preserve local edits and record the current behavior that must survive.
2. Before any package-manifest mutation, dependency installation, Changesets initialization, workflow or credential change, publication, or production change, ask whether the owner intends to set up release automation. A no or defer records only the target release state in approved state work; it does not configure release automation.
3. On yes, complete the full owner release interview in the bundled references and include its settled choices in the target migration plan. Invoke and use `release-with-changesets` only when it is available and invocable; otherwise use the bundled questionnaire and references and explicitly report that the supporting skill did not run. Do not create a hard sibling-skill dependency or claim an explicit-only skill ran. Keep GitHub-only, owner-selection, and external-action boundaries in the bundled references.
4. Do not make release changes until the interview has settled and the target plan is approved. Read [references/questionnaire.md](references/questionnaire.md) for unresolved workspace, application, backend, deployment, and package-ownership choices. Read [references/migrations.md](references/migrations.md) for move ordering, path updates, rollback, and partial state. Define `apps/` as deployable applications and `packages/` only for concrete shared consumers with an ownership need.
5. Create a bounded reviewed migration plan with old and new paths, workspace package names, dependency and script changes, import/config/Docker/CI impacts, invariants, and verification. For Yi's repositories, use canonical Markdown and self-contained HTML with gated Plannotator approval under `.codex/plans/<date>-<slug>/` before moving files.
6. Move the existing application first, then update workspace manifests, imports, scripts, shared TypeScript/Oxlint/Oxfmt configuration, tests, Docker contexts, and CI paths. Introduce context feature directories only when approved and useful. Keep required framework routing entrypoints. Use Turborepo when multiple apps and shared packages warrant it.
7. Read [references/integrations.md](references/integrations.md) when configuring selected agent skills, Codegraph, Plannotator, or MCP integrations after paths settle. Reinitialize and index Codegraph, verify a query, and preserve agent settings.
8. Run root and application commands, workspace dependency resolution, formatting, lint, type checks, meaningful tests, production builds, Docker validation where available, and relevant CI checks.
9. Only after validation, advance or update areas whose checks pass. Report skipped execution and remaining issues separately from CI, and record skipped work and unresolved issues in `.project-standards.json`.

Completion means the existing application still works at the new boundary, workspace dependencies and affected paths resolve, checks pass, and migration state is accurate.

# Migration rules and supported history

## Baseline 0.1.0 → 0.2.0

Do not install or initialize the CLI or create workflows until the ordered owner interview is complete and the target plan is approved. Use the target's existing test runner when available; otherwise use the narrow `node --test` workflow-shape fallback to verify local static workflow shape and configuration. Remote GitHub Actions CI is not run by this migration and must be reported separately as unrun or pending.

The Python private `package.json` sidecar does not use or create a Python adapter. Do not edit `pyproject.toml`, synchronize Python metadata or claim PyPI support.

Inspect the target repository, its state record, workspace layout and existing workflows. Review the owner choices for release setup; do not roll Changesets out automatically to existing projects. If the owner declines or defers, update only the target `.project-standards.json` release record and leave package manifests, `.changeset`, workflows, credentials, registry, publishing and production configuration untouched. If the owner approves, complete the owner interview and approve the target plan before installing or initializing `@changesets/cli` or creating workflows; follow [integrations.md](integrations.md) if the approval gate is unclear. Choose the requested root or monorepo topology and release outcome, and add only the approved GitHub Actions workflows. Python projects may receive a private `package.json` sidecar, but this route never changes Python metadata or PyPI behavior.

Verify the selected Changesets configuration, workflow triggers, permissions, release owner, branch, release notes and any publication fields with the target's existing test runner when available; otherwise use a narrow `node --test` fallback. This verifies local static workflow shape and configuration only. Remote GitHub Actions CI is not run by this migration and must be reported separately as unrun or pending. Verify registry publication only when registry, package, access and authentication are all present. Record `configured`, `declined`, `deferred` or `partial` in [state.md](state.md), with applied baseline `0.2.0` separate from skill metadata. On a failed check, preserve the last successful area version, retain reviewable partial edits, and report exact recovery steps; do not reset unrelated work or claim production deployment.

Baseline 0.1.0 is the first release. There are no earlier released baseline migrations. Existing untracked projects use adoption after inspection. Do not invent intermediate version history. Future changes must add source/target versions, prerequisites, affected areas, transformations, verification and recovery notes here before claiming support.

## Standards upgrades

Inspect actual files alongside state and retained project choices. Read every intervening documented change, then prefer one direct migration to latest. Apply intermediate steps only for genuine prerequisites. Propose changes to exceptions explicitly. Permit partial area adoption; record success only with passing evidence using [state.md](state.md).

## Monorepo conversion

Establish current checks before moves. Agree apps and domain boundaries. Move the existing app into apps/<name>, configure package-manager workspaces and Turborepo, and reuse configs/ with app-specific overrides. Update imports/aliases, workspace dependency declarations, root/app scripts, lockfile resolution, tests, Docker build contexts and CI working directories. Preserve framework entry points and existing behavior. Check root and app invocations and dependent builds before adding applications. New apps then use the setup process; if a sibling skill is unavailable, install it explicitly or follow bundled questionnaire/baseline instructions.

Extract shared packages only for actual consumers. Contexts/features organize domain code inside workspace boundaries, not a mechanical one-context-one-package rule. Keep tests near features and create local guidance only for distinct instructions.

## Dependency updates

Map workspaces and dependent packages first. Check runtime/engine, peers, overrides, catalogs and intentional pins. Consult official release documentation and migration guides for every major update; retain links and required changes in the plan. If no guide exists, inspect official release notes and API docs and identify uncertainty before applying. Propose deprecated replacements as decisions. Group coupled packages and update the package manager's lockfile. Run affected dependents' tests/builds after each coherent group. Preserve unrelated dependencies and application behavior.

## Recovery

Report incompatibilities with concrete resolution options before expanding scope. Keep migration edits reviewable and record checks at each boundary. Do not run destructive reset/clean, remove unrelated files, or repair messy Git history by adding worktrees. A failed check leaves corresponding successful versions unchanged. Explain exactly what remains and whether recovery requires a new user decision.

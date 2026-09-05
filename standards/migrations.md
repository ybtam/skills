# Migration rules and supported history

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

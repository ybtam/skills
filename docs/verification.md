# Historical implementation verification · 2026-09-05

This historical record describes the seven-skill baseline at the time. The approved plan was implemented locally, and all seven skills were completed and reviewed before the website evaluation.

## Passed locally

- Bun 1.4.2 frozen-lockfile installation.
- Vercel skills CLI discovery: exactly seven published skills.
- Actual copy-style installation of all seven into an isolated temporary project.
- Bundled reference freshness and isolated reference closure, including missing and escaping-link failures.
- Type checking for repository tooling and the website; Oxlint and Oxfmt checks.
- Vitest: 12 tests across portability and catalog search behavior.
- Perfectionist 5.11.0 through Oxlint 1.81.0: natural import and named-import diagnostics/fixes; Oxfmt 0.66.0 round trip passes. No ESLint runner. Named-import fixes need a separate suggestions-fix pass.
- Monorepo fixture: existing application test passes before the move and through updated root/workspace commands afterward.
- Production static generation: 14 pages. The output check verifies UTF-8 declarations, full document bodies and local reference links.
- Browser checks: seven catalog entries, normalized search, empty results, clipboard command, documentation navigation, all 14 pages at mobile width without overflow, and a clean console after the encoding fix.
- Docker Compose configuration and the local `ybtam-skills-web:local` image build.
- Codegraph index, CLI query and MCP query. Existing Plannotator installation produced the approved structured review decision.
- All 43 installed upstream skills match verified official revisions recorded in `.project-standards.json`.
- Independent skill and final code reviews found no remaining actionable issues.

## Fixes found during verification

Shared Oxfmt ignore patterns are rooted at the config directory, so the root command supplies `.formatterignore`. Static generation inside Docker needs an explicit preview host. Static HTML needs UTF-8 metadata to avoid a production hydration mismatch. Standards index and detail routes require a layout Outlet. These behaviors are reflected in the configuration and static-output check.

## Limits

Remote CI has not run. No commit, push, image publication, infrastructure change or deployment was performed. The empty GitHub remote is connected, but installation from GitHub requires publishing these files first.

The website verifies the Bun/TanStack Start path. Other frameworks, native clients and real database upgrades remain conditional skill workflows rather than claims of live end-to-end validation. Failed-state behavior was reviewed against the instructions; no real database migration was executed. Other agents must be configured when selected; this run used the existing Codex environment.

## GitHub Pages follow-up

The approved Pages change adds a `/skills/` deployment variant while retaining `/` for Docker. Local verification passed for both variants: 17 tests, type/lint/format checks, all 14 pages plus the 404 page, base-aware asset/document targets, deep-link browser navigation, search, clipboard, favicon and 404 recovery. The root-path Docker image also builds successfully.

The workflow validates both variants and deploys only successful main-branch runs. The public deployment status is available in the repository's GitHub Actions history. No Harbor or GitOps configuration is changed.

## Agent-instruction audit skill

`tune-agent-instructions` was added from the official GPT-6 Astra behavioral guidance. The new skill passed standalone copy installation and reference validation. The full suite passed 21 tests, and both hosting variants built 15 content pages plus the 404 page. At that time, specialized references remained separate from the seven baseline-bundled workflows.

An independent Luna agent used the skill for a read-only fixture audit. It identified repeated permission requests, edits during explanation requests, mandatory delegation, and disproportionate testing while preserving the explicit review/deployment gates and worktree restriction. A direct before/after comparison confirmed the fixture was unchanged. This was an executed audit with reasoning-based scenario assessment, not an API-based Astra behavior benchmark.

## Baseline amendment · 2026-09-06

The `0.2.0` baseline amendment adds `release-with-changesets` as the eighth baseline skill. The catalog now has eight baseline skills plus the specialized `tune-agent-instructions` skill, for nine skills total. Its approved target-only release workflow is documented in the [release-with-changesets plan](../.codex/plans/2026-09-06-release-with-changesets-baseline/plan.md) and [review result](../.codex/plans/2026-09-06-release-with-changesets-baseline/review.json).

### Passed locally

- `@changesets/cli` 3.0.2 was installed as a development dependency for local fixtures.
- `bun run skills:bundle` and `bun run skills:check` passed for all nine skills.
- `bun run check` passed with 57 Vitest tests, including the 25-test Changesets CLI and workflow-contract suite.
- `bun run build` passed; `check-site` validated 16 pages plus the 404 page, including `/skills/release-with-changesets/`.
- Real isolated CLI fixtures passed for a single private package, selected JavaScript monorepo release units, Python-sidecar byte preservation, and workflow shapes.
- Fixture `bun install --frozen-lockfile` passed.

### Limits

The collection remains GitHub-folder-distributed and has no root Changesets release setup. No remote CI, publishing, GitHub Release, tag, registry, or production action ran.

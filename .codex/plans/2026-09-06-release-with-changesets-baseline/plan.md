# Release with Changesets baseline skill

**Status:** Approved — Plannotator review recorded in [review.json](review.json)
**Date:** 2026-09-06  
**Baseline target:** `0.2.0`

## Outcome

Add `release-with-changesets` as the eighth baseline skill in this collection. It will help a target repository inspect its release topology, ask its owner whether release setup is wanted, and configure a user-selected GitHub Actions release path only after the owner confirms every consequential choice.

The skill is a portable workflow, not a release system for this repository. This repository remains a private, GitHub-folder-distributed skill collection. It will install `@changesets/cli` only as a development dependency for local fixtures and will not add `.changeset/`, release publishing, registry credentials, tags, GitHub Releases, or production deployment here.

## Agreed contract

### Entry-point orchestration

`setup-repo`, `adopt-standards`, `upgrade-standards`, and `migrate-to-monorepo` will inspect the target first, ask whether releases should be configured, and invoke `release-with-changesets` only after an explicit yes.

`setup-repo` additionally follows this order:

1. Inspect the target and its existing agent/skill configuration.
2. Install and verify the project skills the owner selects.
3. Trigger `grill-with-docs` (the actual skill name; there is no `grill-me-with-docs`) after installation. Where the host requires explicit invocation, request it rather than claiming it ran. `grill-with-docs` invokes grilling and domain modeling.
4. Use the selected skills to resolve the target's setup and release decisions.
5. Produce the target's approved plan before mutations.

Every entrypoint remains usable when installed alone. If `install-project-skills`, `grill-with-docs`, or `release-with-changesets` is unavailable or the host requires explicit invocation, it uses its bundled questionnaire fallback and reports that the supporting skill did not run.

### Target release flow

```text
entrypoint inspection
  -> owner confirms release setup
  -> topology and publication interview
  -> reviewed target plan
  -> install/init Changesets and selected CI only
  -> PR release-intent validation
  -> version PR / selected release owner
  -> optional GitHub Release, registry publication, and repository-owned production workflow
```

The target owner decides all of the following. The skill configures only the selected answers:

| Decision | Supported choices |
| --- | --- |
| Release topology | One repository release; independent packages/apps; explicitly named fixed or linked group |
| Python support | A private `package.json` sidecar for release coordination only; never edit `pyproject.toml` or claim PyPI support |
| Private units | Version without a registry tag, or explicit exclusion |
| Publication outcome | Version PR only; version PR plus GitHub Release; registry publication with optional GitHub Release/production trigger |
| Release owner | Native Changesets action, or one repository-owned rerunnable release script |
| Channel | Stable or prerelease, with prerelease release/publication/deployment choices asked separately |
| Release text | Changesets changelog, existing changelog, or GitHub Release notes |
| Authentication | Existing workflow mechanism, or an explicitly approved new token/secret configuration |
| Release branch | Detected then confirmed by the owner |

Changesets selects versions from descriptors and changeset files. It does not infer which application deploys. There is no generic deployment map, Python metadata adapter, guessed registry, or automatic production routing.

Descriptor routing is explicit:

- A simple JavaScript repository uses its root `package.json`; a Python-shaped simple repository uses a private root sidecar only after approval.
- A monorepo is inspected before changes. Existing workspace descriptors are preserved, and the owner selects which packages or applications are release units.
- The skill creates a missing descriptor only for an owner-selected release unit. It never adds a sidecar to every workspace or overwrites an existing manifest.

For application/private-workspace releases, the default proposal is `privatePackages: { version: true, tag: false }`; `fixed`, `linked`, and `ignore` remain empty until the owner names affected units.

Exactly one release owner creates tags and GitHub Releases for a release path. A custom owner must expose one explicit command, consume Changesets-produced versions, and safely skip already-created release state on a rerun. If that contract is absent, the target stops at a version PR rather than inventing a script.

Mutating release CI runs only from the owner-confirmed release branch and does not cancel in-flight work. Manual runs are dry-run or explicitly confirmed and branch-guarded. Pull requests affecting selected release units validate Changesets intent; the generated Changesets version PR and only owner-approved exclusions are exempt.

When a target selects production, it remains a separate repository-owned workflow. Per ADR 0002, this baseline trusts the selected Changesets release event and does **not** add independent tag-format, tag-commit, or branch-ancestry validation. It does not remove safeguards a target repository already owns.

## Implementation milestones

### 1. Establish the `0.2.0` baseline contract

Update authoritative files under `standards/`:

- `baseline.md`: add conditional Changesets/release-CI guidance, explicit publishing/deployment authority, and the no-inference boundaries.
- `questionnaire.md`: add the ordered release interview, including release intent, topology, publication, release owner, channel, notes, authentication, branch, and production questions.
- `integrations.md`: document `@changesets/cli` verification through the target's existing package manager and GitHub Actions-only workflow support.
- `state.md`: define how a target records release setup as configured, declined, deferred, or partial, while keeping baseline version separate from skill version.
- `migrations.md`: add the `0.1.0 -> 0.2.0` migration: inspect first, propose release setup, retain a decline/defer state, and recover by preserving prior successful state when any release check fails.

Keep `CONTEXT.md` and ADRs 0001–0003 as the authoritative decision record. Do not weaken ADR 0002's deliberate production-trust decision.

### 2. Add the portable baseline skill and its assets

Create `skills/release-with-changesets/` with:

- `SKILL.md`, metadata version `0.1.0`, a distinct automatic-discovery description, and the complete conditional workflow above.
- Links to every reference and asset from inside the skill folder so an isolated install cannot depend on this repository or sibling skills.
- Small GitHub Actions template assets for PR release-intent validation, version/release handling, optional release-event production handoff, and a workflow-shape-test fallback. Each template uses explicit placeholders for target-owned values rather than a copied registry, app list, deployment command, tag grammar, secret name, or GitOps path.

The skill must tell the host to request explicit `grill-with-docs` invocation when required. It must not claim that it ran an explicit-only skill or install unrelated skills silently.

### 3. Wire conditional release evaluation into baseline entrypoints

Update the authoritative source entrypoints:

- `skills/setup-repo/SKILL.md`
- `skills/adopt-standards/SKILL.md`
- `skills/upgrade-standards/SKILL.md`
- `skills/migrate-to-monorepo/SKILL.md`

Each entrypoint will inspect and ask the release-intent question before any `package.json` mutation, dependency install, Changesets init, workflow write, credential configuration, publish job, or production change.

`setup-repo` will place skill installation/verification before triggering `grill-with-docs`; where the host requires explicit invocation, it will request that invocation. It then continues with its existing bundled questionnaire when either supporting skill is unavailable. The other three entrypoints use the same conditional release evaluation but do not acquire a hard dependency on sibling skills.

### 4. Register, package, and document the baseline

- Add `release-with-changesets` to `baselineNames` in `scripts/skills.ts`. The catalog then contains nine skills: eight baseline skills and the specialized `tune-agent-instructions`.
- Add `@changesets/cli` as a root development dependency using Bun; update `bun.lock`. Do not initialize Changesets in this repository.
- Run `bun run skills:bundle` after every `standards/` change. It generates baseline `references/` copies; do not hand-edit those copies.
- Update `README.md`, `docs/verification.md`, `.project-standards.json`, and current repository-skill documentation to correct stale seven-skill / `0.1.0` claims. Preserve historical context by adding a dated amendment to the prior approved plan rather than silently rewriting its original approval.
- Let the website catalog, generated content, and dynamic skill route derive the new skill from `skills/`; do not edit ignored generated content or manually add routes.

### 5. Add meaningful local verification

Add fixture-driven checks using the real local `@changesets/cli`, without publishing:

1. A single private package release plan.
2. A JavaScript monorepo with selected release units and private-package behavior.
3. A Python-shaped repository with a private root sidecar; assert that Changesets changes only release-coordination files and leaves `pyproject.toml` untouched.
4. Workflow-template shape checks for the PR gate, confirmed release branch, non-cancellable mutation, one release owner, selected publication toggles, prerelease policy, and separate production handoff. Run the target's existing runner where possible; the packaged `node --test` asset is only the fallback.

Preserve existing data-driven isolated-copy validation so all nine published skills resolve their own references after copying. Do not introduce brittle wording assertions; test CLI behavior, template structure, and reference closure.

### 6. Verify and record the resulting baseline

Run, in order:

1. `bun install` (only after approval; update the lockfile through Bun).
2. `bun run skills:bundle`.
3. `bun run skills:check`.
4. Focused Changesets fixture and workflow-shape checks.
5. `bun run typecheck`, `bun run test`, `bun run lint`, and `bun run format:check`.
6. `bun run build` to regenerate and validate the catalog/site output.
7. `git diff --check` and a working-tree review.

Update the `0.2.0` baseline/state documentation only with checks that actually passed. Report local checks, unavailable checks, remote CI, registry publication, GitHub Release creation, and production deployment separately. No remote CI, registry publication, GitHub Release, or production deployment is part of this implementation authorization.

## File boundary

| Area | Files |
| --- | --- |
| Baseline source | `standards/{baseline,questionnaire,integrations,state,migrations}.md`, `CONTEXT.md`, `docs/adr/0001-*`, `docs/adr/0002-*`, `docs/adr/0003-*` |
| Portable skills | `skills/release-with-changesets/**`, plus the four entrypoint `SKILL.md` files |
| Packaging and tests | `package.json`, `bun.lock`, `scripts/skills.ts`, existing/new fixture and workflow-shape tests |
| Catalog and records | `README.md`, `docs/verification.md`, `.project-standards.json`, a dated amendment to the prior repository-skills plan |
| Generated distribution files | baseline `skills/*/references/*.md`, regenerated only by `bun run skills:bundle` |

## Risks and handling

| Risk | Handling |
| --- | --- |
| A standalone skill silently needs another skill | Keep all local references bundled; request explicit invocation where required; retain fallback instructions. |
| A Python sidecar is mistaken for Python packaging | Mark it private/release-coordination-only; fixture-test that `pyproject.toml` is untouched. |
| A release is duplicated or partially repeated | Select one release owner; require an explicit rerunnable custom command or stop at version PR. |
| Registry credentials or publish jobs appear without authority | Ask for registry, packages, access, and authentication; leave publication unconfigured when any is absent. |
| Current collection accidentally becomes an npm release project | Install CLI only as a dev dependency; do not add `.changeset/`, publish scripts, secrets, release workflows, or tags here. |
| Baseline/artifact counts drift again | Derive catalog output from `names`; update current claims and verify all nine isolated skills. |
| Production release input needs stronger validation later | Preserve ADR 0002 as the explicit current policy; target repositories may retain their own safeguards. |

## Non-goals

- Publishing this skill collection to npm or changing its GitHub-folder installation model.
- Adding this repository's own Changesets configuration, release workflow, registry credentials, GitHub Release, tags, or deployment.
- Editing `pyproject.toml`, synchronizing Python package versions, or publishing to PyPI.
- Creating a generic deployment map, app list, Docker image policy, registry endpoint, GitOps path, or production command.
- Overwriting an existing target repository release workflow, release script, authentication model, or production safeguard.

## Approval gate

This plan authorizes only the implementation scope listed above after its Plannotator review is approved. It does not authorize any external publication or live deployment.

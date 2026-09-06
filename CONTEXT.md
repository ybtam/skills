# Repository Standards

Shared language for skills that establish and evolve a project's engineering practices.

## Language

**Personal baseline**:
Yi's preferred engineering practices, used as the starting point for a project's decisions. It covers tooling, installed agent skills, and agent guidance as well as application technology.

**Project standard**:
A practice agreed for a particular project after examining its needs and discussing how the personal baseline applies.

**Setup**:
Establishing an agreed set of project standards in a new repository. The project may contain one application, multiple frontends, or other arrangements.

**Migration**:
A bounded, approved change that brings an existing repository toward agreed project standards while accounting for its current behavior and constraints.

**Changesets workflow skill**:
A portable baseline skill that helps a target repository adopt Changesets CLI and configure release CI. During Setup or Migration, it asks whether the owner intends to set up releases, publishing, and registry configuration; the owner's answers determine the outcome. It configures release CI only after confirmation. It does not require this skill collection itself to become an npm package or use Changesets for its folder-based distribution.

**Changesets release selection**:
Changesets configuration and its release plan select workspace packages to version or publish. A target repository's production workflow separately decides whether a released package deploys an application.

**Changesets sidecar**:
A repository-owned `package.json` that lets Changesets coordinate release data in a non-JavaScript repository. It does not make Changesets responsible for that repository's native package metadata or published artifacts.

**Changesets release topology**:
The owner decides whether a repository has one release unit or a monorepo has independently released packages or applications. The skill creates or uses package descriptors only for selected release units; Changesets then selects their versions from its release plan.

**Changesets publication outcome**:
The owner selects version PR only, version PR with a GitHub Release, or registry publication with optional GitHub Release and production trigger. The skill configures only the selected outcome and never infers that a release unit is publishable.

**Changesets release owner**:
Either the Changesets action or a repository-owned release script creates tags and GitHub Releases. A repository uses one release owner for each release path, never both.

**Changesets release safety**:
Mutating release CI runs only from the confirmed release branch and is not cancelled while it creates release state. A manual run is read-only or explicitly confirmed and branch-guarded.

**Changesets registry publication**:
Registry publication requires the owner to provide the registry, selected packages, access level, and authentication method. Missing answers leave publication unconfigured.

**Changesets release branch**:
The skill detects the target repository's default branch and the owner confirms the branch from which release CI may mutate release state.

**Changesets pull-request validation**:
Pull requests affecting selected release units validate Changesets release intent. The generated version PR and only owner-approved exclusions are exempt.

**Changesets release channel**:
The owner selects stable or prerelease behavior. The skill preserves existing prerelease state and configures only the selected channel.

**Changesets release notes**:
The owner selects Changesets changelog output, an existing repository changelog, or GitHub Release notes as the release text source.

**Changesets release authentication**:
The skill inspects the target repository's existing workflows and uses the authentication they require. It asks before adding a GitHub App token or another secret.

**Changesets prerelease outcome**:
The owner separately selects prerelease GitHub Release and registry publication behavior. Prereleases do not deploy to production without an explicitly selected prerelease deployment workflow.

**Changesets private release unit**:
The owner decides whether a selected private package or application receives a version bump without a registry tag, or is excluded. The default proposal is versioned without a registry tag.

**Changesets package grouping**:
Fixed groups, linked groups, and ignored packages are empty unless the owner explicitly names the affected release units.

**Changesets custom release script**:
When a repository-owned script is the release owner, it has one explicit command, consumes Changesets versions, and is safe to rerun after a partial release.

**Changesets production trust**:
Production may trust the selected Changesets release event without independent tag-format, tag-commit, or branch-ancestry validation.

**Changesets workflow verification**:
Workflow-shape tests use the target repository's existing test runner when possible. If none is suitable, the skill adds a narrow `node --test` check because Changesets already requires Node.

**Changesets entrypoint integration**:
`setup-repo`, `adopt-standards`, `upgrade-standards`, and `migrate-to-monorepo` evaluate release setup after inspection. They ask whether the owner intends to configure releases and invoke `release-with-changesets` only after confirmation.

**Setup skill orchestration**:
`setup-repo` installs and verifies selected project skills before requesting explicit invocation of `grill-with-docs`, then uses the selected skills for the approved setup. If a supporting skill is unavailable, `setup-repo` uses its bundled questionnaire fallback and reports that the skill did not run.

**Shared backend**:
A backend serving multiple applications, such as web and native clients. This describes a relationship between applications, not a requirement to organize backend code using MVC.

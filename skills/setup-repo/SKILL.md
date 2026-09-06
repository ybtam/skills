---
name: setup-repo
description: Establish project standards in a new or newly inspected repository, configure agent tooling, and scaffold an agreed development workflow.
metadata:
  version: 0.1.0
---

# Set up a repository

Use the best model available in the host to generate every plan artifact.

Use this skill for evidence-led standards setup in a single application, multiple frontends, shared backends, or another repository shape.

1. Inspect the repository before asking questions: runtime and package manager, applications and packages, frameworks and APIs, scripts, tests, CI, Docker, agent guidance, installed skills, integrations, and recorded decisions. Preserve local edits and working choices unless a project decision changes them.
2. Identify the project skills that fit the inspected target. Install and verify only owner-selected skills where they are available and authorized. If a supporting skill is unavailable, continue with the bundled references rather than creating a dependency on a sibling skill.
3. After the skill-installation attempt, use `grill-with-docs` when it is available and invocable. Normalize the user's `grill-me-with-docs` wording to that actual skill name. If the host requires explicit invocation, request it; explicitly report that the supporting skill did not run and continue with the bundled fallback.
4. Read [references/baseline.md](references/baseline.md) and [references/questionnaire.md](references/questionnaire.md). Use the selected skills and bundled fallback to resolve setup decisions and prepare a bounded, reviewable setup plan covering structure, runtime, package management, lint/format, verification, agents, skills, local services, CI, registry, and deployment ownership.
5. During planning, before any package-manifest mutation, dependency installation, Changesets initialization, workflow or credential change, publication, or production change, ask whether the owner intends to set up release automation. A no or defer records only the target release state in the approved state work; it does not configure release automation.
6. On yes, complete the full owner release interview in the bundled references and add its settled choices to the target plan. Invoke and use `release-with-changesets` only when it is available and invocable; otherwise use the bundled questionnaire and references and explicitly report that the supporting skill did not run. Do not make it a required sibling dependency or claim an explicit-only skill ran. Keep the GitHub-only, owner-selection, and external-action boundaries in those references.
7. Do not make release changes until the interview has settled and the target plan is approved. Use the project's chosen review method; for Yi's repositories, create canonical Markdown and self-contained HTML under `.codex/plans/<date>-<slug>/`, run Plannotator's gated structured review, and wait for approval before mutations.
8. Apply only approved choices. Use Oxlint/Oxfmt as the lint/format path and natural sorting through Oxlint's supported JavaScript-plugin integration; do not add an ESLint runner. Prepare GitHub Actions quality/build checks by default, while publication and deployment remain separately authorized. Configure `setup-matt-pocock-skills`, stack-specific official skills, Codegraph (`@colbymchenry/codegraph`), Plannotator, and [references/integrations.md](references/integrations.md) only where applicable. Preserve existing agent settings and avoid duplicate hooks.
9. Initialize Codegraph when source exists, keep generated index data out of Git, and verify an index/query. Verify Plannotator's structured-review result. Package every reference needed by this skill inside the folder so it works after isolated installation.
10. Run applicable formatting, lint, type checks, meaningful tests, and production build. Add Storybook or browser checks only when the project needs them. Advance an area's applied version only when its checks pass. Report skipped checks, unresolved choices, external CI, publication, and deployment separately.

Completion means agreed choices are recorded, approved setup is applied, applicable checks and integrations pass, and `.project-standards.json` accurately distinguishes successful, partial, and unresolved work.

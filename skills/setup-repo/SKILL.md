---
name: setup-repo
description: Establish project standards in a new or newly inspected repository, configure agents and tooling, and scaffold the agreed development workflow.
metadata:
  version: 0.1.0
---

# Set up a repository

Use this skill when a repository needs an evidence-led standards setup. It supports a single application, multiple frontends, shared backends, and other repository shapes.

1. Inspect the repository before asking questions: package manager and runtime, applications and packages, frameworks and APIs, scripts, tests, CI, Docker, agent guidance, installed skills, integrations, and recorded decisions. Preserve local edits and existing working choices unless a project decision changes them.
2. Read [references/baseline.md](references/baseline.md) for Yi's personal defaults. Read [references/questionnaire.md](references/questionnaire.md) before asking unresolved questions; ask only branches relevant to the inspected repository, in rounds that do not depend on unanswered answers.
3. Record agreed terminology and choices. Write or update `.project-standards.json` with the schema, baseline, project choices, per-area applied versions, and the run result. Read [references/state.md](references/state.md) for the schema and partial-success rules.
4. Produce a bounded setup plan covering structure, runtime and package manager, lint/format, verification, agents, skills, local services, CI, registry, and deployment ownership. Use the project's chosen review method. For Yi's repositories, create canonical Markdown and self-contained HTML under `.codex/plans/<date>-<slug>/`, run Plannotator's gated structured review, and wait for approval before mutations.
5. Apply only approved choices. Keep applications and contexts understandable; add shared packages only for real consumers. Use Oxlint and Oxfmt, with natural sorting through Oxlint's supported JavaScript-plugin integration where compatible. Do not substitute an ESLint runner. Prepare GitHub Actions quality/build checks by default, while keeping image publishing and deployment separately authorized.
6. Install upstream prerequisites explicitly when selected: Matt Pocock's official engineering skills and `setup-matt-pocock-skills`, stack-specific official skills, Codegraph (`@colbymchenry/codegraph`), and Plannotator. Read [references/integrations.md](references/integrations.md) when selecting agents, configuring MCPs, or verifying these tools. Preserve existing agent settings and avoid duplicate hooks.
7. Initialize Codegraph after source exists, keep generated index data out of Git, and verify an index/query. Verify Plannotator's CLI and a structured review result. Package every reference needed by this skill inside this folder so it works after isolated installation.
8. Run formatting, lint, type checks, meaningful tests, and a production build appropriate to the repository; add Storybook or browser checks only when the project needs them. Advance an area's applied version only after its checks pass. Report skipped checks, unresolved choices, external CI, publication, and deployment separately.

Completion means the agreed choices are recorded, the approved setup is applied, applicable checks and integrations pass, and `.project-standards.json` accurately distinguishes successful, partial, and unresolved work.

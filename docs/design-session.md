# Repository skills design session

The consolidated plan is now in .codex/plans/2026-09-05-repository-skills/plan.md. The notes below preserve interview history; the consolidated plan uses the latest decisions.

Latest addition: install and configure Plannotator as part of the default setup, with selected-agent integration and structured review verification.

## Confirmed decisions

- Use Yi's personal baseline as the starting point, then use a questionnaire inspired by grill-with-docs to reach decisions suited to the user's project.
- Cover engineering practices beyond stack selection: installed skills, base AGENTS.md guidance, and the placement of additional guidance within a repository.
- Support projects that are not full stack, including projects with multiple frontends.
- Establish the new-project workflow first, then validate the standards against an existing repository. Concrete evaluation projects remain to be selected through the interview; Yi will evaluate the result.
- For migrations, inspect first, propose a bounded change, and apply approved changes. Distinguish required standards from preferences.
- Record agreed terminology during the interview. Create ADRs only for consequential trade-offs that warrant them.
- Before implementation, produce the canonical Markdown plan and HTML review under .codex/plans/<YYYY-MM-DD>-<slug>/ and obtain the required Plannotator approval.

## Open decisions

- Initial engineering domains and the baseline choices within each.
- Core skill selection and how project needs affect that selection.
- AGENTS.md placement, inheritance, and maintenance expectations.
- Supported agent environments.
- Concrete new-project and migration evaluation scenarios.
- How standards evolve and existing projects adopt later changes.

## Follow-up decisions

- Cover repository structure, tooling, testing, CI, agent guidance, installed skills, and deployment in the initial scope; evaluation will identify gaps.
- Ask which agents the user uses, allowing multiple selections, and use those answers to configure guidance and skill installation.
- Install skills per repository.
- Matt Pocock's skills are required. Frontend projects also require Emil Kowalski's animation skills. Verify the exact upstream collections before specifying installation.
- Select additional skills according to the final stack. The selection will expand over time; provide workflows for adding and updating skills.
- Support updates during setup/migration and through a dedicated maintenance workflow. Update approval and execution policy remains to be clarified from the user's answer, "Both."
- Use Yi's supplied working rules as the initial agent-guidance baseline and adapt them to the project. Write agent guidance in a readable letter format. Determine placement through the questionnaire.

## Preferred technology candidates

These are questionnaire options, not a requirement to install every tool in every project.

- Bun or pnpm; clarify runtime separately from package management.
- TanStack Start or Next.js, with relevant TanStack tooling.
- Hono, with optional oRPC; determine when a separate API is warranted.
- Zod, Drizzle, and PostgreSQL.
- Oxlint and Oxfmt; discuss rules separately.
- Vitest, Storybook, shadcn/ui, and ReUI where relevant.
- Stack-related MCP servers and skills. Yi mentioned Drizzle RC4 as an example; verify current upstream availability and compatibility before selection.
- Docker, Kubernetes, and Argo CD; determine which projects need each layer.

Other candidates and missing requirements remain open for the interview.

## Runtime, architecture, and maintenance decisions

- Explain runtime and package-manager options and let the user choose. Update the selected runtime to the latest version before setup work; clarify release channel, installation scope, and migration compatibility handling before encoding this rule.
- Ask the user about application and API architecture. Explore a shared backend when web and native applications are planned. Yi suggested MVC for large projects; clarify backend organization separately from monorepo layout.
- Docker, Kubernetes, and Argo CD are the preferred default deployment destination.
- Support skill updates during setup/migration and through an explicit maintenance workflow. Clarify whether the latest affirmative answer approves automatic updates or the previously recommended approval step for existing installations.
- Add a dependency-update skill, with particular attention to monorepos.
- Include conditional questionnaire branches for authentication, observability, secrets, end-to-end testing, accessibility, and database migration/recovery.
- Select relevant TanStack tooling rather than installing every package indiscriminately.

## Maintenance policy clarifications

- Explain runtime release choices, honoring the user's override, and manage the selected version per project rather than changing a machine-wide installation by default. The default release channel still needs an explicit choice between latest stable and LTS where both exist.
- Report existing-project runtime incompatibilities first and suggest a resolution before changing the project.
- The architecture preference means independently organized applications sharing a backend, not a prescribed MVC pattern.
- Dependency updates include major versions and consideration of deprecated-package replacements. Always consult official documentation and migration guides for major-version updates. Propose replacements explicitly and verify affected applications after coherent update groups.
- Skill updates run automatically during setup/migration and through the dedicated maintenance workflow; a separate approval step for each skill update is not required. This supersedes earlier tentative approval recommendations. Handling locally modified installed skills remains open.

## Confirmed defaults and standards upgrades

- Default to the latest Node.js LTS or latest stable Bun, with an explained user override and project-scoped version management.
- Use package-manager workspaces and Turborepo for projects needing multiple applications or shared packages; keep single-application repositories simpler where appropriate.
- Automatically update untouched upstream skills. Preserve locally modified skills, report conflicts, and suggest reconciliation.
- Provide a dedicated standards-upgrade skill. Track the version used for setup so later runs can account for intervening migrations or propose migration to the latest setup.
- The version record's contents, migration-path selection, and completion rules remain to be designed. Distinguishing the executed skill version from the applied baseline version is a proposal, not yet an agreed implementation.
- Evaluate first with a small use case containing two frontends and one shared backend. The concrete use case and frontend types remain open.

These confirmations resolve the earlier open runtime-channel choice and locally modified skill policy. Historical interview notes above retain the questions as they arose; the latest explicit confirmation governs.

## Version tracking and first evaluation

- Track the executed setup skill version, the applied baseline version, and the project's agreed choices. Record successful application separately from attempted upgrades; failed runs must not mark the project current.
- Prefer direct migration to the latest baseline where supported. Account for required intermediate migrations and preserve project choices unless changes are approved.
- Allow partial adoption across standards areas and accurately record what was applied.
- Replace the proposed two-frontend/shared-backend first evaluation with a website in this repository. Validate more complex topology branches later on an appropriate project.
- The website combines a searchable skill catalog and installation commands with documentation of the baseline and setup/migration workflows.
- Start with a static documentation website generated from the repository's actual skills and standards. Accounts, saved questionnaires, and server-side features are not part of the initial website.
- Add a dedicated skill for migrating a simple repository to a monorepo. Its scope, layout decisions, and verification requirements remain to be grilled.

## Monorepo migration and website choices

- The monorepo migration reorganizes and verifies the existing project first. Use the setup workflow afterward for additional applications.
- Default to apps/ for deployable applications and packages/ for shared packages. Extract packages only for concrete consumers or ownership needs.
- Use TanStack Start for the website. The earlier Astro recommendation was not selected.
- Reference upstream skills on the website with clear ownership and links to their original sources. Install upstream skills from those sources rather than maintaining copies here.

## Repository setup and delivery order

- Put the website in apps/web alongside published skills/ and standards documentation. Scope website dependencies to apps/web; add shared packages only when needed.
- Use Bun for this repository.
- A root AGENTS.md is mandatory. Propose additional guidance locations from actual project boundaries and distinct local requirements; use the agreed letter format.
- Implement all agreed skills before building the website. The website then evaluates the completed setup workflow. This supersedes the earlier setup-and-website-first recommendation.

## Initial skill scope, checks, and deployment boundary

- The seven proposed entry points are provisionally accepted: new-repository setup, adoption in an existing repository, applied-standards upgrades, simple-repo-to-monorepo migration, skill installation, skill updates, and dependency updates.
- Include Perfectionist in the linting requirements. Its integration with Oxlint and the desired sorting rules need investigation and project-specific decisions; other lint/format choices depend on the target repository.
- Include formatting, linting, type checking, meaningful tests, and production builds in local and CI verification. Add browser tests for critical UI journeys and Storybook where reusable UI components warrant it.
- Setup prepares the application Docker image and Docker Compose services for local development, such as PostgreSQL and Mailpit where needed.
- Actual deployment is the user's choice. Ask about image publishing and deployment during the questionnaire; Yi's default is to have CI prepared. This does not itself authorize publishing an image or deploying.
- For Yi's projects, Argo CD configuration lives in a separate GitOps repository, so application commits alone do not change the desired deployment state. Determine the image publication and GitOps promotion policy during the questionnaire.
- These deployment decisions supersede the earlier blanket proposal to generate Kubernetes and Argo CD files in the application repository.

## CI, registry, and sorting defaults

- Default to GitHub Actions. Detect existing CI during migration and ask before replacing it.
- Ask which container registry to use for each project. Yi uses self-hosted Harbor.
- Use natural sorting for Perfectionist. Determine applicable sorting rules from the target repository and verify compatibility with the chosen lint tooling.

## Portable baseline and completion rules

- Maintain the personal baseline in one authoritative source in this repository, then bundle the required reference files inside each published skill. An installed skill must work without access to this source repository or uninstalled sibling skills.
- Store the target project's agreed choices and successfully applied versions in that project, separately from the bundled personal baseline.
- Ask only unresolved questionnaire questions after inspecting the repository. Explain relevant options and recommendations in rounds; reuse recorded decisions unless requirements changed.
- Report partial completion accurately. Fix failures within the agreed scope when possible; ask when resolution needs another decision. Required checks must pass before the corresponding standards are marked applied.
- Include Codegraph in the personal baseline. Verify the intended distribution, installation, and agent integration before specifying setup steps.

## Upstream setup and review integration

- Use Matt Pocock's engineering skills by default and offer other groups during the questionnaire, following the recommendation accepted in the latest round.
- Invoke Matt Pocock's setup skill to configure issue tracking and domain documentation instead of duplicating that questionnaire and configuration logic.
- Initialize Codegraph for the project and configure its MCP integration for the selected agents. Keep generated index data out of Git and verify access through the configured integration.
- The locally installed Codegraph distribution is @colbymchenry/codegraph; its CLI provides project initialization and agent installation commands.
- Default to HTML/Plannotator approval for substantial setup and migration plans. Allow other users to choose an in-chat review through the questionnaire. This repository retains Yi's explicit required HTML/Plannotator gate.

## Upstream verification

- [Matt Pocock's official collection](https://github.com/mattpocock/skills) documents installation through the Vercel skills CLI and explicitly calls for selecting setup-matt-pocock-skills.
- [Emil Kowalski's official collection](https://github.com/emilkowalski/skills) includes emil-design-eng, animate, review-animations, improve-animations, find-animation-opportunities, and animation-vocabulary.
- [Perfectionist](https://github.com/azat-io/eslint-plugin-perfectionist) is an ESLint plugin. [Oxlint's JavaScript plugin support](https://oxc.rs/docs/guide/usage/linter/js-plugins.html) offers an ESLint-compatible bridge, but is documented as alpha. Exact Perfectionist rule compatibility has not been validated. The integration strategy remains a decision for review.

## Context organization and shared configuration

- Require Perfectionist to run directly through Oxlint's JavaScript-plugin support. An ESLint runner is not an acceptable fallback. Verify selected natural-sorting rules and report incompatibilities before proceeding.
- Prefer domain-context organization in monorepos, with clearly named feature directories within each context so related code is easy to understand and scan.
- Keep shared configuration in a separate directory, including TypeScript and Oxlint configuration, reusable by all applications and packages.
- Proposed layout for plan review: retain apps/ and packages/ workspace boundaries, organize application source as src/contexts/<context>/features/<feature>/, and use configs/ for shared configuration. Contexts are not automatically workspace packages; extract shared domain code when actual consumers require it.
- Verify each tool's configuration inheritance and path resolution before selecting how consumers extend the shared defaults. Permit small application-specific configuration for differences such as runtime and framework requirements.

## Verified repository facts

- The GitHub repository ybtam/skills exists, is public, and is empty as of 2026-09-05.
- The local folder contains installed skills and skills-lock.json, but is not initialized as a Git repository.
- Vercel's CLI discovers skills under skills/<name>/SKILL.md. Each skill requires YAML frontmatter with a name and description.

Sources: [repository](https://github.com/ybtam/skills), [Vercel skill discovery documentation](https://github.com/vercel-labs/skills/blob/main/README.md#skill-discovery), [discovery implementation](https://github.com/vercel-labs/skills/blob/main/src/skills.ts).

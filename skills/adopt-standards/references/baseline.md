# Personal baseline · 0.2.0

Use these defaults to recommend project standards, not to override answers or existing constraints. Read [questionnaire.md](questionnaire.md) for the decision process, [integrations.md](integrations.md) for external tools, [state.md](state.md) for recording success, and [migrations.md](migrations.md) for changes to existing work.

## Tool choices

Explain Node.js and Bun as runtimes separately from pnpm and Bun package management. The user chooses. Default to current Node LTS or stable Bun; honor a release override. Inspect compatibility first, then select/install the project runtime before scaffolding or dependency installation. Use project-scoped version management and record exact versions. Report an existing repo's incompatibility with a proposed resolution before changing it; preserve other projects' runtimes.

Offer TanStack Start or Next.js for web apps. Select relevant TanStack packages, shadcn/ui and ReUI by actual need. Multiple apps may share one backend; this is not an MVC requirement. Offer Hono for a separately deployed API, optional oRPC for its contract, Zod for validation, and Drizzle/PostgreSQL for persistence. Native and non-TypeScript projects need their own documented tool choices rather than a forced TypeScript scaffold.

Use Oxlint and Oxfmt. Run Perfectionist natural sorting through Oxlint's JS-plugin support, never an ESLint runner. Prove selected rules produce diagnostics and safe fixes with the actual versions; check formatter interaction. If incompatible, report the precise rule/API/version failure and ask about resolution instead of weakening the requirement. Other lint/format rules belong to the project's questionnaire.

Use Vitest where appropriate, Storybook for reusable UI, and browser tests for critical journeys. Verify format, lint, types, meaningful tests and production build where applicable. Explain skipped checks and baseline failures.

## Structure and guidance

Use package-manager workspaces and Turborepo when several apps or shared packages justify them. `apps/` contains deployable units; `packages/` contains code with real shared consumers. Within source, prefer `contexts/<context>/features/<feature>/` with related code and tests together. Preserve framework routing conventions. Avoid empty folder scaffolds or making every context a package.

Share TypeScript, Oxlint, and formatter configuration from `configs/`. Use each tool's supported reuse mechanism and small consumer-specific overrides. Verify paths from root and app commands; not all tools support `extends`.

Create a mandatory root `AGENTS.md` as a readable letter. Begin with the user's working rules: low-complexity code, bounded changes, read-only questions, meaningful verification, careful Git operations, and the selected review process. Ask which agents are used and adapt their supported guidance discovery. Add local letters for distinct app/context/feature instructions without repeating inherited rules. Preserve authored guidance when adopting standards.

## Skills, local development and delivery

Install skills per repo for the selected agents. Default to Matt Pocock engineering skills plus his setup workflow; offer other groups. Frontends also use Emil Kowalski's official skills. Codegraph and Plannotator are defaults. Add relevant stack MCPs after checking current official support; a mentioned prerelease is not a permanent version pin.

Prepare Dockerfile/image build and Compose services the project actually needs, such as PostgreSQL/Mailpit. Ask about CI, with GitHub Actions prepared by default; retain existing CI unless replacement is agreed. Ask about image publishing, registry, and triggers. Yi prefers Harbor, Kubernetes and Argo CD with deployment configuration in a separate GitOps repo. App commits alone do not update deployment desired state. CI preparation does not authorize publishing, provisioning, or rollout. Reference secrets rather than storing credentials.

Ask conditional questions about authentication, observability, secrets, accessibility, database migration/recovery and end-to-end testing. Do not install unused services merely because they are in the baseline.

## Release with Changesets

Inspect the repository, then ask whether the owner intends to set up release automation. Until the answer is yes, do not install release dependencies, make release-coordination `package.json` mutations, initialize Changesets, change release workflows or credentials, publish, or deploy. A decline or deferral makes no release-configuration changes and records only the decision in `areas.release` of the target `.project-standards.json`; unrelated approved setup or migration work may continue.

After yes, complete the ordered owner interview and approve the target plan before any release mutation. Use GitHub Actions and Changesets for the approved scope. Ask the owner to select a root release or monorepo units, with optional named `fixed`, `linked`, `ignore` and private-unit behavior. Use one release owner per release path. Do not infer release units or create a generic deployment map.

The Python private `package.json` sidecar does not use or create a Python adapter; do not edit `pyproject.toml`, synchronize Python metadata, or claim PyPI support. Ask for the publication outcome, including registry, selected package(s), access level, and the exact target-owned publish command. Without registry, selected package, access level, authentication, or command, registry publication remains unconfigured; version PR and GitHub Release paths can still be selected. Ask for the channel, separate prerelease GitHub Release and registry-publication behavior, release-notes source, existing workflow authentication and confirmed release branch. Production is optional, target-owned, and trusts the selected Changesets release event with existing protections; prerelease production needs an explicit approved guard.

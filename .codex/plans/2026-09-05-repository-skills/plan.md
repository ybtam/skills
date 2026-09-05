# Repository skills and standards

Seven portable skills, followed by a website built with their setup workflow.

## 1. Outcome and review boundary

Create ybtam/skills as a Vercel-skills-compatible collection for setting up and modernizing repositories. Yi's personal baseline starts the conversation; an evidence-led questionnaire produces project standards suited to the user. Support single applications, multiple frontends, shared backends, and other stacks without requiring a full-stack architecture.

Deliver all seven skills before building the website in this repository. This review approves the implementation plan. Substantial target-project setup and migration plans still follow the chosen review process. Preparing CI does not authorize image publishing, infrastructure changes, or deployment.

This Markdown is canonical; the HTML renders the same content. Earlier interview notes are historical. This plan consolidates the latest decisions, including Plannotator setup.

## 2. Seven independently installable skills

| Proposed identifier | Responsibility | Completion evidence |
| --- | --- | --- |
| setup-repo | Inspect, interview, establish standards, configure agents/tooling, scaffold. | Choices recorded; applicable checks pass; integrations work. |
| adopt-standards | Bring an existing repo toward selected standards through a bounded migration. | Current behavior checked; plan reviewed; affected checks pass. |
| upgrade-standards | Compare applied standards with the current baseline and migrate selected areas. | Successful versions advance only for verified areas. |
| migrate-to-monorepo | Reorganize the existing app into workspaces and update affected paths/tooling. | Existing app still works; workspace dependencies and CI resolve. |
| install-project-skills | Install relevant skills for selected agents in project scope. | Official sources and agent discovery verified. |
| update-project-skills | Automatically update untouched skills; preserve local edits. | Updates verified; modified-skill conflicts reported. |
| update-dependencies | Update dependencies, including monorepos and major migrations. | Official migration guides followed; affected checks pass. |

Each SKILL.md has a distinct description and normal automatic discovery. Upstream prerequisites are explicitly installed when required. No entry point silently depends on an uninstalled sibling skill.

## 3. Portable baseline packaging

Maintain the baseline once under standards/. Maintain workflow instructions under skills/<name>/SKILL.md. A small Bun script copies each workflow's required references into its references/ directory. Commit those generated references so Git-based installation needs no build step. CI checks freshness by direct comparison; add no custom hashing mechanism.

Every installed skill contains its required local references, migration information, and assets. Local links cannot reach outside that skill folder. Do not assume this source repository or another skill is installed. External tools and skills come from official sources with explicit installation and verification steps. Use the Vercel CLI rather than building a dependency resolver or installer.

Validate discovery and individual installation with the Vercel CLI. Test isolated copy-style installs with the source repository unavailable. Check that development-installed upstream skills do not accidentally enter this repo's public discovery results; resolve collisions before publication.

Add a README with installation commands, catalog, maintenance, and contribution guidance, plus upstream attribution. Recheck the existing empty remote before initializing Git and connecting it. Preserve existing local skills and their lockfile. Remote publication is separate from this plan review.

## 4. Questionnaire and execution

Inspect → ask unresolved decisions → record project standards → review plan → apply → verify → record successful state.

Inspect existing tooling, package manager, apps, CI, agents, installed skills, and recorded decisions. Explain relevant options and recommendations. Ask in rounds with no dependency on unanswered questions in the same round. Reuse decisions unless requirements changed.

Cover purpose; clients; architecture and deployment boundaries; runtime/package manager; frameworks and APIs; contexts/features; lint/format rules; tests; authentication; observability; secrets; accessibility; database migration/recovery; agents; skills/MCP; local services; CI; registry; and deployment. Only activate relevant branches.

Use grill-with-docs behavior: record agreed domain terms promptly; create ADRs only for consequential trade-offs. Use Matt Pocock's setup skill for issue-tracker and domain-document configuration instead of copying that questionnaire. Preserve the mandatory root letter when integrating upstream output.

Yi's default review is canonical Markdown plus self-contained HTML in Plannotator. Other users may choose in-chat review. Record the choice. This repository requires .codex/plans/<date>-<slug>/ and an explicit approved structured result before implementation. Changes requested require revision and another review; approval notes guide implementation.

## 5. Personal baseline

| Area | Default and project decision |
| --- | --- |
| Runtime | Explain Node.js and Bun; user chooses. Latest Node LTS or stable Bun unless overridden. Update the project runtime before scaffolding/dependency installation, after inspection and review. Report existing incompatibilities with a proposed resolution first. Avoid changing unrelated projects' runtime. |
| Package manager | Explain pnpm and Bun separately from runtime; preserve existing choices unless migration is agreed. This repo uses Bun. |
| Frontend | TanStack Start or Next.js; relevant TanStack tools, shadcn/ui, ReUI, and Emil Kowalski skills. Select packages by need. |
| API/data | Ask about clients and shared backend. Hono where appropriate, optional oRPC, Zod, Drizzle/PostgreSQL when needed. MVC is not required. |
| Lint/format | Oxlint and Oxfmt. Perfectionist natural sorting directly through Oxlint's JS plugin support. No ESLint runner. Other rules depend on the project. |
| Verification | Format, lint, type checks, meaningful tests, production build. Vitest; Storybook for reusable UI; browser checks for critical journeys. |
| Monorepos | Package-manager workspaces and Turborepo when multiple apps/shared packages warrant them; shared configs/. |
| Guidance | Ask which agents are used, including multiple selections. Mandatory root AGENTS.md in letter format; local guidance only for distinct requirements. |
| Skills | Per-repo. Matt Pocock engineering skills and setup skill by default; offer other groups. Conditional stack-specific additions. |
| Integrations | Codegraph and Plannotator by default. Verify stack MCPs and skills from official current sources; Drizzle RC4 is an example, not a permanent version pin. |
| Local dev | Dockerfile and application image build; Compose services such as PostgreSQL/Mailpit only where needed. |
| Delivery | Ask; GitHub Actions prepared by default. Ask registry; Yi uses Harbor. Actual deployment is a user choice; Yi uses Kubernetes/Argo CD with a separate GitOps repo. |

## 6. Context-based structure and shared configs

```text
AGENTS.md
CONTEXT.md
standards/                 # maintained baseline and migration references
skills/
  setup-repo/
    SKILL.md
    references/            # packaged reference subset
  adopt-standards/
  upgrade-standards/
  migrate-to-monorepo/
  install-project-skills/
  update-project-skills/
  update-dependencies/
scripts/                   # small packaging/validation helpers
configs/
  typescript/
  oxlint/
  oxfmt/
apps/
  web/                     # after all seven skills pass verification
    src/
      contexts/
        catalog/
          features/
            browse-skills/
            skill-details/
        standards/
          features/
            read-standard/
packages/                  # only for real shared consumers
docs/
  adr/
.codex/plans/
```

Apps/packages define workspace boundaries. Contexts group domain responsibilities. Named feature folders co-locate related code and tests. Add internal directories only when useful; no empty feature template. Keep framework routing entry points where required. A context does not automatically become a package.

Shared TypeScript, Oxlint, and Oxfmt defaults use each tool's supported extension mechanism. Apps/packages retain small framework-specific settings. Verify relative paths and inheritance from root and app-local commands; do not assume every tool supports TypeScript-style extends.

Root guidance preserves Yi's working rules: readable low-complexity code, narrow scope, read-only questions, meaningful verification, careful Git boundaries, review gates, and proportional delegation. Local letters add distinct skill-authoring or app rules without repeating root instructions. Domain glossaries follow actual contexts; a monorepo alone does not require multiple domain glossaries.

## 7. Upstream skills, Codegraph, and Plannotator

Install Matt Pocock engineering skills from mattpocock/skills and invoke setup-matt-pocock-skills. Resolve current catalog names rather than treating a category as an installer selector. Frontend projects use emilkowalski/skills; verified examples include emil-design-eng, animate, review-animations, improve-animations, find-animation-opportunities, and animation-vocabulary. Reference upstream ownership on the website rather than maintaining copies.

Codegraph: verify official @colbymchenry/codegraph installation, initialize after source exists, ignore generated index data in Git, configure supported MCP integration for chosen agents, and verify an index/query. Preserve existing agent settings and report unsupported integrations.

Plannotator: inspect the current installation, install from official instructions if absent, configure supported selected-agent integrations, and verify CLI operation and structured HTML review decisions. Bundle review-generation and result-handling guidance so another user does not depend on Yi's globally installed html-plan skill. Explain any required user-level tool configuration separately from per-repo skills. Avoid overwriting existing settings or installing duplicate hooks.

## 8. Version tracking and migration paths

Propose a small JSON record at .project-standards.json. Fields: schemaVersion, baselineVersion, project choices, applied versions per area, and lastRun containing skill name/version, target, areas, status, checks, and unresolved items. No credentials. Git provides history; no custom event store.

Track structure, tooling, verification, agents, and delivery separately. Successful area versions advance only when required checks pass. Partial work preserves existing successful state. A Drizzle update with failing database tests remains incomplete. Validate schema versions and preserve unknown/newer data rather than silently rewriting it.

Compare recorded state and actual files with the bundled baseline. Prefer direct migration to latest. Review intervening changes for prerequisites and use intermediate steps only when required. Preserve project choices and exceptions. Bundle supported migration guidance; first release starts the history without claiming untested historical paths. Unknown versions or missing history require inspection and a proposal.

## 9. Existing repos and maintenance

Adoption: establish current behavior, agree the scope, and migrate without replacing architecture by default. Preserve unrelated edits. Report messy Git history/conflicts rather than creating a worktree to force resolution. Live changes remain separately authorized.

Monorepo conversion: move the existing app first; update imports, workspace dependencies, scripts, shared configs, tests, Docker contexts, and CI paths. Verify it before using setup to add apps. Introduce context/feature layout as agreed and extract packages only for actual consumers.

Dependency updates: inspect the workspace graph and constraints, consult official documentation/migration guides for every major update, group coupled packages, update the right lockfile, and check impacted dependents. Propose deprecated replacements explicitly. Report runtime incompatibility before changes; avoid unrelated bulk upgrades inside narrow fixes.

Skill updates: automatically update untouched skills during setup/migration and maintenance. Detect edits against the recorded upstream content using existing metadata or direct comparison; preserve edited copies and report reconciliation needs. Updating skills never silently adopts a new project baseline.

## 10. CI, Docker, and deployment ownership

Prepare GitHub Actions quality/build checks by default. Ask whether to publish, which registry, and branch/tag policy. Configure Harbor from answers, referencing CI secrets rather than embedding credentials. Do not enable publishing without the required choices and authorization.

Compose provides necessary local dependencies and documents environment/persistence behavior. Validate configuration and build the app image where a Docker engine is available. Report skipped execution accurately.

Yi's application repo produces images; the separate GitOps repo controls deployment references. App commits alone do not edit Argo CD desired state. Ask about promotion before enabling a GitOps update. No infrastructure provisioning or live rollout is implied by CI preparation.

## 11. Website evaluation after all skills

Run setup-repo here with recorded choices: Bun, workspaces/Turborepo, TanStack Start in apps/web, shared configs, root letter, and integrations. Do not repeat settled questions.

Build a static-content website with searchable catalog, skill details, copyable installation commands, baseline docs, and setup/migration guides. Generate content from published SKILL.md metadata and standards documents. Clearly label upstream references. Verify current TanStack Start prerender/static-output support; report a server requirement before changing the agreed hosting model.

Suggested pages: home/catalog, skill detail, standards, workflow guides. Provide keyboard navigation, useful empty search results, readable code blocks, and responsive layout. No accounts, saved questionnaires, database, native app, or shared backend in the first evaluation. Do not add unused local services.

Yi evaluates the result. The website proves this setup path, not every native/backend branch; use fixtures and later real projects for those.

## 12. Implementation order and verification

| Stage | Work | Exit condition |
| --- | --- | --- |
| 1. Foundation | Baseline, root letter, metadata, portable packaging, state schema. | References package independently; attempts and success are distinct. |
| 2. Compatibility | Perfectionist via Oxlint, shared configs, CLI discovery/copy installs, Codegraph, Plannotator. | Exact integrations verified or blockers reported; no ESLint fallback. |
| 3. All seven skills | Entry points, conditional references, migration instructions, small useful scripts. | Every skill independently usable and structurally valid. |
| 4. Behavior | Isolated setup/adoption, partial upgrades, monorepo moves, edited skills, major updates. | Outcome invariants hold; failures preserve accurate state. |
| 5. Website | Run completed setup skill and build catalog/docs site. | Content matches sources; UI/build checks pass; ready for Yi's review. |

Use Luna for bounded delegated work when useful and independent behavioral review. Keep simple tasks local; escalate only when needed.

Test reference closure, generated-content freshness, actual installation/discovery, natural-sort diagnostics/fixes and formatter interaction, shared-config resolution, reruns, local-edit preservation, failed-check state, and affected app behavior. Test outcomes rather than wording. Keep fixtures isolated and preserve unrelated work. Final reporting separates local checks, remote CI, publication, and deployment.

## 13. Risks and resolution rules

| Risk | Handling |
| --- | --- |
| Oxlint JS plugin bridge is alpha | Verify selected Perfectionist rules; report incompatibility before proceeding. No ESLint runner fallback. |
| Bundled references drift | Generate from one source; enforce freshness. |
| Upstream skills or agent integrations change | Verify official instructions and selected-agent discovery; preserve settings and local edits. |
| Migration partly fails | Keep successful versions unchanged where checks fail; record remaining work. |
| Config paths break after moves | Test root/app commands, dependent workspaces, and production builds. |
| TanStack Start output differs from hosting expectation | Verify prerender/static support before deployment choices; retain the user's framework choice. |

No further product decision blocks review. Credentials, registry endpoints, target-agent selection, and live deployment details belong to the relevant setup run. Compatibility checks are implementation work with explicit failure behavior, not assumptions of support.

## 14. Sources and evidence limits

- [Vercel discovery documentation](https://github.com/vercel-labs/skills/blob/main/README.md#skill-discovery) and [implementation](https://github.com/vercel-labs/skills/blob/main/src/skills.ts).
- [Matt Pocock skills](https://github.com/mattpocock/skills).
- [Emil Kowalski skills](https://github.com/emilkowalski/skills).
- [Perfectionist](https://github.com/azat-io/eslint-plugin-perfectionist) and [Oxlint JS plugins](https://oxc.rs/docs/guide/usage/linter/js-plugins.html).
- Codegraph distribution and CLI identity verified locally; current official installation instructions remain an implementation check.
- Local Plannotator help verifies annotate with --gate, --json, --require-approval, and --result-file; current agent integration instructions remain an implementation check.

# Official integrations

## Changesets

The canonical mutation gate is a completed ordered owner interview and an approved target plan; generic approval is not sufficient. Use one release owner per release path.

Do not install, initialize or change workflows until the owner interview is complete and the target plan is approved. Generic owner approval is not sufficient.

Before initialization or workflow changes, verify `@changesets/cli` with the target repository's existing package manager. Use that package manager for installation and Changesets commands; report an incompatibility before changing the repository.

Use the official [`changesets/action`](https://github.com/changesets/action) and `@changesets/cli` documentation. After the completed owner interview and approved target plan, install the CLI in the target repository, initialize it, and add only the selected GitHub Actions workflows. Inspect existing workflows and authentication first; preserve them unless replacement is agreed. Let Changesets select versions from its configured package descriptors. Do not add a deployment map or infer which apps release.

Choose one release owner per release path: the native Changesets action, or one repository-owned script that consumes Changesets versions and is safe to rerun without duplicate releases. Configure stable or prerelease behavior, release notes and the confirmed release branch from owner answers. A production workflow is separate and optional, triggered by the selected Changesets release event, with target-owned protections. Registry publication requires explicit registry, package selection, access and authentication answers; otherwise leave the publish job unconfigured.

Ask which agents the user uses and inspect current configuration. Skills are project-scoped; binaries and some agent settings may be user-scoped. Explain that distinction and preserve existing settings. Verify commands against current official help before execution. Avoid broad installers that configure agents the user did not select.

## Skills CLI and upstream collections

Use [Vercel skills](https://github.com/vercel-labs/skills). A current CLI invocation is `npx skills@latest add <source> --list`; with Bun, use its package runner only after confirming the CLI's Node runtime requirement is available. Select skill names and agents explicitly with `--skill` and `--agent`, keep default project scope, and inspect help for current flags. Do not assume a package runner changes the CLI's runtime requirements.

Install engineering skills from [mattpocock/skills](https://github.com/mattpocock/skills), including `setup-matt-pocock-skills`. Resolve current names from its catalog; offer non-engineering groups separately. Invoke that setup skill for issue-tracker/domain-document configuration. When its explicit-only policy requires user invocation, ask for that invocation; do not silently bypass its policy. Preserve mandatory root AGENTS.md even when other agent files already exist, because the project's agreed requirement controls our setup.

For a frontend, install relevant [emilkowalski/skills](https://github.com/emilkowalski/skills): `emil-design-eng`, `animate`, `review-animations`, `improve-animations`, `find-animation-opportunities`, and `animation-vocabulary` are verified catalog examples, not immutable future identifiers. Additional skills and MCPs follow the final stack. Use official maintained sources and record exact installed metadata.

At installation, resolve the chosen upstream revision and use the CLI's supported immutable source URL or revision selection. Record the actual source repository, commit, and skill path in `installedSkills` in the project's standards record. Verify the installed content against that revision. This makes later comparison possible even when the CLI lockfile only stores a computed hash; a hash cannot be turned back into a commit.

Verify installed skills are discoverable by every selected agent. Automatic maintenance applies to untouched skills. Before updating, compare content with the exact recorded upstream revision, including supporting files. If the source revision cannot be recovered, report that uncertainty and preserve the local copy. Skip modified skills with a reconciliation report; do not blanket-update first and detect loss afterward. Use existing installer metadata or direct comparison rather than adding custom hashes. Recheck discovery after updates. Record the new immutable revision only after installation verification. Baseline adoption remains a separate operation.

## Anti-slop

For JavaScript and TypeScript projects using or adopting Oxlint, install `install-anti-slop` from [dmmulroy/anti-slop](https://github.com/dmmulroy/anti-slop). Discover it with `npx skills@latest add dmmulroy/anti-slop --list`, then use `npx skills@latest add dmmulroy/anti-slop --skill install-anti-slop --agent <selected-agent>` with the project-scope and revision-verification process above. Verify the installed skill and its bundled assets; installing the skill alone does not configure lint rules.

Invoke the installed skill when the approved setup or migration includes anti-slop. If the host requires explicit invocation, request it and report execution as pending. Follow its current instructions to vendor the plugin, normally under `tools/oxlint/anti-slop/`, and merge it into existing Oxlint configuration alongside Perfectionist. Anti-slop has no official npm package. Match `@oxlint/plugins` exactly to the resolved `oxlint` version and keep both versions exact and upgraded together. Preserve existing configuration, ignores, and local plugin edits; review changes before replacing a vendored copy.

The upstream installer enables all generic rules at error severity. Enable the optional Effect plugin only for a direct `effect` package-manifest dependency or an explicit request, not a transitive lockfile entry. Resolve project-specific rule choices during planning. Run the target's lint and type checks, and its full `vp check` when using Vite+. Report remaining findings; cleanup requires that scope to be selected. Record the installed skill separately from the applied lint setup. Routine skill updates update the installer skill; vendored rules remain project-owned and require a separate reviewed change.

## React Compiler

When working with React, use the [Oxc React Compiler support guidance](https://oxc.rs/blog/2026-08-18-react-compiler-support). For approved Oxlint setup, verify that the installed version exposes the compiler-powered rules, then merge the `react` plugin and `categories: { correctness: "error" }` into the existing configuration, preserving agreed rule overrides and severities. Those recommended rules are mostly in `correctness`; enable `react/unsupported-syntax` explicitly for that recommended rule's coverage because it belongs to `restriction`. When migrating from the former nursery `react/react-compiler` rule, remove it and use the category-specific rules. Lint diagnostics do not enable automatic memoization.

If a transform is part of the approved setup, preserve the existing framework integration and verify it against the current tool versions. For Vite 8, the article's experimental integration uses a compatible `@vitejs/plugin-react` version starting at 6.1.0 with `react({ compiler: true })` and requires installing its optional `oxc-transform-react` peer. Check each framework's supported integration before configuring the transform. Verify lint in every React setup, and add type checks, meaningful tests, and a production build when a transform is configured.

## Codegraph

Official source: [colbymchenry/codegraph](https://github.com/colbymchenry/codegraph), package `@colbymchenry/codegraph`. Inspect `codegraph --help`, `init --help`, and `install --help`. Initialize only the intended project after source exists, exclude `.codegraph/` from Git, and verify status and an actual query. Configure selected agents using documented target/location options. Avoid `--yes` defaults that select all detected agents or global settings unintentionally. Preserve unrelated MCP entries. A server may require restart before verification; report pending verification accurately.

## Plannotator

Official source: [backnotprop/plannotator](https://github.com/backnotprop/plannotator), [installation docs](https://docs.plannotator.ai/open-source/start/installation). Inspect existing CLI first. The official installer supports `--minimal` to install only the binary; its full mode can configure detected agents and install extra tools. Prefer the minimal path plus explicit selected-agent setup when full-mode effects exceed the agreed scope. Download and inspect the script before running it. Use current official per-agent instructions, merge settings, and avoid duplicate hooks.

Verify `plannotator annotate --help`, then the approved review workflow in [questionnaire.md](questionnaire.md). Installation success alone does not prove that a selected agent can open a review or retrieve its decision. Record restart/manual steps when needed. Keep local HTML review available even if automatic plan-interception hooks are unsupported. Do not claim an unsupported hook is configured.

## Stack tools

Verify current official tool docs for selected runtime/framework/database versions. Drizzle skills/MCP availability is version-sensitive; check the chosen release instead of pinning an old prerelease example. Keep credentials in the user's secret mechanism, not project standards or skill references.

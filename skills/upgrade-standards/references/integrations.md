# Official integrations

Ask which agents the user uses and inspect current configuration. Skills are project-scoped; binaries and some agent settings may be user-scoped. Explain that distinction and preserve existing settings. Verify commands against current official help before execution. Avoid broad installers that configure agents the user did not select.

## Skills CLI and upstream collections

Use [Vercel skills](https://github.com/vercel-labs/skills). A current CLI invocation is `npx skills@latest add <source> --list`; with Bun, use its package runner only after confirming the CLI's Node runtime requirement is available. Select skill names and agents explicitly with `--skill` and `--agent`, keep default project scope, and inspect help for current flags. Do not assume a package runner changes the CLI's runtime requirements.

Install engineering skills from [mattpocock/skills](https://github.com/mattpocock/skills), including `setup-matt-pocock-skills`. Resolve current names from its catalog; offer non-engineering groups separately. Invoke that setup skill for issue-tracker/domain-document configuration. When its explicit-only policy requires user invocation, ask for that invocation; do not silently bypass its policy. Preserve mandatory root AGENTS.md even when other agent files already exist, because the project's agreed requirement controls our setup.

For a frontend, install relevant [emilkowalski/skills](https://github.com/emilkowalski/skills): `emil-design-eng`, `animate`, `review-animations`, `improve-animations`, `find-animation-opportunities`, and `animation-vocabulary` are verified catalog examples, not immutable future identifiers. Additional skills and MCPs follow the final stack. Use official maintained sources and record exact installed metadata.

At installation, resolve the chosen upstream revision and use the CLI's supported immutable source URL or revision selection. Record the actual source repository, commit, and skill path in `installedSkills` in the project's standards record. Verify the installed content against that revision. This makes later comparison possible even when the CLI lockfile only stores a computed hash; a hash cannot be turned back into a commit.

Verify installed skills are discoverable by every selected agent. Automatic maintenance applies to untouched skills. Before updating, compare content with the exact recorded upstream revision, including supporting files. If the source revision cannot be recovered, report that uncertainty and preserve the local copy. Skip modified skills with a reconciliation report; do not blanket-update first and detect loss afterward. Use existing installer metadata or direct comparison rather than adding custom hashes. Recheck discovery after updates. Record the new immutable revision only after installation verification. Baseline adoption remains a separate operation.

## Codegraph

Official source: [colbymchenry/codegraph](https://github.com/colbymchenry/codegraph), package `@colbymchenry/codegraph`. Inspect `codegraph --help`, `init --help`, and `install --help`. Initialize only the intended project after source exists, exclude `.codegraph/` from Git, and verify status and an actual query. Configure selected agents using documented target/location options. Avoid `--yes` defaults that select all detected agents or global settings unintentionally. Preserve unrelated MCP entries. A server may require restart before verification; report pending verification accurately.

## Plannotator

Official source: [backnotprop/plannotator](https://github.com/backnotprop/plannotator), [installation docs](https://docs.plannotator.ai/open-source/start/installation). Inspect existing CLI first. The official installer supports `--minimal` to install only the binary; its full mode can configure detected agents and install extra tools. Prefer the minimal path plus explicit selected-agent setup when full-mode effects exceed the agreed scope. Download and inspect the script before running it. Use current official per-agent instructions, merge settings, and avoid duplicate hooks.

Verify `plannotator annotate --help`, then the approved review workflow in [questionnaire.md](questionnaire.md). Installation success alone does not prove that a selected agent can open a review or retrieve its decision. Record restart/manual steps when needed. Keep local HTML review available even if automatic plan-interception hooks are unsupported. Do not claim an unsupported hook is configured.

## Stack tools

Verify current official tool docs for selected runtime/framework/database versions. Drizzle skills/MCP availability is version-sensitive; check the chosen release instead of pinning an old prerelease example. Keep credentials in the user's secret mechanism, not project standards or skill references.

# Yi's repository skills

Set up a repository, adopt project standards, or maintain an existing project through an evidence-led questionnaire. Defaults cover engineering practices, agent guidance and integrations as well as the application stack.

## Install

```sh
npx skills@latest add ybtam/skills --list
npx skills@latest add ybtam/skills --skill setup-repo
```

Select your agents and keep project scope. The repository must be published before the GitHub commands can install this implementation. For a local checkout, replace `ybtam/skills` with its absolute path.

The catalog contains nine skills: eight baseline skills and the specialized `tune-agent-instructions` audit skill.

| Skill                   | Use it for                                                                 |
| ----------------------- | -------------------------------------------------------------------------- |
| setup-repo              | A new project and agreed tooling, guidance and local workflow              |
| adopt-standards         | Bounded standards adoption in an existing repository                       |
| upgrade-standards       | Version-aware updates to selected standards areas                          |
| migrate-to-monorepo     | Moving an existing app into workspaces without changing its behavior       |
| install-project-skills  | Selecting and installing skills for your agents                            |
| update-project-skills   | Automatic upstream updates that preserve local edits                       |
| update-dependencies     | Dependency updates with documented major-version migrations                |
| release-with-changesets | Target-repository Changesets release setup and GitHub Actions release CI   |
| tune-agent-instructions | Auditing and improving agent guidance while preserving explicit boundaries |

## Tune agent guidance

Install `tune-agent-instructions` to audit AGENTS.md, skills, and prompts using the [official Astra prompting guidance](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-6-astra). It reports source-grounded findings by default and edits only when requested, preserving explicit project boundaries.

```sh
npx skills@latest add ybtam/skills --skill tune-agent-instructions
```

## How it works

Inspect the repository, answer unresolved questions, review a concrete plan, apply it, and verify the result. Defaults are recommendations; project choices persist separately in `.project-standards.json`. Plannotator is the default review tool. Skills install per repository; Codegraph and Plannotator setup are included. Publishing and deployment are separate decisions.

The personal baseline lives in [standards](standards/baseline.md). Setup and maintenance skills bundle the shared baseline references. Specialized skills carry their own references, so each installed skill works on its own. Edit source references and run `bun run skills:bundle`; `bun run check` checks freshness, portability, types, tests and lint/format.

Use Bun 1.4.2 as recorded in `.bun-version`, then `bun install --frozen-lockfile`. Applications live in `apps/`, shared config in `configs/`, and shared packages are added only for actual consumers.

## Upstream sources

Setup uses [Matt Pocock's engineering skills and setup workflow](https://github.com/mattpocock/skills). Frontends use [Emil Kowalski's design and animation skills](https://github.com/emilkowalski/skills). These remain owned and distributed upstream; this repository references them rather than republishing their contents.

[Codegraph](https://github.com/colbymchenry/codegraph) and [Plannotator](https://github.com/backnotprop/plannotator) are configured from their official instructions for the agents you select.

## Website and local container

The original seven baseline skills were implemented and checked before the website setup. The current collection has eight baseline skills plus the specialized `tune-agent-instructions` skill (nine skills total). The TanStack Start app prerenders the catalog and full standard documents from repository sources.

```sh
bun run dev
bun run build
# Build and serve the static image locally (default port 4178):
docker compose up --build
```

`configs/` holds the shared TypeScript, Oxlint, Oxfmt and static-server settings. Oxfmt uses `.formatterignore` from the root because config-local ignore patterns cannot reach outside their directory. Perfectionist natural import and named-import sorting runs in Oxlint; named-import suggestions require a separate `--fix-suggestions` pass after `--fix` when applying fixes.

GitHub Actions is prepared for checks, static generation and image build. It does not publish an image or alter a GitOps repository. See [verification](docs/verification.md) for the checks performed and delivery limits.

## GitHub Pages

The Pages URL is [ybtam.github.io/skills](https://ybtam.github.io/skills/). The workflow validates both hosting variants on pushes and pull requests. Successful `main` runs deploy the Pages artifact; manual runs deploy only when run against `main`. Pull requests never deploy.

```sh
# Build for the repository's GitHub Pages URL:
SITE_BASE_PATH=/skills/ bun run build
# Build for Docker or another root-path host:
bun run build
```

`SITE_BASE_PATH` must start and end with `/`. It controls assets, routing, document links and the 404 recovery link, and is part of the build cache key. The output stays in `apps/web/dist/client`; upload that directory itself rather than nesting it under another `skills/` folder. GitHub Pages serves its `404.html` for unknown paths.

Pages must be configured with **GitHub Actions** as the repository's build source. The deployment uses the `github-pages` environment and the official upload/deploy actions. Docker remains an independent option; neither Pages deployment nor application commits change Harbor or a GitOps repository.

## Website theme

The website uses the Iris light and dark palettes from [T3 Code](https://github.com/pingdotgg/t3code/blob/f8b4c464b4760d73e0ece7e68011c738803d8b69/packages/shared/src/themePalettes.ts), copyright 2026 T3 Tools Inc., under its [MIT license](apps/web/public/licenses/t3code-MIT.txt). Only the relevant palette values are copied. The System / Light / Dark selector saves a local preference; System follows the operating system. The same palette and preference apply to the static 404 page.

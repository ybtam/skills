---
name: install-project-skills
description: Select and install official skills for the repository's agents, verify discovery and integrations, and preserve existing project configuration.
metadata:
  version: 0.1.0
---

# Install project skills

Use this skill when a repository needs agent skills installed in project scope. This entrypoint works independently of other repository skills.

1. Inspect agents, existing project skills, lockfiles, package manager, stack, and current configuration. Ask which agents and skill groups apply; reuse recorded choices when present. Read [references/questionnaire.md](references/questionnaire.md) for relevant selection questions.
2. Resolve current catalog names from official sources. Install Matt Pocock's engineering skills through the Vercel CLI and invoke `setup-matt-pocock-skills` when selected. For JavaScript/TypeScript projects using or adopting Oxlint, include `install-anti-slop` from `dmmulroy/anti-slop` using [references/integrations.md](references/integrations.md#anti-slop). Installing that skill does not apply its lint configuration. Offer Emil Kowalski's official skills for frontend work and other official groups only when relevant. Do not copy or depend on a sibling skill in this collection.
3. Read [references/integrations.md](references/integrations.md) for Vercel discovery/copy-install verification, Codegraph, Plannotator, and selected-agent MCP setup. Preserve existing agent settings and hooks; resolve discovery collisions so development-installed upstream skills do not enter the repository's public catalog accidentally.
4. Install to the agreed project scope using the Vercel CLI, with official source and exact skill identifier recorded. Verify each installed skill is discoverable and usable when the source repository is unavailable. Keep generated indexes and credentials out of Git.
5. Run relevant skill checks and record the selected skills, source ownership, agent integrations, and verification result. Do not silently alter the project's standards baseline or enable publishing/deployment.

Completion means every selected skill is installed from an official source, independently discoverable by the intended agent, integration checks pass or are clearly reported, and existing configuration is preserved.

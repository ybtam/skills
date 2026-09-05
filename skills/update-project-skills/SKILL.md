---
name: update-project-skills
description: Update untouched project skills from official sources while preserving local edits and reporting reconciliation conflicts.
metadata:
  version: 0.1.0
---

# Update project skills

Use this skill for routine maintenance of project-scoped agent skills. Updating skills does not update the repository's standards baseline.

1. Inspect installed skills, source metadata or recorded upstream content, lockfiles, agent discovery, and the working tree. Read [references/state.md](references/state.md) for provenance and unknown-version handling.
2. Resolve current official sources and catalog identifiers. Read [references/integrations.md](references/integrations.md) when verifying Vercel CLI discovery, selected agents, Codegraph, Plannotator, or MCP integrations. Preserve existing agent configuration and hooks.
3. Compare each installed copy with its recorded upstream content using available metadata or direct comparison. Update untouched skills automatically through the Vercel CLI. Keep locally modified skills at their current content, identify the upstream delta, and report a reconciliation path for the owner.
4. Verify discovery and isolated copy-style installation with the source repository unavailable. Check that updates have not introduced duplicate or colliding public skill names. Keep credentials and generated Codegraph data out of Git.
5. Run relevant skill and integration checks, then record updated versions, preserved local edits, conflicts, and failures. Do not silently adopt a new project baseline or modify unrelated source.

Completion means every untouched selected skill is updated and verified, every local edit is preserved and reported, and the recorded maintenance result is accurate.

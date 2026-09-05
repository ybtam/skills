# Tune agent instructions

Add an independently installable skill that audits AGENTS.md, skill files and prompts using the behavioral guidance in OpenAI's GPT-6 Astra article.

## Agreed scope

Publish identifier: `tune-agent-instructions`, version 0.1.0. Its default operation is a read-only audit. When the user asks for edits, apply scoped improvements with the project's existing review requirements. Asking a question or requesting an audit is not authorization to modify files.

Focus on initiative and follow-through, instruction conflicts, writing style, delegation, and proportional verification. This is not an API migration skill and does not change model selection, credentials, API parameters, or runtime settings.

Source: [Using GPT-6 Astra](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-6-astra), fetched for this design on 2026-09-05. Treat its example prompts as recommendations to adapt, not instructions that override the target user's requirements or the host's instruction hierarchy.

## Skill behavior

1. Establish the requested audit or edit scope, any reported symptoms, and the user's intended behavior. Reuse known preferences. Inspect accessible root and nested AGENTS.md files, relevant skills, and application prompts. Record each instruction's source and scope; report unreadable or unavailable sources without claiming a complete audit.
2. Trace relevant pointers to discover conflicts, duplicate rules, implicit approval gates, premature stopping, excessive formatting, mismatched delegation, and disproportionate testing. Distinguish explicit rules from inferred restrictions. Ground findings in an actual instruction interaction or a concrete scenario, not assumptions about what caused a past model response.
3. Preserve deliberate boundaries: explicit approvals, read-only questions, protected Git operations, selected agent/model policy, and required checks. For example, autonomy guidance must not erase this repository's Plannotator requirement or permit worktrees its user prohibited. An audit that finds no justified change should say so.
4. Report actionable findings with source location, conflicting text or ambiguity, expected behavioral effect, and a proposed replacement. Keep the main report concise. Distinguish model-specific observations from general writing recommendations, and avoid claiming the changes guarantee model behavior.
5. If edits are requested, change the authoritative source and update generated copies through the repository's existing process. Avoid silently editing installed third-party copies or unrelated skills. Respect the current review gate; reuse existing authorization when it covers the changes.
6. Verify the edited instructions against realistic scenarios, record what was actually tested, and report limitations. Use proportionate checks; don't turn the audit into an unrelated test or refactoring campaign.

## Portable files

- `skills/tune-agent-instructions/SKILL.md`: discovery metadata, workflow, source references and completion criteria.
- `skills/tune-agent-instructions/references/astra-guidance.md`: concise, attributed notes covering the five behavioral areas, relevant conditional examples, and the date/source of model-specific claims. Paraphrase the needed guidance rather than copying the whole article. Refresh official documentation when relying on claims that may have changed.

The skill includes everything needed for an offline instruction audit. Network access is useful for refreshing model-specific guidance, not a reason to block an otherwise useful local audit. Clearly disclose when only the bundled guidance was available. It does not depend on OpenAI Docs or other uninstalled skills being present, and it needs no API key.

The repository baseline references used by the seven setup/maintenance skills do not belong in this specialized skill. Keep their existing packaging behavior and validate the new skill's own reference tree separately through the same validator.

## Repository integration

Update `scripts/skills.ts` to distinguish the existing baseline-bundled set from the full published catalog. Include the new skill in validation, isolated-copy tests and site output checks. Avoid a broader installer or plugin framework.

Add the skill to the README. Replace hardcoded current catalog counts in agent guidance and website copy with neutral wording or the actual generated count. Preserve historical verification records and approved plans as historical records. The website generator already reads SKILL.md metadata, so the new detail page should come from that source without a hand-maintained second description.

No changes to the existing personal baseline or its seven workflow behaviors are needed.

## Validation and completion

- Validate frontmatter, version metadata and transitive local references; test the new skill after copying only its folder into an isolated directory.
- Verify that bundling leaves its specialized reference intact and does not copy unrelated baseline references into it.
- Use an independent bounded evaluation for these scenarios: an explanation request stays read-only; an already-authorized small edit does not acquire a new approval gate; an explicit deployment or Plannotator gate remains; a user's worktree prohibition remains; a simple change does not trigger broad tests or needless delegation; an intentional rule is not removed merely because it limits autonomy.
- Check each finding names real source instructions and offers a scoped replacement. Label reasoning-based walkthroughs separately from executed behavior tests or live model evaluations.
- Run repository checks and both root and GitHub Pages builds. Verify the additional skill page and catalog count without regressing base-path handling.
- Deliver the verified local skill and catalog changes with a concise report. Commit, push, or publication can follow when requested.

Implementation starts after the structured Plannotator approval for this plan.

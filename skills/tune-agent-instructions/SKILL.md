---
name: tune-agent-instructions
description: Audit AGENTS.md, skills, and prompts for conflicting rules, unnecessary pauses, writing style, delegation, and excessive verification; revise them when the user requests changes.
metadata:
  version: 0.1.0
---

# Tune agent instructions

Use this workflow when the user wants to improve agent guidance or investigate instruction-related behavior. Default to a read-only audit. An explanation or audit request does not authorize edits.

## Inspect the intended behavior

Establish the requested files, symptoms, and desired behavior from the conversation. Ask only when an unresolved choice changes the audit. Read the target's root and relevant nested guidance, referenced skills, and application prompts that are accessible. Follow pointers relevant to the reported behavior; record source paths, scope, and any inaccessible sources. Do not claim coverage of hidden host instructions.

Read [Astra guidance](references/astra-guidance.md) for the five behavioral areas, conditional examples, and the official source. Use the bundled notes for an offline audit. Refresh the official page when relying on current model-specific claims; disclose when that refresh was unavailable.

## Trace the instructions

For each candidate issue, identify the actual instructions and the scenario in which they interact. Distinguish explicit requirements from inferred restrictions. Look for conflicting or repeated rules, premature stopping, unclear approval boundaries, unwanted formatting, poorly scoped delegation, and verification unrelated to the change.

Evaluate instructions within the host's instruction hierarchy and the user's authorized scope. Preserve deliberate constraints, required checks, chosen models, read-only questions, Git boundaries, and explicit review gates. The article's autonomy examples are options to adapt, not permission to remove these rules. A bounded preference is not a defect merely because it limits autonomy.

Report only justified findings. For each, give the source location, a short quote or precise description, the concrete behavioral risk, and a proposed replacement with its intended effect. Separate observed failures from plausible explanations; source inspection alone cannot prove why a model paused. If no change is justified, say so.

## Revise only when requested

For an audit, stop after the findings and proposed text. For a request to edit, follow the project's applicable review process and reuse approval already granted for that scope. Change the authoritative source, then regenerate distributed copies through its existing tooling. Treat installed third-party skills as upstream material: propose a local override or an upstream change rather than silently rewriting their installed copies.

Keep each rule in one authoritative place, preserve the user's writing format, and make the smallest changes that address the findings. If a rule requires another decision, name its exact source and wording and explain what remains unresolved. Do not add new approval gates merely because a recommendation is optional.

## Verify the outcome

Re-evaluate representative scenarios: an explanation request stays read-only; an already-authorized small edit can finish without repeated permission; explicit review and deployment gates remain; protected Git operations remain protected; delegation follows the chosen policy; and testing fits the change while completing required checks.

Use existing document, packaging, and behavioral checks where relevant. Identify which checks ran, which scenarios were reasoning-based walkthroughs, and what remains uncertain. Do not claim live model evaluation without running one. Completion means the requested audit is source-grounded, or the requested edits are applied within scope and verified without weakening deliberate boundaries.

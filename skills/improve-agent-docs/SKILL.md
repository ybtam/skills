---
name: improve-agent-docs
description: Create, audit, or refactor AGENTS.md and CLAUDE.md for accurate, focused instructions, clear scope, and task-specific references. Use for instruction-file organization and compatibility, rather than diagnosing broader prompt or model behavior.
metadata:
  version: 0.1.0
---

# Improve agent docs

Use the best model available in the host for authoring or revising agent instruction files. Improve the requested documents without expanding the task into a repository rewrite. An audit or explanatory question is read-only; an edit request follows existing authorization and applicable project review gates.

## Establish what actually loads

Inspect the requested repository and relevant ancestor, root, and nested instructions, including AGENTS.md, CLAUDE.md, applicable overrides, linked documents, imports, and symlinks. Distinguish repository guidance from personal, managed, vendor, and generated files. Report inaccessible sources rather than claiming complete coverage. Preserve unrelated work.

Read [compatibility notes](references/compatibility.md) when both formats, imports, or agent discovery matter. Check the target host and configuration before assuming discovery or precedence. Follow relevant references, detecting broken targets and cycles; do not load every unrelated document merely because it exists. Inspect scripts, configuration, and source to verify claims about commands and project behavior. Do not run state-changing commands merely to audit documentation.

## Decide what belongs where

Identify the concrete problem before changing text. For each proposed change, explain whether an instruction stays, moves, merges, or is removed, and why. Resolve apparent contradictions through actual scope and host instruction priority first. Ask the user only about unresolved choices that materially affect the result; preserve those rules until resolved. Concision does not justify deleting deliberate boundaries.

Keep the root useful at task start: project purpose, relevant tool choices, essential commands or their clear location, and repository-wide constraints. Keep authorization, destructive-operation, and review requirements easy to find. Preserve the user's writing format and terminology.

Use task-triggered Markdown links for conditional guidance: explain when to read each target. Reuse existing documents before creating another. Put local rules at the narrowest supported scope with distinct requirements; avoid repeating inherited policy. A referenced document should be reachable from the entrypoint that needs it. Moving everything into an eagerly loaded import does not reduce loaded context.

Remove demonstrably stale or duplicated content, vague filler, and unnecessary source-tree inventories. Prefer stable domain concepts and verified capabilities. Retain precise paths when they are useful navigation or operational requirements. Do not impose a word quota, invent project facts, or treat every personal preference as a universal standard.

## Apply the authorized changes

For an audit, return findings and proposed changes without editing. For an implementation request, reuse approval already granted for that scope. Preserve unique CLAUDE.md instructions and existing discovery arrangements; do not overwrite a file with a link or import without reconciling its contents and consumers.

Edit authoritative sources and regenerate distributed copies through the project's tools. Do not directly rewrite personal guidance, managed policy, third-party installations, or generated artifacts as part of a repository cleanup. Report any relevant limitation instead. A new file should contain only supported instructions, with conditional references where useful; an already focused file can stay unchanged.

## Verify and report

Check changed links and imports from their containing files, including transitive targets and cycles. For packaged skills, verify reference closure after an isolated copy. Review the effective root-plus-local instructions, not just each file separately, and compare the retained meaning with the original constraints.

Walk through the relevant cases: an audit stays read-only; an authorized edit can finish; unresolved contradictions remain visible; documented commands match the repository; nested instructions retain their scope; unique Claude guidance survives; and required approval and Git boundaries remain intact. Use existing checks appropriate to the changed files. Avoid tests that merely match wording.

Report changed files, meaningful moves/removals, actual checks, and limitations. Distinguish a reasoning walkthrough from a live model evaluation and document validation from proof that a host loaded the instructions. Do not claim performance or token savings without measuring them.

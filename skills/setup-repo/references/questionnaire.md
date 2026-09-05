# Inspect, interview, review

## Before questions

Read available project guidance, recorded standards, runtime/lockfiles, workspace layout, CI, agent configuration, and Git status. Facts are the agent's work. Preserve unrelated edits; a wrong repository or unresolved Git conflict needs the user's attention. Do not migrate while answering an explanatory question.

Ask unresolved decisions in rounds. Explain each relevant option and recommend an answer. Questions in a round must not depend on other unanswered questions in that round. Reuse prior answers. End the interview when the relevant branches below are settled, summarize the agreement, then prepare its review.

## Branches

- Purpose and topology: users, deliverables, single/multiple apps, web/native clients, shared backend, deployment units, context and feature boundaries.
- Tooling: runtime and release channel, package manager, frameworks, API/contracts, persistence, relevant UI tools, lint/format rules, shared config.
- Verification: meaningful test scope, browser journeys, Storybook needs, accessibility, existing failing checks.
- Operations: auth, observability, secrets, database migration/recovery, local Compose services, CI provider, registry/publication policy, deployment owner.
- Agents: selected agents, existing guidance, letter-style root AGENTS.md, distinct local guidance, skills and MCP support, review method.
- Migration only: current behavior, exceptions to retain, permitted scope, version history, rollback/recovery and completion evidence.

For issue tracking and domain-document setup, install and run Matt Pocock's `setup-matt-pocock-skills` using [integrations.md](integrations.md); do not recreate its questionnaire. Respect its user-invoked policy: request that invocation when the host requires it. Existing explicit authorization and decisions should be reused.

Record agreed domain language in CONTEXT.md, or follow an existing CONTEXT-MAP.md. Keep glossary terms separate from implementation plans. Add ADRs only when a decision is costly to reverse, surprising without context, and involves a real trade-off.

## Plan review

Yi's default is Plannotator; another user may choose in-chat approval. Save the chosen method in project choices. For Plannotator, prepare canonical `plan.md` and an equivalent self-contained `plan.html` under `.codex/plans/<date>-<slug>/`. Include scope, steps, affected boundaries, verification, risks, and open decisions. HTML needs responsive layout, accessible contrast, dark mode and a persistent theme switch; no external assets. Generate from the Markdown rather than maintaining divergent plans.

Run `plannotator annotate <plan.html> --gate --json --require-approval --result-file <review.json>`. Give the user the actual session URL if the browser is not visible. Wait for the decision. `approved` allows the agreed work; carry notes into implementation. Changes requested mean revise Markdown/HTML and repeat review. Closing without approval is not approval. Read the structured result even when the command exits nonzero. For in-chat review, obtain explicit approval of the concrete plan.

## Completion

Apply only agreed changes, verify affected behavior, and update successful state using [state.md](state.md). Resolve failures within scope; report a proposed resolution if a new decision is needed. Distinguish local checks, unavailable checks, remote CI and external actions. Do not repeatedly ask permission already granted.

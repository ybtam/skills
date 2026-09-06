# Inspect, interview, review

Inspect the repository, then ask whether the owner intends to set up release automation. If the answer is yes, begin this ordered interview: (1) topology and selected units, including fixed, linked, ignored and private-unit handling; (2) publication outcome, including registry, selected package(s), access level, and the exact target-owned publish command when publication is selected; (3) one release owner; (4) stable or prerelease channel, with separate prerelease GitHub Release, registry-publication and production answers; (5) release-notes source; (6) existing workflow authentication; (7) confirmed release branch; and (8) optional repository-owned production. Release setup becomes eligible only after every decision is settled and the target plan is approved. Keep the setup conditional and do not infer an answer.

For `setup-repo`, install and verify the selected skills before triggering `grill-with-docs`. Request explicit invocation when the host requires it; keep the bundled questionnaire fallback available when the skill cannot be invoked. For `adopt-standards`, `setup-repo`, `upgrade-standards` and `migrate-to-monorepo`, inspect release capability and ask whether the owner intends to set up release automation. A yes answer begins the ordered release interview; setup is eligible only after all decisions are settled and the target plan is approved.

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

Use the best model available in the host to generate every plan artifact.

Yi's default is Plannotator; another user may choose in-chat approval. Save the chosen method in project choices. For Plannotator, prepare canonical `plan.md` and an equivalent self-contained `plan.html` under `.codex/plans/<date>-<slug>/`. Include scope, steps, affected boundaries, verification, risks, and open decisions. HTML needs responsive layout, accessible contrast, dark mode and a persistent theme switch; no external assets. Generate from the Markdown rather than maintaining divergent plans.

Run `plannotator annotate <plan.html> --gate --json --require-approval --result-file <review.json>`. Give the user the actual session URL if the browser is not visible. Wait for the decision. `approved` allows the agreed work; carry notes into implementation. Changes requested mean revise Markdown/HTML and repeat review. Closing without approval is not approval. Read the structured result even when the command exits nonzero. For in-chat review, obtain explicit approval of the concrete plan.

## Completion

Apply only agreed changes, verify affected behavior, and update successful state using [state.md](state.md). Resolve failures within scope; report a proposed resolution if a new decision is needed. Distinguish local checks, unavailable checks, remote CI and external actions. Do not repeatedly ask permission already granted.

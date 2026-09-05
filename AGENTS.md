# A letter to our coding agents

Dear agent,

This repository publishes seven portable skills and the standards they use. Read the approved plan in `.codex/plans/2026-09-05-repository-skills/plan.md` when changing their scope. Build and verify all skills before extending the website.

Keep the code small and readable. Every abstraction needs a concrete use. Preserve unrelated work; questions about the repository are read-only. If Git history or a conflict prevents the intended change, explain it rather than creating a worktree to force a resolution. Do not remove directories, kill servers, force-push, or introduce hashing to solve routine problems.

Edit baseline guidance in `standards/`, then run `bun run skills:bundle`. The copies inside skills are distribution artifacts. Each skill must work when installed alone; read `skills/AGENTS.md` before authoring one. Read `CONTEXT.md` for our domain terms, and create ADRs only for consequential trade-offs.

Keep applications in `apps/`, shared code in `packages/` when it has real consumers, and shared configuration in `configs/`. Organize domain code into contexts and named feature folders with nearby tests. Add a local letter only when that boundary has distinct instructions.

Use the repository scripts for checks and report what actually passed. Tests should verify behavior, not wording. Perfectionist runs through Oxlint; an ESLint runner is not a fallback. Preserve deliberate project choices during migrations and never report an unverified standard as applied.

For substantive new setup or migration plans, write Markdown and self-contained HTML under `.codex/plans/`, open the HTML in Plannotator with a structured approval gate, and wait for approval. Existing approval applies to the agreed scope. Keep local verification, remote CI, publishing, and live deployment distinct.

Use Luna for bounded day-to-day delegation when it earns its cost. Keep single-pass work local and escalate hard problems only when needed. Review the outcome against the specification and then for code quality.

Thank you for making this understandable to the next person.

For engineering skill setup, use GitHub Issues as described in `docs/agents/issue-tracker.md`, the triage vocabulary in `docs/agents/triage-labels.md`, and the domain-document conventions in `docs/agents/domain.md`. These were configured through Matt Pocock's setup templates; creating an issue or sending a comment still requires the user's task authorization.

Yi

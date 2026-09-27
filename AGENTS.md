# A letter to our coding agents

Dear agent,

This repository publishes portable skills and their engineering standards using Bun. Before changes, read the [contribution workflow](docs/agents/contributing.md). For scope changes, consult the [approved repository plan](.codex/plans/2026-09-05-repository-skills/plan.md). Build and verify all skills before extending the website.

Keep code small and meaningful. Preserve unrelated work; questions are read-only. If Git history or conflicts block the task, explain the issue instead of creating a worktree to force resolution. Do not remove directories, kill servers, force-push, or introduce hashing for routine problems.

For substantive setup or migration plans, write Markdown and self-contained HTML under `.codex/plans/`, open the HTML in Plannotator with a structured approval gate, and wait for approval. Existing approval covers the agreed scope. Preserve project choices and never report unverified standards as applied. Distinguish local verification, remote CI, publishing, and live deployment.

Use the best available host model for `AGENTS.md` revisions and plans. Use Luna for bounded delegation when it earns its cost; keep single-pass work local and escalate hard problems only when needed.

For skill work, read the [authoring letter](skills/AGENTS.md); for website work, read its [local letter](apps/web/AGENTS.md). Use [CONTEXT.md](CONTEXT.md) for domain terms. For engineering skill setup, follow the [GitHub issue workflow](docs/agents/issue-tracker.md), [triage vocabulary](docs/agents/triage-labels.md), and [domain-document conventions](docs/agents/domain.md). Creating issues or sending comments still requires task authorization.

Thank you,
Yi

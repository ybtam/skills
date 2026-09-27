# Instruction discovery and compatibility

Use these notes for AGENTS.md / CLAUDE.md compatibility decisions. They are a documentation snapshot checked on 2026-09-27, not proof of the target installation's behavior. Refresh official documentation when relying on version-specific behavior. Offline, state that discovery remains unverified and preserve the existing arrangement.

The [Claude Code memory documentation](https://code.claude.com/docs/en/memory#agentsmd) describes native AGENTS.md support from v2.1.277, subject to session support and configuration. By default, relevant CLAUDE.md or CLAUDE.local.md files can change whether AGENTS.md loads. Inspect the target environment before adding or removing compatibility files.

Claude's `@path` imports load content eagerly, relative to the importing file. A Markdown link is a reading pointer, not an equivalent import. Where native discovery is unavailable, an explicit import can bridge to a canonical AGENTS.md. Preserve unique Claude instructions, inspect nested scopes, avoid cycles, and verify loading in the host when available. A symlink also needs platform and consumer checks; do not replace an existing file blindly. Do not change global settings as a side effect of document cleanup.

For Codex-specific discovery or override questions, consult the [official AGENTS.md guide](https://developers.openai.com/codex/guides/agents-md). Other agents may use different loading rules; do not infer their behavior from Claude's.

## Source and adaptation

Matt Pocock's [A Complete Guide To AGENTS.md](https://www.aihero.dev/a-complete-guide-to-agents-md) informs the focused-entrypoint and progressive-disclosure approach. This skill adapts those ideas to the target repository's existing policies. The article's compatibility examples are historical advice; use current host documentation for support claims. Its suggested instruction budget is not an acceptance threshold.

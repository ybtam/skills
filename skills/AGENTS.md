# A letter to skill authors

Dear agent,

Write each skill for someone who installs only that folder. Link bundled references with a clear reason to read them. Use the exact official upstream source when installing prerequisites; do not assume another skill is already present.

Keep workflow instructions here and baseline decisions in `standards/`. Run the packaging script after editing the source references. The generated `references/` copies are committed so installation from Git requires no build.

Test actual decisions and portability. A failed check must not become a successful migration record. Preserve local skill edits before any update command. When a host requires explicit invocation of an upstream skill, request it instead of claiming it ran.

Thank you,
Yi

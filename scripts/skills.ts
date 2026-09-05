import { access, mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, isAbsolute, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";

export const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const baselineNames = [
  "setup-repo",
  "adopt-standards",
  "upgrade-standards",
  "migrate-to-monorepo",
  "install-project-skills",
  "update-project-skills",
  "update-dependencies",
];

export const names = [...baselineNames, "tune-agent-instructions"];

export async function validateSkill(folder: string) {
  const entry = await readFile(resolve(folder, "SKILL.md"), "utf8");
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(entry);
  if (!match) throw new Error(`Missing frontmatter: ${folder}`);
  const meta = parse(match[1]!);
  if (
    typeof meta?.name !== "string" ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(meta.name) ||
    typeof meta.description !== "string" ||
    !meta.description.trim() ||
    typeof meta.metadata?.version !== "string"
  ) {
    throw new Error(`Invalid skill metadata: ${folder}`);
  }
  const visited = new Set<string>();
  async function visit(file: string) {
    if (visited.has(file)) return;
    visited.add(file);
    const source = await readFile(file, "utf8");
    for (const link of source.matchAll(/\]\(([^)]+)\)/g)) {
      const target = link[1]!;
      if (/^(?:https?:|mailto:|#)/.test(target)) continue;
      const path = decodeURIComponent(target.split("#")[0]!);
      const full = resolve(dirname(file), path);
      const rel = relative(folder, full);
      if (isAbsolute(path) || rel.startsWith("..") || isAbsolute(rel)) {
        throw new Error(`Reference escapes installed skill: ${target}`);
      }
      await access(full);
      if (full.endsWith(".md")) await visit(full);
    }
  }
  await visit(resolve(folder, "SKILL.md"));
  return { name: meta.name as string, files: visited.size };
}

export async function bundle(base: string, check: boolean) {
  const references = (await readdir(resolve(base, "standards"))).filter((f) => f.endsWith(".md"));
  for (const name of names) {
    const folder = resolve(base, "skills", name);
    if (!check) await mkdir(resolve(folder, "references"), { recursive: true });
    for (const reference of baselineNames.includes(name) ? references : []) {
      const source = await readFile(resolve(base, "standards", reference), "utf8");
      const destination = resolve(folder, "references", reference);
      if (check) {
        if ((await readFile(destination, "utf8")) !== source) {
          throw new Error(`Stale reference: ${name}/${reference}; run skills:bundle`);
        }
      } else await writeFile(destination, source);
    }
    const result = await validateSkill(folder);
    if (result.name !== name) throw new Error(`Folder/name mismatch: ${name}`);
  }
}

if (import.meta.main) {
  const mode = process.argv[2];
  if (mode !== "bundle" && mode !== "check") throw new Error("Use bundle or check");
  await bundle(root, mode === "check");
  console.log(`${mode}: ${names.length} portable skills verified`);
}

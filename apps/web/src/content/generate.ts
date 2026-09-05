import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";

const root = fileURLToPath(new URL("../../../..", import.meta.url));
const skillsRoot = join(root, "skills");
const standardsRoot = join(root, "standards");
const output = join(root, "apps/web/src/content/generated.ts");

const frontmatter = (source: string) => {
  const match = source.match(/^---\n([\s\S]*?)\n---/);
  return parse(match?.[1] ?? "");
};

const titleFor = (slug: string) =>
  slug
    .split("-")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
const skillDirs = (await readdir(skillsRoot, { withFileTypes: true })).filter((entry) =>
  entry.isDirectory(),
);
skillDirs.sort((a, b) => a.name.localeCompare(b.name));
const skills = await Promise.all(
  skillDirs.map(async (entry) => {
    const slug = entry.name;
    const path = join(skillsRoot, slug, "SKILL.md");
    const source = await readFile(path, "utf8");
    const meta = frontmatter(source);
    const body = source.replace(/^---\n[\s\S]*?\n---\n?/, "").trim();
    return {
      slug,
      title: meta.name ?? titleFor(slug),
      description: meta.description ?? "",
      version: meta.metadata?.version ?? "unversioned",
      body,
      source: relative(root, path),
    };
  }),
);

const standardFiles = (await readdir(standardsRoot)).filter((name) => name.endsWith(".md"));
standardFiles.sort();
const standards = await Promise.all(
  standardFiles.map(async (name) => ({
    slug: name.replace(/\.md$/, ""),
    title: titleFor(name.replace(/\.md$/, "")),
    body: await readFile(join(standardsRoot, name), "utf8"),
    source: relative(root, join(standardsRoot, name)),
  })),
);

const upstreamReferences = [
  { name: "Matt Pocock engineering skills", url: "https://github.com/mattpocock/skills" },
  { name: "Emil Kowalski skills", url: "https://github.com/emilkowalski/skills" },
  { name: "Vercel skills discovery", url: "https://github.com/vercel-labs/skills" },
];
const content = `export const skills = ${JSON.stringify(skills)} as const\nexport const standards = ${JSON.stringify(standards)} as const\nexport const upstreamReferences = ${JSON.stringify(upstreamReferences)} as const\n`;
await writeFile(output, content);

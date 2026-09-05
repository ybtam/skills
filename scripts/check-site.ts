import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { names, root } from "./skills";

const output = resolve(root, "apps/web/dist/client");
const docs = (await readdir(resolve(root, "standards"))).filter((file) => file.endsWith(".md"));
const paths = [
  "",
  "standards",
  ...names.map((name) => `skills/${name}`),
  ...docs.map((file) => `standards/${file.slice(0, -3)}`),
];
for (const path of paths) {
  const html = await readFile(resolve(output, path, "index.html"), "utf8");
  if (!/<meta[^>]+charset="utf-8"/i.test(html)) throw Error(`Missing UTF-8 declaration: ${path}`);
  if (/href="(?:references\/)?[a-z-]+\.md"/.test(html))
    throw Error(`Unresolved documentation link: ${path}`);
  if (path.startsWith("standards/")) {
    const source = await readFile(resolve(root, `${path}.md`), "utf8");
    const heading = source.split("\n")[0]!.replace(/^#\s*/, "");
    if (!html.includes(heading)) throw Error(`Document body missing: ${path}`);
  }
}
console.log(
  `Static output verified: ${paths.length} pages, UTF-8, document bodies and local links`,
);

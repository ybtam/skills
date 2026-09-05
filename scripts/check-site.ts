import { access, readdir, readFile, stat } from "node:fs/promises";
import { resolve } from "node:path";

import { names, root } from "./skills";

const output = resolve(root, "apps/web/dist/client");
const base = process.env.SITE_BASE_PATH || "/";
const docs = (await readdir(resolve(root, "standards"))).filter((file) => file.endsWith(".md"));
const paths = [
  "",
  "standards",
  ...names.map((name) => `skills/${name}`),
  ...docs.map((file) => `standards/${file.slice(0, -3)}`),
];
for (const path of [...paths, "404.html"]) {
  const file = path === "404.html" ? path : `${path ? `${path}/` : ""}index.html`;
  const html = await readFile(resolve(output, file), "utf8");
  if (!/<meta[^>]+charset="utf-8"/i.test(html)) throw Error(`Missing UTF-8 declaration: ${path}`);
  if (/href="(?:references\/)?[a-z-]+\.md"/.test(html))
    throw Error(`Unresolved documentation link: ${path}`);
  if (path.startsWith("standards/")) {
    const source = await readFile(resolve(root, `${path}.md`), "utf8");
    const heading = source.split("\n")[0]!.replace(/^#\s*/, "");
    if (!html.includes(heading)) throw Error(`Document body missing: ${path}`);
  }
  for (const [, target] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (!target || /^(?:[a-z]+:|\/\/|#)/i.test(target)) continue;
    const url = new URL(target.replaceAll("&amp;", "&"), `https://site.invalid${base}${file}`);
    if (!url.pathname.startsWith(base))
      throw Error(`Link escapes deployment base: ${target} in ${file}`);
    const local = resolve(output, decodeURIComponent(url.pathname.slice(base.length)));
    if ((await stat(local)).isDirectory()) await access(resolve(local, "index.html"));
  }
}
console.log(
  `Static output verified: ${paths.length} pages + 404 under ${base}, document bodies and local targets`,
);

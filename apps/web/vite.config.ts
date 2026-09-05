import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

import { skills, standards } from "./src/content/generated";

const base = process.env.SITE_BASE_PATH || "/";
if (!/^\/(?:[a-zA-Z0-9_-]+\/)*$/.test(base)) {
  throw new Error("SITE_BASE_PATH must be a root-relative directory ending in /");
}
const paths = [
  "/",
  "/standards/",
  ...skills.map(({ slug }) => `/skills/${slug}/`),
  ...standards.map(({ slug }) => `/standards/${slug}/`),
];

export default defineConfig({
  base,
  preview: { host: "127.0.0.1" },
  plugins: [
    tanstackStart({
      router: { basepath: base },
      pages: paths.map((path) => ({ path: `${base}${path.slice(1)}` })),
      prerender: { enabled: true, crawlLinks: false, autoStaticPathsDiscovery: false },
    }),
    viteReact(),
  ],
});

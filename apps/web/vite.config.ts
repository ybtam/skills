import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  preview: { host: "127.0.0.1" },
  plugins: [
    tanstackStart({
      prerender: { enabled: true, crawlLinks: true, autoStaticPathsDiscovery: true },
    }),
    viteReact(),
  ],
});

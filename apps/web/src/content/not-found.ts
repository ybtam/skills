import { writeFile } from "node:fs/promises";

const base = process.env.SITE_BASE_PATH || "/";
if (!/^\/(?:[a-zA-Z0-9_-]+\/)*$/.test(base)) throw Error("Invalid SITE_BASE_PATH");
await writeFile(
  new URL("../../dist/client/404.html", import.meta.url),
  `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found · ybtam skills</title>
<style>body{margin:12vh auto;max-width:640px;padding:24px;background:#f7f8f4;color:#15211d;font:18px/1.6 system-ui}h1{font-size:42px;line-height:1.15}a{color:#526416}a:focus-visible{outline:3px solid #526416;outline-offset:4px}</style></head>
<body><main><p>404</p><h1>This page could not be found.</h1><p>The address may have changed.</p><a href="${base}">Return to the skill catalog</a></main></body></html>`,
);

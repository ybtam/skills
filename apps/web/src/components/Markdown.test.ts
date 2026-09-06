import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";

import { Markdown } from "./Markdown";

test("shared standards keep their website links", () => {
  const html = renderToStaticMarkup(
    createElement(Markdown, {
      source: "skills/setup-repo/SKILL.md",
      children: "[Baseline](references/baseline.md)",
    }),
  );
  expect(html).toContain('href="/standards/baseline"');
});

test("specialized references resolve against their owning skill", () => {
  const html = renderToStaticMarkup(
    createElement(Markdown, {
      source: "skills/tune-agent-instructions/SKILL.md",
      children: "[Guidance](references/astra-guidance.md)",
    }),
  );
  expect(html).toContain(
    'href="https://github.com/ybtam/skills/blob/main/skills/tune-agent-instructions/references/astra-guidance.md"',
  );
});

test("same-skill assets resolve against their owning skill", () => {
  const html = renderToStaticMarkup(
    createElement(Markdown, {
      source: "skills/release-with-changesets/SKILL.md",
      children: "[Native release template](assets/github-actions/native-changesets-release.yml)",
    }),
  );
  expect(html).toContain(
    'href="https://github.com/ybtam/skills/blob/main/skills/release-with-changesets/assets/github-actions/native-changesets-release.yml"',
  );
});

test("same-skill assets normalize a Windows source path", () => {
  const html = renderToStaticMarkup(
    createElement(Markdown, {
      source: "skills\\release-with-changesets\\SKILL.md",
      children: "[Native release template](assets/github-actions/native-changesets-release.yml)",
    }),
  );
  expect(html).toContain(
    'href="https://github.com/ybtam/skills/blob/main/skills/release-with-changesets/assets/github-actions/native-changesets-release.yml"',
  );
});

test.each([
  "assets/../references/release-workflow.md",
  "assets/%2e%2e/references/release-workflow.md",
])("same-skill asset escape stays local: %s", (assetPath) => {
  const html = renderToStaticMarkup(
    createElement(Markdown, {
      source: "skills/release-with-changesets/SKILL.md",
      children: `[Release workflow](${assetPath})`,
    }),
  );
  expect(html).toContain(`href="${assetPath}"`);
  expect(html).not.toContain(
    'href="https://github.com/ybtam/skills/blob/main/skills/release-with-changesets/',
  );
});

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

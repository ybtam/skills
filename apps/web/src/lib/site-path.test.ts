import { expect, test } from "vitest";

import { withBase } from "./site-path";

test.each([
  ["/", "/", "/"],
  ["/favicon.svg", "/skills/", "/skills/favicon.svg"],
  ["/standards/baseline#tooling", "/skills/", "/skills/standards/baseline#tooling"],
  ["/skills/setup-repo", "/skills/", "/skills/skills/setup-repo"],
  ["/standards/baseline", "/", "/standards/baseline"],
])("resolves %s under %s", (path, base, expected) => {
  expect(withBase(path, base)).toBe(expected);
});

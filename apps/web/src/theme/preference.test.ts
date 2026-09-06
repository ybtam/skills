import { runInNewContext } from "node:vm";
import { afterEach, expect, test, vi } from "vitest";

import { normalizePreference, readPreference, themeInitializationScript } from "./preference";

afterEach(() => vi.unstubAllGlobals());

test.each([
  [null, "system"],
  ["invalid", "system"],
  ["system", "system"],
  ["light", "light"],
  ["dark", "dark"],
])("resolves stored preference %s", (value, expected) => {
  expect(normalizePreference(value)).toBe(expected);
  vi.stubGlobal("localStorage", { getItem: () => value });
  expect(readPreference()).toBe(expected);
  const document = { documentElement: { dataset: {} } };
  runInNewContext(themeInitializationScript, { document, localStorage: { getItem: () => value } });
  expect(document.documentElement.dataset).toEqual({ theme: expected });
});

test("blocked storage falls back to system before paint and after hydration", () => {
  const storage = {
    getItem: () => {
      throw new Error("Storage disabled");
    },
  };
  vi.stubGlobal("localStorage", storage);
  expect(readPreference()).toBe("system");
  const document = { documentElement: { dataset: {} } };
  runInNewContext(themeInitializationScript, { document, localStorage: storage });
  expect(document.documentElement.dataset).toEqual({ theme: "system" });
});

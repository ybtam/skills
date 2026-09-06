import { useEffect, useState } from "react";

import type { ThemePreference } from "../theme/preference";

import { normalizePreference, readPreference, themeStorageKey } from "../theme/preference";

export function ThemeSelector() {
  const [preference, setPreference] = useState<ThemePreference>("system");
  useEffect(() => {
    const saved = readPreference();
    setPreference(saved);
    document.documentElement.dataset.theme = saved;
  }, []);

  function change(value: string) {
    const next = normalizePreference(value);
    setPreference(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(themeStorageKey, next);
    } catch {
      // Keep this page's selection usable when persistence is unavailable.
    }
  }

  return (
    <label className="theme-selector">
      Theme
      <select value={preference} onChange={(event) => change(event.target.value)}>
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </label>
  );
}

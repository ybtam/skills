export type ThemePreference = "system" | "light" | "dark";
export const themeStorageKey = "ybtam-theme";

export function normalizePreference(value: unknown): ThemePreference {
  return value === "light" || value === "dark" ? value : "system";
}

export function readPreference(): ThemePreference {
  try {
    return normalizePreference(localStorage.getItem(themeStorageKey));
  } catch {
    return "system";
  }
}

// Self-contained normalization is embedded in the pre-paint script and the 404 page.
export const themeInitializationScript = `try {
  document.documentElement.dataset.theme = (${normalizePreference.toString()})(localStorage.getItem(${JSON.stringify(themeStorageKey)}));
} catch { document.documentElement.dataset.theme = "system"; }`;

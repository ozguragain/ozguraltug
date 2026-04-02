export const THEME_STORAGE_KEY = "personal-site-theme";

export const THEMES = {
  dark: "dark",
  light: "light"
} as const;

export type Theme = (typeof THEMES)[keyof typeof THEMES];

export const DEFAULT_THEME: Theme = THEMES.dark;

export const themeScript = `
(() => {
  const storageKey = "${THEME_STORAGE_KEY}";
  const fallback = "${DEFAULT_THEME}";

  try {
    const stored = window.localStorage.getItem(storageKey);
    const theme = stored === "light" || stored === "dark" ? stored : fallback;
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  } catch {
    document.documentElement.dataset.theme = fallback;
    document.documentElement.style.colorScheme = fallback;
  }
})();
`;

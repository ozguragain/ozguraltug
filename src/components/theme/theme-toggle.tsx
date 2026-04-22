"use client";

import { useSyncExternalStore } from "react";

import { DEFAULT_THEME, THEMES, THEME_STORAGE_KEY, type Theme } from "@/lib/theme";

const THEME_CHANGE_EVENT = "personal-site-theme-change";

function readTheme(): Theme {
  if (typeof window === "undefined") {
    return DEFAULT_THEME;
  }

  const datasetTheme = document.documentElement.dataset.theme;
  if (datasetTheme === THEMES.light || datasetTheme === THEMES.dark) {
    return datasetTheme;
  }

  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === THEMES.light || stored === THEMES.dark) {
    return stored;
  }

  return DEFAULT_THEME;
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(THEME_CHANGE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(THEME_CHANGE_EVENT, callback);
  };
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, readTheme, () => DEFAULT_THEME);

  const nextTheme = theme === THEMES.dark ? THEMES.light : THEMES.dark;

  const handleToggle = () => {
    const updatedTheme = nextTheme;
    document.documentElement.dataset.theme = updatedTheme;
    document.documentElement.style.colorScheme = updatedTheme;
    window.localStorage.setItem(THEME_STORAGE_KEY, updatedTheme);
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={`Switch to ${nextTheme} theme`}
      className="pressable inline-flex h-10 w-10 items-center justify-center rounded-full text-text transition-colors duration-200 ease-out hover:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {theme === THEMES.dark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

function SunIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-[1.125rem] w-[1.125rem]"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    >
      <circle cx="12" cy="12" r="4.25" />
      <path d="M12 2.75v2.5" />
      <path d="M12 18.75v2.5" />
      <path d="m5.46 5.46 1.77 1.77" />
      <path d="m16.77 16.77 1.77 1.77" />
      <path d="M2.75 12h2.5" />
      <path d="M18.75 12h2.5" />
      <path d="m5.46 18.54 1.77-1.77" />
      <path d="m16.77 7.23 1.77-1.77" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-[1.125rem] w-[1.125rem]"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    >
      <path d="M20.19 14.84A8.5 8.5 0 1 1 9.16 3.81 7 7 0 0 0 20.19 14.84Z" />
    </svg>
  );
}

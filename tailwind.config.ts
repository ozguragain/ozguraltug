import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg: "hsl(var(--color-bg) / <alpha-value>)",
        "bg-elevated": "hsl(var(--color-bg-elevated) / <alpha-value>)",
        "bg-muted": "hsl(var(--color-bg-muted) / <alpha-value>)",
        border: "hsl(var(--color-border) / <alpha-value>)",
        text: "hsl(var(--color-text) / <alpha-value>)",
        "text-muted": "hsl(var(--color-text-muted) / <alpha-value>)",
        accent: "hsl(var(--color-accent) / <alpha-value>)",
        "accent-strong": "hsl(var(--color-accent-strong) / <alpha-value>)",
        ring: "hsl(var(--color-ring) / <alpha-value>)"
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)"
      },
      fontFamily: {
        mono: ["IBM Plex Mono", "Cascadia Mono", "Consolas", "Segoe UI Mono", "monospace"]
      },
      maxWidth: {
        shell: "var(--max-width-shell)",
        content: "var(--max-width-content)",
        prose: "var(--max-width-prose)"
      },
      spacing: {
        shell: "var(--space-shell)"
      },
      transitionTimingFunction: {
        "ease-out-strong": "cubic-bezier(0.22, 1, 0.36, 1)"
      }
    }
  },
  plugins: []
};

export default config;

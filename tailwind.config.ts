import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,md,mdx}"],
  darkMode: ["selector", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg: "hsl(var(--color-bg) / <alpha-value>)",
        "bg-elevated": "hsl(var(--color-bg-elevated) / <alpha-value>)",
        "bg-muted": "hsl(var(--color-bg-muted) / <alpha-value>)",
        border: "hsl(var(--color-border) / <alpha-value>)",
        text: "hsl(var(--color-text) / <alpha-value>)",
        "text-soft": "hsl(var(--color-text-soft) / <alpha-value>)",
        "text-muted": "hsl(var(--color-text-muted) / <alpha-value>)",
        accent: "hsl(var(--color-accent) / <alpha-value>)",
        "accent-strong": "hsl(var(--color-accent-strong) / <alpha-value>)",
        ring: "hsl(var(--color-ring) / <alpha-value>)",
        link: "hsl(var(--color-link) / <alpha-value>)"
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)"
      },
      fontFamily: {
        mono: ["var(--font-mono)", "Cascadia Mono", "Consolas", "Segoe UI Mono", "monospace"],
        sans: [
          "var(--font-sans)",
          "Gabarito",
          "ui-sans-serif",
          "system-ui",
          "sans-serif"
        ]
      },
      maxWidth: {
        shell: "var(--max-width-shell)",
        content: "var(--max-width-content)",
        prose: "var(--max-width-prose)",
        frame: "var(--max-width-frame)"
      },
      spacing: {
        shell: "var(--space-shell)"
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.16, 1, 0.3, 1)",
        "out-strong": "cubic-bezier(0.22, 1, 0.36, 1)",
        spring: "cubic-bezier(0.32, 0.72, 0, 1)"
      },
      transitionDuration: {
        instant: "100ms",
        fast: "140ms",
        base: "180ms",
        medium: "240ms",
        slow: "360ms"
      },
      keyframes: {
        "rise-in": {
          from: { opacity: "0", transform: "translate3d(0, 10px, 0)" },
          to: { opacity: "1", transform: "translate3d(0, 0, 0)" }
        }
      },
      animation: {
        "rise-in": "rise-in 240ms cubic-bezier(0.22, 1, 0.36, 1) both"
      }
    }
  },
  plugins: []
};

export default config;

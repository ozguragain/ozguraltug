import { twMerge } from "tailwind-merge";

type ClassValue =
  | string
  | boolean
  | null
  | undefined
  | Record<string, boolean>
  | ClassValue[];

export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = [];

  for (const input of inputs) {
    if (!input) continue;
    if (typeof input === "string") {
      classes.push(input);
    } else if (Array.isArray(input)) {
      const nested = cn(...input);
      if (nested) classes.push(nested);
    } else if (typeof input === "object") {
      for (const [key, value] of Object.entries(input)) {
        if (value) classes.push(key);
      }
    }
  }

  // twMerge handles conflicting Tailwind prefixes (e.g. p-4 vs p-6, rounded-sm vs rounded-lg)
  return twMerge(classes.join(" ").replace(/\s+/g, " ").trim());
}

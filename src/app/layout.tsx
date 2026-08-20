import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DM_Mono, Gabarito } from "next/font/google";

import { SiteShell } from "@/components/layout/site-shell";
import { themeScript } from "@/lib/theme";

import "./globals.css";

const gabarito = Gabarito({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap"
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap"
});

export const metadata: Metadata = {
  title: {
    default: "Oz",
    template: "%s | Oz"
  },
  description:
    "A dark, terminal-inspired personal website for projects, writing, and a future markdown studio."
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body className={`${gabarito.variable} ${dmMono.variable}`}>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}

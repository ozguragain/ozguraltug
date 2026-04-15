import type { Metadata } from "next";
import type { ReactNode } from "react";
import { IBM_Plex_Mono } from "next/font/google";

import { SiteShell } from "@/components/layout/site-shell";
import { themeScript } from "@/lib/theme";

import "./globals.css";

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-mono",
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
    <html lang="en" data-theme="dark" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={ibmPlexMono.variable}>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}

# ozguraltug.dev

This repository contains the source code for my personal website, portfolio, and blog. Live version: [ozguraltug.com](https://ozguraltug.com)

## Tech Stack

- Framework: Next.js
- Deployment: Vercel
- Styling: Tailwind CSS

## Overview

- `components/*` - The different components the whole site uses.
- `lib/*` - Small snippets of code used around and about on the website.
- `pages/writing/*` - Static pre-rendered blog pages using MDX w/ next-mdx-remote.
- `pages/*` - All other static pages.
- `public/*` - Static assets including fonts and images.
- `styles/*` - Global styles live here, most things are done w/ Vanilla Tailwind CSS but some niche things exist here.

## Running Locally

This application requires Node version: 14.15.3 or higher.

```bash
npm install
npm run dev

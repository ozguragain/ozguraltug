# ozguraltug.dev

This repository contains the source code for my personal website, portfolio, and blog. Live version: [ozguraltug.dev](https://ozguraltug.dev)

## Tech Stack

- Framework: Next.js
- Deployment: Vercel
- Styling: Tailwind CSS
- Markdown: [@ozguragain/mdp](https://www.npmjs.com/package/@ozguragain/mdp), a Go markdown compiler

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
```

## Updating mdp

Markdown is compiled by [`@ozguragain/mdp`](https://www.npmjs.com/package/@ozguragain/mdp).
Its releases are cut from the [mdp repository](https://github.com/ozguragain/mdp);
upgrade here with:

```bash
npm i @ozguragain/mdp@latest
```

The package carries the compiler binaries for darwin-arm64 and linux-x64. On any
other platform, build one in the mdp checkout (`scripts/build-binaries.sh`) and
point `MDP_BIN` at it.

# ozguraltug.dev

This repository contains the source code for my personal website, portfolio, and blog. Live version: [ozguraltug.dev](https://ozguraltug.dev)

## Tech Stack

- Framework: Next.js
- Deployment: Vercel
- Styling: Tailwind CSS
- Markdown: [@ozguragain/mdp](https://www.npmjs.com/package/@ozguragain/mdp), a Go markdown compiler

## Overview

- `src/app/*` - Route segments. `writing/[slug]` renders one markdown post per build.
- `src/components/*` - The different components the whole site uses.
- `src/lib/*` - The markdown pipeline: mdp output, syntax highlighting, frontmatter, post discovery.
- `src/content/writing/*` - The posts themselves, one `.md` file each.
- `src/app/globals.css` - Design tokens and the Tailwind layers.

## Running Locally

This application requires Node version: 20.9 or higher (Next 16's floor).

```bash
npm install
npm run dev
```

## Updating mdp

Markdown is compiled by [`@ozguragain/mdp`](https://www.npmjs.com/package/@ozguragain/mdp),
released from the [mdp repository](https://github.com/ozguragain/mdp):

```bash
npm i @ozguragain/mdp@latest
```

The package ships the compiler for darwin-arm64 and linux-x64. On any other
platform, build one in the mdp checkout and point `MDP_BIN` at it.

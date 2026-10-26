# ozguraltug.dev

This repository contains the source code for my personal website, portfolio, and blog. Live version: [ozguraltug.dev](https://ozguraltug.dev)

## Tech Stack

- Framework: Next.js
- Deployment: Vercel
- Styling: Tailwind CSS
- Markdown: [mdp](https://github.com/ozguragain/mdp), a Go compiler pinned to a repository archive

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

`mdp` is installed from a commit archive, not from the npm registry, so a new
release is a new pinned URL. Rebuild the platform binaries in the mdp checkout
(`scripts/build-binaries.sh`), commit them, then point this repo at the commit:

```bash
npm i https://codeload.github.com/ozguragain/mdp/tar.gz/<commit-sha>
```

The archive host is allowlisted in `.npmrc`: npm 12 refuses remote packages
from unlisted hosts.

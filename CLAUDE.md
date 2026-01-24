# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MMT UK is a static educational website about Modern Monetary Theory built with Astro. The site was migrated from Webflow, and some Webflow CSS/JS remains for layout compatibility.

- **Site**: https://mmtuk.org
- **Node Version**: 20 (see .nvmrc)
- **Deployment**: Railway.app (builds to `dist/`, served with `npx serve`)

## Commands

```bash
npm run dev       # Dev server at localhost:4321
npm run build     # Build to ./dist/
npm run preview   # Preview built site locally
astro check       # TypeScript type checking
astro sync        # Regenerate content collection types
```

## Architecture

### Content Collections (src/content/)

All content uses Astro Content Collections with Zod validation defined in `src/content.config.ts`:

- **articles/** - Educational content and commentary (36 files)
  - Categories: `Article`, `Commentary`, `Research`, `Core Ideas`
  - Layouts: `default` or `simplified` (for cleaner educational content)
- **news/** - Announcements and events
- **bios/** - Team member profiles
- **ecosystem/** - MMT ecosystem organizations

### Key Files

- `src/layouts/BaseLayout.astro` - Main template with SEO meta, navigation, footer, and interactive component scripts (accordions, sliders, tabs)
- `src/components/Navbar.astro` - Complex mega-menu navigation
- `public/admin/config.yml` - Decap CMS configuration (content editing UI at `/admin/`)
- `scripts/migrate-*.cjs` - Webflow to Astro migration tools

### Dynamic Routes

- `/articles/[slug].astro` - Article pages from articles collection
- `/ecosystem/[slug].astro` - Ecosystem entry pages

### Styling

CSS comes from Webflow exports in `public/css/` (normalize.css, webflow.css, mmtuk.webflow.css). Interactive components use both Webflow's library and inline scripts in BaseLayout.astro.

## Content Frontmatter Example

```yaml
title: "Article Title"
slug: "article-slug"
category: "Core Ideas"
layout: "simplified"
author: "MMTUK"
pubDate: 2026-01-23T00:00:00.000Z
readTime: 5
summary: "Brief description"
thumbnail: "/images/placeholder-image.svg"
```

## CMS

Decap CMS (formerly NetlifyCMS) provides a web UI for editing content at `/admin/`. It uses git-gateway backend and commits changes directly to the repository. For local CMS development, enable `local_backend: true` in `public/admin/config.yml`.

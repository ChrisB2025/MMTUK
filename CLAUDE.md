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
- **localGroups/** - Local MMT community groups (Brighton, etc.)
  - `headerImage` field controls the card image on `/community` page
  - Images stored in `public/images/`
- **localNews/** - News specific to local groups

### Key Files

- `src/layouts/BaseLayout.astro` - Main template with SEO meta, navigation, footer, and interactive component scripts (accordions, sliders, tabs)
- `src/components/Navbar.astro` - Complex mega-menu navigation
- `public/admin/config.yml` - Decap CMS configuration (content editing UI at `/admin/`)
- `scripts/migrate-*.cjs` - Webflow to Astro migration tools
- `src/pages/community.astro` - Lists local groups (cards use `headerImage` from frontmatter)
- `src/pages/education.astro` - Education hub with "Ask MMTUK" AI assistant, "What is MMT?" explainer, FAQ accordions, and Advisory Services section

### Dynamic Routes

- `/articles/[slug].astro` - Article pages from articles collection
- `/ecosystem/[slug].astro` - Ecosystem entry pages
- `/local-group/[slug].astro` - Local group pages
- `/local-group/[groupSlug]/[newsSlug].astro` - Local group news articles

### Styling

CSS comes from Webflow exports in `public/css/` (normalize.css, webflow.css, mmtuk.webflow.css). Interactive components use both Webflow's library and inline scripts in BaseLayout.astro.

**Custom Overrides**: `public/css/professional-overrides.css` contains site-specific styling enhancements that override Webflow defaults. Add new custom styles here rather than modifying Webflow CSS files.

**Common Webflow Component Classes**:
- `.team8_item` - Bio/team member cards (used on About Us page)
- `.blog1_item` - Article cards
- `.faq4_component` / `.accordion1_component` - Accordion sections (e.g., MMTUK News)
- `.section_team8`, `.section_faq7` - Section wrappers with color schemes
- `.faq7_component` - Content sections with centered headings and constrained width

**Section Structure Pattern** (used on education page):
```html
<section class="section_faq7 color-scheme-4">
  <div class="padding-global">
    <div class="divider-horizontal page_divider"></div>
    <div class="container-large">
      <div class="padding-section-large">
        <div class="faq7_component">
          <div class="text-align-center">
            <div class="max-width-large align-center">
              <div class="margin-bottom margin-small">
                <h2 class="heading-style-h2 left">Section Title</h2>
              </div>
            </div>
          </div>
          <div class="max-width-large align-center">
            <p class="text-size-medium" style="text-align: left;">Content here...</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```

**Section Dividers**: Use this pattern for horizontal dividers between sections:
```html
<div class="padding-global">
  <div class="container-large">
    <div class="divider-horizontal page_divider"></div>
  </div>
</div>
```
The divider uses the theme's secondary color (`--_mmt-uk-theme---sercondary: #e2cdaa`).

**Color Schemes**: Sections use `color-scheme-1` through `color-scheme-4` classes for background variations.

**Heading Hierarchy**:
- Use `heading-style-h1` only for the main page title (one h1 per page)
- Use `heading-style-h2 left` for section headings (the `left` class is required - h2 is centered by default)
- CSS overrides in `professional-overrides.css` ensure h2 is visually smaller than h1 at all breakpoints

**Email Obfuscation Pattern**: To protect email addresses from spam bots:
```html
<a href="#" class="text-style-link obfuscated-email" data-user="contact" data-domain="mmtuk.org">
  <span class="email-fallback">contact [at] mmtuk [dot] org</span>
</a>
```
With JavaScript (typically at end of page):
```javascript
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.obfuscated-email').forEach(function(el) {
    var user = el.getAttribute('data-user');
    var domain = el.getAttribute('data-domain');
    if (user && domain) {
      var email = user + '@' + domain;
      el.href = 'mailto:' + email;
      el.innerHTML = email;
    }
  });
});
```
This shows a human-readable fallback ("contact [at] mmtuk [dot] org") if JavaScript is disabled.

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

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MMTUK is a static educational website about Modern Monetary Theory built with Astro. The site was migrated from Webflow, and some Webflow CSS/JS remains for layout compatibility.

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

Key overrides in this file:
- Button hover effects (shadows, transforms)
- Card hover animations (lift effect, image zoom)
- Accordion improvements (smooth transitions, hover states)
- Link underline animations
- Focus states for accessibility
- Testimonial card grid styles
- Form input styling

**Common Webflow Component Classes**:
- `.team8_item` - Bio/team member cards (used on About Us page)
- `.blog1_item` - Article cards
- `.faq4_component` / `.accordion1_component` - Accordion sections (e.g., MMTUK News)
- `.section_team8`, `.section_faq7` - Section wrappers with color schemes
- `.faq7_component` - Content sections with centered headings and constrained width

**Button Classes**:
- `.button` and `.button-2` - Primary button styles (both get hover effects from professional-overrides.css)
- `.button-2.is-link.is-icon` or `.button.is-link.is-icon` - Link-style buttons with arrow icon, used in accordions and cards
- `.w-button` - Webflow button base class (combine with above)

**Accordion Component Pattern** (used for expandable content):
```html
<div class="accordion1_component">
  <div data-w-id="unique-id" class="accordion1_top">
    <div class="text-size-medium-19 text-weight-bold">Accordion Title</div>
    <div class="accordion1_icon w-embed">
      <svg width="100%" height="100%" viewbox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M16.5303 20.8839C16.2374 21.1768 15.7626 21.1768 15.4697 20.8839L7.82318 13.2374C7.53029 12.9445 7.53029 12.4697 7.82318 12.1768L8.17674 11.8232C8.46963 11.5303 8.9445 11.5303 9.2374 11.8232L16 18.5858L22.7626 11.8232C23.0555 11.5303 23.5303 11.5303 23.8232 11.8232L24.1768 12.1768C24.4697 12.4697 24.4697 12.9445 24.1768 13.2374L16.5303 20.8839Z" fill="currentColor"></path>
      </svg>
    </div>
  </div>
  <div style="height:0px" class="accordion1_bottom">
    <div class="margin-bottom margin-small">
      <p>Accordion content here...</p>
    </div>
  </div>
</div>
```
The accordion JS is in BaseLayout.astro and toggles the `height` of `.accordion1_bottom`.

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

**CTA Section Pattern** (two-column layout with image, used for Discord section on community page):
```html
<section class="section_cta1">
  <div class="padding-global">
    <div class="divider-horizontal page_divider"></div>
    <div class="container-large">
      <div class="padding-section-large">
        <div class="cta1_component">
          <div class="w-layout-grid cta1_content">
            <div class="cta1_content-left">
              <div class="margin-bottom margin-small">
                <h2 class="heading-style-h2 left">Section Title</h2>
              </div>
              <p class="text-size-medium-13">Description text...</p>
              <div class="margin-top margin-medium">
                <div class="button-group">
                  <a href="#" class="button-2 w-button">Call to Action</a>
                </div>
              </div>
              <!-- Optional: accordion component can be added here -->
            </div>
            <div class="cta1_image-wrapper" style="align-self: start;">
              <img loading="lazy" src="/images/image.avif" alt="" class="cta1_image">
            </div>
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

## Parallax Hero Animation

The join page (`src/pages/join.astro`) has a mouse-tracking parallax effect on hero images. This pattern can be reused for other hero sections.

**How it works**:
- Tracks mouse position relative to the hero section center
- Applies `translate3d()` transforms to image groups with different multipliers for depth
- Uses `will-change: transform` and short transitions for smooth performance
- Resets to origin on mouse leave

**Key elements** (from Webflow's header142 component):
- `.header142_component` - The hero container (event listener target)
- `.header142_images-canvas` - Outer image wrapper
- `.header142_images-group1` / `.header142_images-group2` - Image groups that move at different rates

**Implementation**: Add a `<script>` tag at the end of the page (before `</BaseLayout>`). See `join.astro` for the full implementation.

## Webflow Slider/Carousel Override

The site uses custom slider JavaScript in `BaseLayout.astro` to replace Webflow's native slider behavior. This was necessary because Webflow's transform-based approach conflicted with the Astro build.

### Why Custom Implementation?

Webflow's native slider uses `transform: translateX()` on the mask element, which broke during Astro's static build. Our custom implementation uses `margin-left` on the first slide instead, which works reliably.

### HTML Structure

```html
<div data-delay="4000" data-animation="slide" class="header102_slider w-slider"
     data-autoplay="false" data-custom-autoplay="true" data-easing="ease"
     data-hide-arrows="false" data-disable-swipe="false" data-infinite="true">
  <div class="header102_mask w-slider-mask">
    <div class="header102_slide w-slide">
      <!-- Slide 1 content -->
    </div>
    <div class="header102_slide w-slide">
      <!-- Slide 2 content -->
    </div>
    <!-- More slides... -->
  </div>
  <div class="header102_arrow is-left w-slider-arrow-left">
    <!-- Left arrow SVG -->
  </div>
  <div class="header102_arrow w-slider-arrow-right">
    <!-- Right arrow SVG -->
  </div>
  <div class="header102_slide-nav w-slider-nav w-slider-nav-invert w-round"></div>
</div>
```

### Critical Data Attributes

For sliders to work correctly, the `.w-slider` element needs **both** autoplay attributes:

| Attribute | Value | Purpose |
|-----------|-------|---------|
| `data-autoplay` | `"false"` | **Required** - Disables Webflow's native autoplay (prevents conflicts) |
| `data-custom-autoplay` | `"true"` | **Required** - Enables our custom autoplay implementation |
| `data-delay` | `"4000"` | Slide interval in milliseconds |

### CSS Fix for Slide Gaps

Webflow's default inline-block slides can have whitespace gaps. The fix in `professional-overrides.css`:

```css
/* Flexbox slider fix - eliminates inline-block whitespace gaps */
.w-slider-mask {
  display: flex !important;
  flex-wrap: nowrap;
}

.w-slide {
  flex: 0 0 100%;
  display: block;
}
```

### JavaScript Implementation (BaseLayout.astro ~line 166-220)

The custom slider JS does the following:

1. **Delayed initialization** (100ms setTimeout) - Runs after Webflow's JS initializes
2. **Clones arrow elements** - Removes Webflow's event handlers by replacing arrow buttons
3. **Recreates navigation dots** - Webflow's dots are tied to transform-based logic
4. **Uses margin-left for sliding**:
   ```javascript
   slides[0].style.marginLeft = '-' + (currentIndex * 100) + '%';
   ```
5. **Handles autoplay** - Pauses on hover, resumes on mouse leave

### Troubleshooting Slider Issues

| Problem | Solution |
|---------|----------|
| Slides don't advance | Check `data-custom-autoplay="true"` is set |
| Two sliders fighting | Ensure `data-autoplay="false"` to disable Webflow's native |
| Gaps between slides | Add the flexbox CSS fix to `professional-overrides.css` |
| Arrows don't work | The JS clones arrows to remove Webflow handlers - check console for errors |
| Works locally, breaks on deploy | Ensure ALL related files are committed (both page file AND BaseLayout.astro) |
| Dots not updating | Check that `.w-slider-nav` container exists in HTML |

### Adding a New Slider

1. Copy the HTML structure above
2. Ensure both `data-autoplay="false"` AND `data-custom-autoplay="true"` are set
3. The JS in BaseLayout.astro automatically initializes all `.w-slider` elements
4. No additional JS needed - it's handled globally

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

## Branding

The organization name is **MMTUK** (no space). Previously "MMT UK" was used inconsistently.

### Brand Name Usage
- Text content: Use "MMTUK" everywhere (titles, descriptions, meta tags)
- Local group titles: "MMTUK | Scotland", "MMTUK | London", etc.
- Author titles: "Research Fellow, MMTUK"

### CSS Variables Exception
The CSS variable names `--_mmt-uk-theme---*` in `mmtuk.webflow.css` retain the hyphenated form because:
1. They are Webflow-exported technical identifiers, not visible to users
2. Changing them would require updating 100+ `var()` references
3. They may be regenerated if Webflow CSS is re-exported

### URL Redirects
Old article URLs (`/articles/mmt-uk-*`) redirect to new URLs (`/articles/mmtuk-*`) via `astro.config.mjs`. This preserves SEO and existing links.

```javascript
// In astro.config.mjs
redirects: {
  '/articles/mmt-uk-commentary-1': '/articles/mmtuk-commentary-1',
  // ... etc
}
```

## Deployment

- **Staging**: Railway.app deploys from the `design-upgrade` branch
- **Production**: TBD

### Common Deployment Issues

1. **Feature works locally but not on staging**: Check `git status` for uncommitted changes. A fix often requires changes to multiple files (e.g., both `BaseLayout.astro` AND a page file like `index.astro`). Ensure ALL related files are committed and pushed.

2. **Multiple terminal sessions**: Running multiple Claude Code sessions can cause commit queue confusion. Always verify with `git log` that the expected commits are present and pushed.

3. **Verify remote state**: Use `git log origin/design-upgrade --oneline -5` to confirm what's actually on the remote branch before assuming a deployment issue.

### Common Code Issues (Webflow Migration Artifacts)

1. **Duplicate footers**: Pages migrated from Webflow may have hardcoded `<footer class="footer4_component">` HTML that duplicates the Footer component from BaseLayout. The Footer is already included via BaseLayout, so remove any hardcoded footer elements from page files. Check for this pattern:
   ```html
   <!-- DELETE THIS - it duplicates BaseLayout's Footer -->
   <footer class="footer4_component">
     <div class="padding-global">...</div>
   </footer>
   ```

2. **Duplicate navigation**: Similar issue - pages should NOT have hardcoded `<nav>` elements. Navigation comes from the Navbar component in BaseLayout.

3. **Missing closing tags**: Webflow exports sometimes have malformed HTML. Validate structure if layout looks broken.

4. **Railway says "GitHub Repo not found" or "Branch not found"**: The Railway GitHub App has lost permission to access the repository. To fix:
   - Go to Railway project Settings → Source → click **Disconnect**
   - Go to GitHub → Settings → Applications → Installed GitHub Apps → Railway → **Configure**
   - Under "Repository access", ensure `ChrisB2025/MMTUK` is listed (or switch to "Only select repositories" and explicitly add it)
   - Return to Railway and click **Connect Repo** → select the repo → select `design-upgrade` branch
   - Push a commit to verify auto-deploy triggers
   - Workaround: Use `railway up` to deploy from local code while GitHub connection is broken

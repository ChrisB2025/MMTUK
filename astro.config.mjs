// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import autoRedirects from './redirects.config.mjs';

// https://astro.build/config
export default defineConfig({
  integrations: [sitemap()],
  output: 'static',
  build: {
    assets: '_astro'
  },
  site: 'https://mmtuk.org',
  compressHTML: true,
  vite: {
    build: {
      cssMinify: true
    }
  },
  redirects: {
    // Auto-generated redirects from CMS (for deleted content - SEO preservation)
    ...autoRedirects,

    // Manual redirects below (take precedence over auto-generated if duplicate sources)
    // Redirect old mmt-uk- article URLs to new mmtuk- URLs
    '/articles/mmt-uk-commentary-1': '/articles/mmtuk-commentary-1',
    '/articles/mmt-uk-commentary-10': '/articles/mmtuk-commentary-10',
    '/articles/mmt-uk-commentary-10-1940b': '/articles/mmtuk-commentary-10-1940b',
    '/articles/mmt-uk-commentary-1-1c57f': '/articles/mmtuk-commentary-1-1c57f',
    '/articles/mmt-uk-commentary-13': '/articles/mmtuk-commentary-13',
    '/articles/mmt-uk-commentary-16': '/articles/mmtuk-commentary-16',
    '/articles/mmt-uk-commentary-19': '/articles/mmtuk-commentary-19',
    '/articles/mmt-uk-commentary-4': '/articles/mmtuk-commentary-4',
    '/articles/mmt-uk-commentary-4-15f37': '/articles/mmtuk-commentary-4-15f37',
    '/articles/mmt-uk-commentary-7': '/articles/mmtuk-commentary-7',
    '/articles/mmt-uk-commentary-7-02474': '/articles/mmtuk-commentary-7-02474',
    '/articles/mmt-uk-feature-article-11': '/articles/mmtuk-feature-article-11',
    '/articles/mmt-uk-feature-article-14': '/articles/mmtuk-feature-article-14',
    '/articles/mmt-uk-feature-article-17': '/articles/mmtuk-feature-article-17',
    '/articles/mmt-uk-feature-article-2': '/articles/mmtuk-feature-article-2',
    '/articles/mmt-uk-feature-article-20': '/articles/mmtuk-feature-article-20',
    '/articles/mmt-uk-feature-article-2-7a1db': '/articles/mmtuk-feature-article-2-7a1db',
    '/articles/mmt-uk-feature-article-5': '/articles/mmtuk-feature-article-5',
    '/articles/mmt-uk-feature-article-5-4310b': '/articles/mmtuk-feature-article-5-4310b',
    '/articles/mmt-uk-feature-article-8': '/articles/mmtuk-feature-article-8',
    '/articles/mmt-uk-feature-article-8-30444': '/articles/mmtuk-feature-article-8-30444',
    '/articles/mmt-uk-research-12': '/articles/mmtuk-research-12',
    '/articles/mmt-uk-research-15': '/articles/mmtuk-research-15',
    '/articles/mmt-uk-research-18': '/articles/mmtuk-research-18',
    '/articles/mmt-uk-research-3': '/articles/mmtuk-research-3',
    '/articles/mmt-uk-research-3-c35d1': '/articles/mmtuk-research-3-c35d1',
    '/articles/mmt-uk-research-6': '/articles/mmtuk-research-6',
    '/articles/mmt-uk-research-6-72f4d': '/articles/mmtuk-research-6-72f4d',
    '/articles/mmt-uk-research-9': '/articles/mmtuk-research-9',
    '/articles/mmt-uk-research-9-3603a': '/articles/mmtuk-research-9-3603a',
    // Redirect old ecosystem URL
    '/ecosystem/mmt-uk-discord': '/ecosystem/mmtuk-discord'
  }
});

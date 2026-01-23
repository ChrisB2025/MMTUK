// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
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
  }
});

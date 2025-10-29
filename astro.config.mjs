// @ts-check
import { defineConfig } from 'astro/config';
import { remarkReadingTime } from './remark-reading-time.mjs';

import preact from '@astrojs/preact';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: 'https://al3xsus.github.io',
  base: '/',

  integrations: [preact({ compat: true, devtools: true }), sitemap()],
  markdown: {
    remarkPlugins: [remarkReadingTime],
  },
});
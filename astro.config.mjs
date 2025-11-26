// @ts-check
import { defineConfig } from 'astro/config';
import { remarkReadingTime } from './remark-reading-time.mjs';

import preact from '@astrojs/preact';

import sitemap from '@astrojs/sitemap';

const remoteDomains = ['wsrv.nl'];

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: 'https://al3xsus.github.io',
  base: '/',

  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp', // Or 'astro/assets/services/squoosh'
      config: {
        domains: remoteDomains,
      },
    },
  },

  integrations: [preact({ compat: true, devtools: true }), sitemap()],
  markdown: {
    remarkPlugins: [remarkReadingTime],
  },
});
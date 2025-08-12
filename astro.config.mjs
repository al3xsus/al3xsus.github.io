// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import preact from '@astrojs/preact';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: 'https://al3xsus.github.io',
  base: '/',

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [preact({compat: true, devtools: true})],
});
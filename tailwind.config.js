/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');

module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--color-bg)',
        foreground: 'var(--color-fg)',
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        'surface-light': 'var(--color-surface-light)',
        'surface-dark': 'var(--color-surface-dark)',
        grid: 'var(--color-grid)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    plugin(function ({ addBase }) {
      addBase({
        html: { fontFeatureSettings: '"ss01" on, "cv01" on' },
      });
    }),
  ],
};

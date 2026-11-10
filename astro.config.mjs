// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // TODO: remplacer par l'URL de production (canonical, hreflang, OpenGraph).
  site: 'https://example.com',
  i18n: {
    locales: ['fr', 'en'],
    defaultLocale: 'fr',
    routing: { prefixDefaultLocale: true, redirectToDefaultLocale: false }
  },
  vite: {
    plugins: [tailwindcss()]
  }
});

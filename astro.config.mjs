// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Canonicals, sitemap and social-preview URLs use this. SITE_URL overrides it.
const site = process.env.SITE_URL || 'https://www.federalmotors.net';

export default defineConfig({
  site,
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [react(), sitemap({ filter: (page) => !page.includes('/404') })],
  vite: { plugins: [tailwindcss()] },
});

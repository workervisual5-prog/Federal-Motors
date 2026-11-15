import type { APIRoute } from 'astro';

import { allowIndexing } from '@/lib/indexing';

// Allows crawling only on the live production site (see src/lib/indexing.ts).
export const GET: APIRoute = ({ site }) => {
  const allow = allowIndexing;
  const body = allow
    ? `User-agent: *\nAllow: /\nDisallow: /inventory?*\n\nSitemap: ${new URL('/sitemap-index.xml', site).href}\n`
    : 'User-agent: *\nDisallow: /\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};

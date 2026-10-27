import type { APIRoute } from 'astro';

// Blocks all crawling until PUBLIC_ALLOW_INDEXING=true is set at launch.
export const GET: APIRoute = ({ site }) => {
  const allow = import.meta.env.PUBLIC_ALLOW_INDEXING === 'true';
  const body = allow
    ? `User-agent: *\nAllow: /\nDisallow: /inventory?*\n\nSitemap: ${new URL('/sitemap-index.xml', site).href}\n`
    : 'User-agent: *\nDisallow: /\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};

import type { IncomingMessage, ServerResponse } from 'node:http';
import { escape, inventory, siteOrigin } from '../server/seo';
export default async function handler(req: IncomingMessage, res: ServerResponse, env = process.env) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); res.statusCode = 405; res.end(); return; }
  const url = new URL(req.url || '/', 'http://local');
  const robots = url.pathname === '/robots.txt' || url.searchParams.get('kind') === 'robots';
  const origin = siteOrigin(env);
  if (robots) { res.setHeader('Content-Type', 'text/plain'); res.end(!origin || env.VERCEL_ENV === 'preview' ? 'User-agent: *\nDisallow: /\n' : `User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${origin}/sitemap.xml\n`); return; }
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  if (!origin || env.VERCEL_ENV === 'preview') { res.statusCode = 404; res.end(); return; }
  try {
    const items = await inventory(env);
    const urls = ['/', '/propiedades', '/privacidad', ...items.map(p => `/propiedades/${encodeURIComponent(p.slug || p.id)}`)];
    res.end(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(path => `<url><loc>${escape(origin + path)}</loc></url>`).join('')}</urlset>`);
  } catch { res.statusCode = 503; res.end(); }
}

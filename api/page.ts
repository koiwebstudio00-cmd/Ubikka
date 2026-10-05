import type { IncomingMessage, ServerResponse } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pageHtml } from '../server/seo';
export default async function handler(req: IncomingMessage, res: ServerResponse, env = process.env, template?: string) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8'); res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET' && req.method !== 'HEAD') { res.setHeader('Allow', 'GET, HEAD'); res.statusCode = 405; res.end(); return; }
  try {
    const url = new URL(req.url || '/', 'http://local');
    const pathname = url.pathname === '/api/page' ? url.searchParams.get('path') || '/' : url.pathname;
    const result = await pageHtml(template ?? await readFile(resolve(process.cwd(), 'dist/index.html'), 'utf8'), pathname, env);
    res.statusCode = result.status; res.end(req.method === 'HEAD' ? undefined : result.html);
  } catch { res.statusCode = 503; res.setHeader('Retry-After', '60'); res.end('<!doctype html><html lang="es"><meta name="robots" content="noindex"><title>Ubikka</title><h1>No pudimos cargar la página</h1><p>Intentá nuevamente en unos momentos.</p></html>'); }
}

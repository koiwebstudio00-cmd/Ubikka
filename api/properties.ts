import { lokation } from '../server/lokation.js';
import type { IncomingMessage, ServerResponse } from 'node:http';

// La clave sólo se lee en el servidor (Vercel Function o middleware de Vite).
export default async function handler(req: IncomingMessage, res: ServerResponse, env = process.env) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json');
  if (req.method !== 'GET') { res.statusCode = 405; res.setHeader('Allow', 'GET'); res.end('{}'); return; }
  if (!env.LOKATION_API_URL || !env.LOKATION_API_KEY) {
    res.statusCode = 503; res.end(JSON.stringify({ error: 'El catálogo todavía no está configurado.' })); return;
  }
  try {
    const id = new URL(req.url || '/', 'http://local').searchParams.get('id');
    if (id) {
      if (!/^[a-zA-Z0-9-]{1,200}$/.test(id)) { res.statusCode = 400; res.end('{}'); return; }
      const response = await lokation(`export/properties/${encodeURIComponent(id)}`, env);
      if (response.status === 404) { res.statusCode = 404; res.end('{}'); return; }
      if (!response.ok) throw new Error('Detail failure');
      const result = await response.json();
      if (result.property?.estado !== 'disponible') { res.statusCode = 404; res.end('{}'); return; }
      let phone = '';
      // El contacto es opcional: una falla aquí no debe ocultar la ficha.
      try {
        const siteResponse = await lokation('export/site', env);
        if (siteResponse.ok) {
          const site = await siteResponse.json();
          phone = String(site.site?.configSitio?.telefono || '').replace(/[^0-9]/g, '');
        }
      } catch { /* Puede consultarse mediante el formulario. */ }
      res.end(JSON.stringify({ property: result.property, phone })); return;
    }
    const data: unknown[] = [];
    for (let page = 1; ; page++) {
      if (page > 100) throw new Error('Catalog limit');
      const url = new URL(`${env.LOKATION_API_URL.replace(/\/$/, '')}/v1/export/properties`);
      url.search = new URLSearchParams({ estado: 'disponible', limit: '100', page: String(page), sort: 'recent' }).toString();
      const response = await fetch(url, { headers: { 'X-Api-Key': env.LOKATION_API_KEY }, signal: AbortSignal.timeout(10000) });
      if (!response.ok) throw new Error('Upstream failure');
      const result = await response.json();
      if (!Array.isArray(result.data) || !Number.isFinite(result.meta?.total)) throw new Error('Invalid catalog');
      data.push(...result.data);
      if (data.length >= result.meta.total) break;
      if (!result.data.length) throw new Error('Incomplete catalog');
    }
    res.end(JSON.stringify({ data }));
  } catch {
    res.statusCode = 502;
    res.end(JSON.stringify({ error: 'No pudimos cargar las propiedades. Intentá nuevamente en unos momentos.' }));
  }
}

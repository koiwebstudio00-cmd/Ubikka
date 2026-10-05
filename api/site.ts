import type { IncomingMessage, ServerResponse } from 'node:http';
import { lokation } from '../server/lokation';
export default async function handler(req: IncomingMessage, res: ServerResponse, env = process.env) {
  res.setHeader('Content-Type', 'application/json'); res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); res.statusCode = 405; res.end('{}'); return; }
  try {
    const response = await lokation('export/site', env);
    if (!response.ok) throw new Error('Unavailable');
    const { site } = await response.json();
    if (!site) throw new Error('Unavailable');
    const config = site.configSitio || {};
    const text = (value: unknown) => typeof value === 'string' ? value.trim() : '';
    res.end(JSON.stringify({ site: { nombre: text(site.nombre), telefono: text(config.telefono), email: text(config.email), direccion: text(config.direccion), ciudad: text(config.ciudad) } }));
  } catch { res.statusCode = 503; res.end(JSON.stringify({ error: 'Datos de contacto no disponibles.' })); }
}

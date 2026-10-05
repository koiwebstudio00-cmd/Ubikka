import type { IncomingMessage, ServerResponse } from 'node:http';
import { lokation } from '../server/lokation.js';

export default async function handler(req: IncomingMessage & { body?: unknown }, res: ServerResponse, env = process.env) {
  res.setHeader('Content-Type', 'application/json'); res.setHeader('Cache-Control', 'no-store');
  const reply = (status: number, data: unknown) => { res.statusCode = status; res.end(JSON.stringify(data)); };
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); reply(405, {}); return; }
  if (!req.headers['content-type']?.includes('application/json')) { reply(415, { error: 'Formato inválido.' }); return; }
  try {
    let body = req.body;
    if (body === undefined) {
      let raw = '';
      for await (const chunk of req) { raw += chunk.toString(); if (Buffer.byteLength(raw) > 16000) { reply(413, { error: 'El mensaje es demasiado largo.' }); return; } }
      try { body = JSON.parse(raw); } catch { reply(400, { error: 'Solicitud inválida.' }); return; }
    }
    if (!body || typeof body !== 'object' || Array.isArray(body)) { reply(400, { error: 'Solicitud inválida.' }); return; }
    const b = body as Record<string, unknown>;
    const read = (key: string) => typeof b[key] === 'string' ? (b[key] as string).trim() : '';
    const nombre = read('nombre'), email = read('email'), telefono = read('telefono'), mensaje = read('mensaje'), id = read('property_id');
    if (read('website') || !nombre || nombre.length > 200 || !mensaje || mensaje.length > 5000 || (!email && !telefono) || telefono.length > 50 || (email && (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) || (id && !/^[a-f0-9-]{36}$/i.test(id))) {
      reply(400, { error: 'Revisá nombre, mensaje y al menos un dato de contacto válido.' }); return;
    }
    const siteResponse = await lokation('export/site', env);
    if (!siteResponse.ok) throw new Error('Site unavailable');
    const { site } = await siteResponse.json();
    if (!site?.slug) throw new Error('Missing tenant');
    if (id) {
      const propertyResponse = await lokation(`export/properties/${encodeURIComponent(id)}`, env);
      if (!propertyResponse.ok || (await propertyResponse.json()).property?.estado !== 'disponible') {
        reply(404, { error: 'Esta propiedad ya no está disponible. Volvé al catálogo.' }); return;
      }
    }
    const response = await lokation(`public/${encodeURIComponent(site.slug)}/leads`, env, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nombre, mensaje, ...(email ? { email } : {}), ...(telefono ? { telefono } : {}), ...(id ? { property_id: id } : {}), website: '' }) });
    if (!response.ok) { reply(response.status === 429 ? 429 : 502, { error: response.status === 429 ? 'Hubo demasiados intentos. Esperá un minuto antes de volver a enviar.' : 'No pudimos enviar la consulta. Intentá nuevamente.' }); return; }
    reply(201, { ok: true });
  } catch { reply(502, { error: 'No pudimos confirmar el envío. Intentá nuevamente en unos momentos.' }); }
}

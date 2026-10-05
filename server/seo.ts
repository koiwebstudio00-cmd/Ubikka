import { localBusiness, propertyMetadata, privacyTitle, privacyDescription, privacySections } from '../shared/public-content';
import { lokation } from './lokation';
export const escape = (value: unknown) => String(value ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]!));
export function siteOrigin(env: NodeJS.ProcessEnv) {
  try { const url = new URL(env.SITE_URL || ''); return url.protocol === 'https:' ? url.origin : ''; } catch { return ''; }
}
export async function inventory(env: NodeJS.ProcessEnv) {
  const data: any[] = [];
  for (let page = 1; page <= 100; page++) {
    const response = await lokation(`export/properties?estado=disponible&limit=100&page=${page}&sort=recent`, env);
    if (!response.ok) throw new Error('Catalog unavailable');
    const result = await response.json();
    if (!Array.isArray(result.data) || !Number.isFinite(result.meta?.total)) throw new Error('Invalid catalog');
    data.push(...result.data.filter((p: any) => p.estado === 'disponible'));
    if (page * 100 >= result.meta.total) return data;
    if (!result.data.length) throw new Error('Incomplete catalog');
  }
  throw new Error('Catalog too large');
}
export async function pageHtml(template: string, pathname: string, env: NodeJS.ProcessEnv) {
  const origin = siteOrigin(env);
  let title = 'Ubikka Inmobiliaria | Propiedades en Tucumán';
  let description = 'Encontrá propiedades en venta y alquiler en Tucumán. Consultá a Ubikka por tu próximo espacio.';
  let content = '<h1>Ubikka Inmobiliaria</h1><p>Espacios que construyen futuro. Propiedades en Tucumán.</p><a href="/propiedades">Ver propiedades</a>';
  let image = origin ? `${origin}/images/hero-sky.webp` : '';
  let bootstrap: unknown;
  let status = 200;
  let canonicalPath = pathname === '/' ? '/' : pathname.replace(/\/$/, '');
  let structured: unknown = { '@context': 'https://schema.org', '@type': 'RealEstateAgent', name: 'Ubikka', ...(origin ? { url: origin } : {}) };
  const match = pathname.match(/^\/propiedades\/([a-zA-Z0-9-]{1,200})\/?$/);
  // Render the page shell without waiting for the catalog or contact API.
  if (pathname === '/') structured = { '@context': 'https://schema.org', ...localBusiness(null, origin) };
  if (match) {
    const response = await lokation(`export/properties/${encodeURIComponent(match[1])}`, env);
    if (response.status !== 404 && !response.ok) throw new Error('Property unavailable');
    const property = response.ok ? (await response.json()).property : null;
    if (!property || property.estado !== 'disponible') status = 404;
    else {
      bootstrap = { url: `/api/properties?id=${encodeURIComponent(match[1])}`, data: { property } };
      ({ title, description } = propertyMetadata(property));
      canonicalPath = `/propiedades/${encodeURIComponent(property.slug || property.id)}`;
      const url = `${origin}${canonicalPath}`;
      const photo = property.images?.[0]?.url;
      if (typeof photo === 'string' && /^https?:\/\//.test(photo)) image = photo;
      const rows = ['operacion','tipo','direccion','zona','ciudad','ambientes','dormitorios','banios','supCubierta','supTotal','precio','moneda','precioAlquiler','monedaAlquiler','plazoContrato','ajuste','indiceAjuste','expensas','mascotas','amoblado'];
      content = `<h1>${escape(property.titulo)}</h1><p>${escape(property.descripcion)}</p><dl>${rows.filter(key => property[key] != null).map(key => `<dt>${escape(key)}</dt><dd>${escape(property[key])}</dd>`).join('')}</dl><a href="/#contacto">Consultar a Ubikka</a>`;
      structured = { '@context':'https://schema.org', '@type':'RealEstateListing', name: property.titulo, description: property.descripcion || description, ...(origin ? { url } : {}), ...(image ? { image } : {}) };
    }
  } else if (/^\/propiedades\/?$/.test(pathname)) {
    title = 'Propiedades en venta y alquiler | Ubikka';
    description = 'Explorá propiedades disponibles en Tucumán. Filtrá por operación, tipo, zona, dormitorios y precio.';
    content = '<h1>Propiedades en venta y alquiler</h1><p>Explorá el catálogo de Ubikka por operación, tipo, zona y precio.</p>';
    structured = { '@context':'https://schema.org', '@type':'CollectionPage', name:title, description };
  } else if (/^\/privacidad\/?$/.test(pathname)) {
    title = privacyTitle; description = privacyDescription;
    content = `<h1>Privacidad y datos personales</h1><p>Última actualización: 5 de octubre de 2026.</p>${privacySections.map(([heading,text]) => `<section><h2>${escape(heading)}</h2><p>${escape(text)}</p></section>`).join('')}<a href="/#contacto">Contactar a Ubikka</a>`;
    structured = { '@context':'https://schema.org', '@type':'WebPage', name:title, description };
  } else if (pathname !== '/') status = 404;
  if (status === 404) { title = '404 · Página no encontrada | Ubikka'; description = 'Volvé al catálogo para ver las propiedades disponibles.'; content = '<a href="/"><img src="/favicon.svg" alt="Ubikka Inmobiliaria" width="72" height="72"></a><p>404</p><h1>Página no encontrada</h1><a href="/propiedades">Ver propiedades disponibles</a>'; structured = null; }
  const index = origin && status === 200 && env.VERCEL_ENV !== 'preview';
  const canonical = origin ? `${origin}${canonicalPath}` : '';
  const head = `${bootstrap ? `<script id="initial-data" type="application/json">${JSON.stringify(bootstrap).replace(/</g, '\\u003c')}</script>` : ''}<meta name="robots" data-base="${origin && env.VERCEL_ENV !== 'preview' ? 'index,follow' : 'noindex,follow'}" content="${index ? 'index,follow' : 'noindex,follow'}" />${canonical ? `<link rel="canonical" href="${escape(canonical)}" />` : ''}<meta property="og:type" content="website" /><meta property="og:locale" content="es_AR" /><meta property="og:title" content="${escape(title)}" /><meta property="og:description" content="${escape(description)}" />${canonical ? `<meta property="og:url" content="${escape(canonical)}" />` : ''}${image ? `<meta property="og:image" content="${escape(image)}" />` : ''}<meta name="twitter:card" content="summary_large_image" />${structured ? `<script type="application/ld+json">${JSON.stringify(structured).replace(/</g, '\\u003c')}</script>` : ''}`;
  return { status, html: template.replace(/<title>.*?<\/title>/s, `<title>${escape(title)}</title>`).replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${escape(description)}" />`).replace('</head>', `${head}</head>`).replace('<div id="root"></div>', `<div id="root"><main style="padding:2rem;max-width:75rem;margin:auto">${content}</main></div>`) };
}

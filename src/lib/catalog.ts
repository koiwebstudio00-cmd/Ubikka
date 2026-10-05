import type { Property } from '../data/properties';
export type Listing = Property & { details: Record<string, any>; photos: { id: string; url: string }[]; rawType: string; zone: string; city: string; createdAt: string; rentPrice?: number; rentCurrency?: string };
export const typeLabels: Record<string, string> = { monoambiente: 'Monoambiente', departamento: 'Departamento', casa: 'Casa', duplex: 'Dúplex', local_comercial: 'Local comercial', oficina: 'Oficina', galpon: 'Galpón', estacionamiento: 'Estacionamiento', terreno: 'Terreno', otro: 'Otro' };
export type Filters = { q: string; op: string; tipo: string; zona: string; dormitorios: string; moneda: string; min: string; max: string; orden: string };
export const defaults: Filters = { q: '', op: '', tipo: '', zona: '', dormitorios: '', moneda: '', min: '', max: '', orden: 'recent' };
export function fromApi(p: any): Listing {
  const operation = p.operacion === 'ambos' ? 'VENTA / ALQUILER' : p.operacion === 'alquiler' ? 'ALQUILER' : 'VENTA';
  return { details: p, photos: p.images || [], id: p.id, slug: p.slug || p.id, title: p.titulo, operation, rawType: p.tipo, type: typeLabels[p.tipo] || p.tipo,
    location: [p.zona, p.ciudad].filter(Boolean).join(', '), zone: p.zona || '', city: p.ciudad || '',
    price: Number(p.precio), currency: p.moneda, formattedPrice: priceLabel(Number(p.precio), p.moneda, operation === 'ALQUILER'),
    rentPrice: p.precioAlquiler == null ? undefined : Number(p.precioAlquiler), rentCurrency: p.monedaAlquiler,
    image: p.images?.[0]?.url || '/images/property-placeholder.svg', featured: p.destacada,
    bedrooms: p.dormitorios ?? undefined, bathrooms: p.banios ?? undefined, areaM2: p.supTotal == null ? undefined : Number(p.supTotal), description: p.descripcion || '', createdAt: p.createdAt };
}
export function priceLabel(price: number, currency: string, rent = false) {
  return `${currency} ${new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 }).format(price)}${rent ? ' / mes' : ''}`;
}
const normalize = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
export function filterCatalog(items: Listing[], filters: Filters) {
  return items.map(p => filters.op === 'alquiler' && p.operation === 'VENTA / ALQUILER' && p.rentPrice != null
    ? { ...p, price: p.rentPrice, currency: p.rentCurrency || p.currency, formattedPrice: priceLabel(p.rentPrice, p.rentCurrency || p.currency, true) } : p
  ).filter(p => {
    const text = normalize(`${p.title} ${p.location} ${p.type} ${p.description}`);
    return (!filters.q || normalize(filters.q).split(/\s+/).every(word => text.includes(word))) &&
      (!filters.op || p.operation.includes(filters.op.toUpperCase())) &&
      (!filters.tipo || p.rawType === filters.tipo) && (!filters.zona || p.zone === filters.zona) &&
      (!filters.dormitorios || (filters.dormitorios === '4' ? (p.bedrooms ?? -1) >= 4 : p.bedrooms === Number(filters.dormitorios))) &&
      (!filters.moneda || p.currency === filters.moneda) &&
      (!filters.min || p.price >= Number(filters.min)) &&
      (!filters.max || p.price <= Number(filters.max));
  }).sort((a, b) => filters.orden === 'price-asc' ? a.price - b.price : filters.orden === 'price-desc' ? b.price - a.price : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

import { propertyMetadata } from '../../shared/public-content';
import { usePageSeo } from '../lib/page-seo';
import { PropertyGallery } from './PropertyGallery';
import { SiteLink } from './SiteLink';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, MapPin, ExternalLink, House, BedDouble, Bath, Ruler, Maximize, Grid2X2, KeyRound, CheckCircle, CalendarDays, TrendingUp, Percent, Wallet, PawPrint, Sofa } from 'lucide-react';
import type { Listing } from '../lib/catalog';
import { priceLabel } from '../lib/catalog';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { PropertyInquiry } from './PropertyInquiry';

const labels: Record<string, string> = { vivienda: 'Vivienda', comercial: 'Comercial', profesional: 'Profesional', otro: 'Otro', meses_12: '12 meses', meses_18: '18 meses', meses_24: '24 meses', meses_36: '36 meses', trimestral: 'Trimestral', cuatrimestral: 'Cuatrimestral', icl: 'ICL', ipc: 'IPC', fijo: 'Fijo', se_permiten: 'Se permiten', no_se_permiten: 'No se permiten', sin_especificar: 'Sin especificar', amoblado: 'Amoblado', sin_amoblar: 'Sin amoblar' };
const label = (value: unknown) => value == null || value === '' ? undefined : labels[String(value)] || String(value);
const factIcons: Record<string, typeof House> = { Tipo: House, Operación: KeyRound, Estado: CheckCircle, Ambientes: Grid2X2, Dormitorios: BedDouble, Baños: Bath, 'Superficie cubierta': Ruler, 'Superficie total': Maximize, Dirección: MapPin, Zona: MapPin, Ciudad: MapPin, Destino: House, 'Plazo de contrato': CalendarDays, Ajuste: TrendingUp, 'Índice de ajuste': Percent, Expensas: Wallet, Mascotas: PawPrint, Amoblado: Sofa };
function Facts({ rows }: { rows: [string, unknown][] }) {
  const available = rows.filter(([, value]) => value !== undefined && value !== null && value !== '');
  return <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-7">{available.map(([key, value]) => { const Icon = factIcons[key] || House; return <div key={key} className="flex gap-3 items-start"><span className="p-2.5 rounded-xl bg-[#E6E0D6]/5 text-[#E6E0D6]/80"><Icon size={18} strokeWidth={1.5} aria-hidden="true" /></span><div><dt className="text-xs text-[#F4F1EB]/55 mb-2">{key}</dt><dd className="text-sm text-[#E6E0D6] break-words">{String(value)}</dd></div></div>; })}</dl>;
}
function safeMapLink(value: unknown) {
  try { const url = new URL(String(value)); return ['http:', 'https:'].includes(url.protocol) ? url.href : undefined; } catch { return undefined; }
}
export function PropertyDetailPage({ property, phone }: { property?: Listing; phone?: string }) {
  const seo = propertyMetadata(property?.details || {});
  usePageSeo(seo.title, seo.description, property ? { '@type':'RealEstateListing', name: property.title, image:property.image, description:seo.description } : undefined, !property);
  const navbarRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (window.location.hash === '#contacto') document.getElementById('contacto')?.scrollIntoView();
  }, [property]);
  const d = property?.details || {};
  const rental = property?.operation.includes('ALQUILER');
  const lat = d.lat == null ? NaN : Number(d.lat), lng = d.lng == null ? NaN : Number(d.lng);
  const coordinates = Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180;
  const maps = safeMapLink(d.linkMaps) || (coordinates ? `https://www.google.com/maps/search/?api=1&query=${lat},${lng}` : undefined);
  const photos = property?.photos.length ? property.photos : [{ id: 'placeholder', url: '/images/property-placeholder.svg' }];
  const rentPrice = property?.operation === 'VENTA / ALQUILER' ? property.rentPrice : property?.price;
  const rentCurrency = property?.operation === 'VENTA / ALQUILER' ? property.rentCurrency || property.currency : property?.currency;
  return <><Navbar headerRef={navbarRef} logoVisible solid homeHref="/" /><main className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-16 pt-28 md:pt-36 pb-20">
    <SiteLink href="/propiedades" className="inline-flex items-center gap-3 text-xs text-[#E6E0D6]/70"><ArrowLeft size={16} /> Volver a propiedades</SiteLink>
    {!property ? <section className="py-24"><h1 className="text-4xl font-light mb-5">Esta propiedad no está disponible.</h1><p className="text-[#E6E0D6]/60">Visitá nuestro catálogo para conocer otras opciones.</p></section> : <>
      <header className="mt-10 mb-10"><p className="text-xs tracking-[0.22em] uppercase text-[#E6E0D6]/65 mb-4">{property.type} · {property.operation}</p><h1 className="text-4xl md:text-5xl font-light tracking-tight">{property.title}</h1><div className="mt-5 text-sm text-[#E6E0D6]/70">
        {maps ? <SiteLink href={maps} target="_blank" rel="noopener noreferrer" title="Abrir ubicación en Google Maps (nueva pestaña)" className="inline-flex items-center gap-2 hover:text-[#F4F1EB] underline underline-offset-4 decoration-[#E6E0D6]/30 focus-visible:outline-2 focus-visible:outline-offset-4 rounded-sm">
          <MapPin size={16} className="shrink-0" aria-hidden="true" /><span>{[d.direccion, property.location].filter(Boolean).join(' · ') || 'Ver ubicación en Google Maps'}</span><ExternalLink size={14} className="shrink-0" aria-hidden="true" />
        </SiteLink> : <p className="flex items-center gap-2"><MapPin size={16} className="shrink-0" aria-hidden="true" />{[d.direccion, property.location].filter(Boolean).join(' · ')}</p>}
      </div></header>
      <PropertyGallery photos={photos} title={property.title} />
      <section className="flex flex-wrap gap-x-12 gap-y-4 py-7 border-b border-[#E6E0D6]/15">
          {property.operation !== 'ALQUILER' && <div className=""><p className="text-xs text-[#E6E0D6]/60 mb-2 uppercase tracking-widest">Valor de venta</p><p className="text-3xl font-light">{priceLabel(property.price, property.currency)}</p></div>}
          {rental && <div><p className="text-xs text-[#E6E0D6]/60 mb-2 uppercase tracking-widest">Alquiler mensual</p><p className="text-3xl font-light">{rentPrice == null ? 'Consultar' : priceLabel(rentPrice, rentCurrency || property.currency)}</p></div>}
        </section>
      <div className="grid mt-10 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_380px] gap-8 xl:gap-12 items-start">
        <div className="min-w-0 space-y-8">

          {property.description && <section className="detail-panel"><h2 className="text-xl font-medium mb-6">Sobre esta propiedad</h2><p className="text-sm leading-loose text-[#F4F1EB]/75 whitespace-pre-line">{property.description}</p></section>}
          <section className="detail-panel"><h2 className="text-xl font-medium mb-6">Características principales</h2><Facts rows={[
            ['Tipo', property.type], ['Operación', property.operation], ['Estado', 'Disponible'], ['Ambientes', d.ambientes], ['Dormitorios', d.dormitorios], ['Baños', d.banios], ['Superficie cubierta', d.supCubierta == null ? undefined : `${d.supCubierta} m²`], ['Superficie total', d.supTotal == null ? undefined : `${d.supTotal} m²`], ['Dirección', d.direccion], ['Zona', d.zona], ['Ciudad', d.ciudad],
          ]} /></section>
          {rental && <section className="detail-panel"><h2 className="text-xl font-medium mb-6">Condiciones de alquiler</h2><Facts rows={[
            ['Destino', label(d.destino)], ['Plazo de contrato', d.plazoContrato === 'otro' ? d.plazoOtro || 'Consultar' : label(d.plazoContrato)], ['Ajuste', d.ajuste === 'otro' ? d.ajusteOtro || 'Consultar' : label(d.ajuste)], ['Índice de ajuste', d.indiceAjuste === 'fijo' && d.indiceFijoPct != null ? `Fijo: ${d.indiceFijoPct}%` : label(d.indiceAjuste)], ['Expensas', d.expensas], ['Mascotas', label(d.mascotas)], ['Amoblado', label(d.amoblado)]
          ]} /><p className="text-xs text-[#E6E0D6]/50 mt-6">Consultanos por las condiciones que no figuren detalladas.</p></section>}
          {(maps || coordinates) && <section className="detail-panel"><h2 className="text-xl font-medium mb-6">Ubicación</h2>{coordinates && <iframe title={`Ubicación de ${property.title}`} loading="lazy" referrerPolicy="no-referrer" src={`https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`} className="w-full h-72 border-0 rounded-sm" />}{maps && <SiteLink href={maps} target="_blank" rel="noopener noreferrer" className="inline-flex gap-2 items-center text-sm text-[#E6E0D6] mt-5 underline">Abrir en Google Maps <ExternalLink size={16} /></SiteLink>}</section>}
          <p className="text-xs text-[#E6E0D6]/45">Referencia: {property.id}{d.updatedAt && ` · Actualizada el ${new Date(d.updatedAt).toLocaleDateString('es-AR')}`}</p>
        </div>
        <aside className="space-y-6 lg:sticky lg:top-28"><PropertyInquiry property={property} phone={phone} /></aside>
      </div>
    </>}
  </main><Footer homeHref="/" /></>;
}

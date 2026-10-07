import { usePageSeo } from '../lib/page-seo';
import { useSearchParams } from 'react-router-dom';
import { useResource } from '../lib/resource';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './ui/select';
import { SiteLink } from './SiteLink';
import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Search, SlidersHorizontal, X } from 'lucide-react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { PropertyCard } from './PropertyCard';
import { defaults, filterCatalog, fromApi, type Filters, type Listing, typeLabels } from '../lib/catalog';

function readLocation(query: URLSearchParams) {
  const filters = { ...defaults };
  for (const key of Object.keys(filters) as (keyof Filters)[]) filters[key] = query.get(key) || defaults[key];
  filters.moneda = ''; // El rango se aplica a los importes publicados, sin conversión.
  return { filters, page: Math.max(1, Number(query.get('pagina')) || 1) };
}
export function PropertiesPage() {
  const header = useRef<HTMLElement>(null);
  const [search, setSearch] = useSearchParams();
  const location = readLocation(search);
  const { data, loading, error, retry } = useResource('/api/properties');
  const items: Listing[] = (data?.data || []).map(fromApi);
  const [mobileFilters, setMobileFilters] = useState(false);
  usePageSeo('Propiedades en venta y alquiler | Ubikka', 'Explorá propiedades disponibles en Tucumán. Filtrá por operación, tipo, zona, dormitorios y precio.');
  function update(filters: Filters, page = 1) {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(filters)) if (value && value !== defaults[key as keyof Filters]) query.set(key, value);
    if (page > 1) query.set('pagina', String(page));
    setSearch(query, { replace: true });
  }
  const f = location.filters;
  const change = (key: keyof Filters, value: string) => update({ ...f, [key]: value });
  const filtered = filterCatalog(items, f);
  const pages = Math.max(1, Math.ceil(filtered.length / 12)), page = Math.min(pages, Math.floor(location.page));
  const visible = filtered.slice((page - 1) * 12, page * 12);
  const zones = [...new Set<string>(items.map(p => p.zone).filter(Boolean))].sort();
  const types = [...new Set<string>(items.map(p => p.rawType))].sort();
  const active = Object.entries(f).filter(([key, value]) => value && value !== defaults[key as keyof Filters]).length;
  const select = (label: string, key: keyof Filters, options: [string, string][], all = true) => <div className="catalog-field"><span id={`label-${key}`}>{label}</span><Select value={f[key] || 'all'} onValueChange={value => change(key, value === 'all' ? '' : value)}><SelectTrigger aria-labelledby={`label-${key}`} className="mt-2 h-12 rounded-lg"><SelectValue /></SelectTrigger><SelectContent>{all && <SelectItem value="all">Todas</SelectItem>}{options.map(([value, name]) => <SelectItem key={value} value={value}>{name}</SelectItem>)}</SelectContent></Select></div>;
  return <><Navbar headerRef={header} logoVisible solid homeHref="/" />
    <main className="catalog-page mx-auto max-w-[1680px] px-6 md:px-12 lg:px-16 pt-32 md:pt-40 pb-24">
      <SiteLink href="/" className="inline-flex items-center gap-2 text-xs text-[#E6E0D6]/70"><ArrowLeft size={15} /> Inicio</SiteLink>
      <header className="mt-10 mb-12"><p className="text-[10px] tracking-[0.3em] uppercase text-[#E6C43F] mb-4">VENTA · ALQUILER</p><h1 className="text-4xl md:text-6xl font-semibold tracking-tight">Propiedades disponibles.</h1><p className="mt-5 text-sm text-[#E6E0D6]/70">Revisá ubicación, características, superficie, precio y condiciones publicadas.</p></header>
      <div className="catalog-search"><Search size={19} aria-hidden="true" /><input aria-label="Buscar propiedades" placeholder="Buscá por título, ubicación o características…" value={f.q} onChange={e => change('q', e.target.value)} />{f.q && <button aria-label="Limpiar búsqueda" onClick={() => change('q', '')}><X size={18} /></button>}</div>
      <button className="catalog-button lg:hidden mt-5" aria-expanded={mobileFilters} aria-controls="catalog-filters" onClick={() => setMobileFilters(!mobileFilters)}><SlidersHorizontal size={16} /> Filtros {active > 0 && `(${active})`}</button>
      <div className="grid lg:grid-cols-[300px_minmax(0,1fr)] gap-8 xl:gap-12 mt-8">
        <aside id="catalog-filters" className={`${mobileFilters ? 'block' : 'hidden'} lg:block`}>
          <div className="catalog-filter-panel"><div className="flex items-center justify-between mb-7"><h2 className="text-sm tracking-widest uppercase">Filtrar</h2><SlidersHorizontal size={16} /></div>
            {select('Operación', 'op', [['venta','Venta'], ['alquiler','Alquiler']])}
            {select('Tipo de propiedad', 'tipo', types.map(t => [t, typeLabels[t] || t]))}
            {select('Zona', 'zona', zones.map(z => [z,z]))}
            {select('Dormitorios', 'dormitorios', [['1','1 dormitorio'],['2','2 dormitorios'],['3','3 dormitorios'],['4','4 o más']])}
            <div className="grid grid-cols-2 gap-3">{(['min','max'] as const).map(key => <label className="catalog-field" key={key}>{key === 'min' ? 'Precio desde' : 'Precio hasta'}<input type="number" min="0" placeholder="—" value={f[key]} onChange={e => change(key, e.target.value)} /></label>)}</div>
            <p className="text-xs leading-relaxed text-[#E6E0D6]/50 mb-5">Importes en la moneda publicada de cada propiedad, sin conversión.</p>
            {f.min && f.max && Number(f.min) > Number(f.max) && <p role="alert" className="text-sm text-amber-200 mb-4">El precio mínimo supera al máximo.</p>}
            <button className="catalog-button w-full" onClick={() => update({ ...defaults })}><X size={14} /> Limpiar filtros</button>
            <button className="catalog-button w-full mt-3 lg:hidden" onClick={() => setMobileFilters(false)}>Ver resultados</button>
          </div>
        </aside>
        <section aria-label="Resultados de propiedades" aria-busy={loading}>
          <div className="flex flex-wrap gap-4 items-center justify-between mb-6"><p className="text-sm text-[#E6E0D6]/65" aria-live="polite">{loading ? 'Cargando propiedades…' : `${filtered.length} ${filtered.length === 1 ? 'propiedad encontrada' : 'propiedades encontradas'}`}</p><div className="w-48">{select('Ordenar', 'orden', [['recent','Más recientes'],['price-asc','Menor importe'],['price-desc','Mayor importe']], false)}</div></div>
          {loading ? <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">{[1,2,3,4].map(i => <div key={i} className="animate-pulse h-96 bg-[#3A3936] border border-[#E6E0D6]/10 rounded-sm" />)}</div> : error ? <div className="catalog-empty" role="alert"><h2>No pudimos cargar el catálogo</h2><p>{error}</p><button className="catalog-button" onClick={retry}>Reintentar</button></div> : !visible.length ? <div className="catalog-empty"><h2>No encontramos propiedades</h2><p>Probá con otros filtros o consultanos por lo que estás buscando.</p><button className="catalog-button" onClick={() => update({ ...defaults })}>Limpiar filtros</button><SiteLink href="/#contacto" className="text-sm underline">Contactar</SiteLink></div> : <><div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-8">{visible.map(p => <PropertyCard key={p.id} property={p} />)}</div><nav aria-label="Paginación" className="flex items-center justify-between gap-3 mt-10"><button className="catalog-button" disabled={page <= 1} onClick={() => { update(f,page-1); window.scrollTo({ top: 220, behavior: 'smooth' }); }}><ArrowLeft size={16} /> Anterior</button><span className="text-xs text-[#E6E0D6]/70">{page} / {pages}</span><button className="catalog-button" disabled={page >= pages} onClick={() => { update(f,page+1); window.scrollTo({ top: 220, behavior: 'smooth' }); }}>Siguiente <ArrowRight size={16} /></button></nav></>}
        </section>
      </div>
    </main><Footer homeHref="/" />

  </>;
}

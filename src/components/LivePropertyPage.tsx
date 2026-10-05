import { NotFoundPage } from './NotFoundPage';
import { useParams } from 'react-router-dom';
import { useRef } from 'react';
import { fromApi } from '../lib/catalog';
import { useResource } from '../lib/resource';
import { useSite } from '../lib/site';
import { PropertyDetailPage } from './PropertyDetailPage';
import { Navbar } from './Navbar';
export function LivePropertyPage() {
  const { slug = '' } = useParams();
  const { data, loading, error, retry } = useResource(`/api/properties?id=${encodeURIComponent(slug)}`);
  const site = useSite(), header = useRef<HTMLElement>(null);
  if (loading || error) return <><Navbar headerRef={header} logoVisible solid homeHref="/" /><main className="max-w-7xl mx-auto px-6 pt-36 pb-20">{error ? <section className="catalog-empty" role="alert"><h1>No pudimos cargar esta propiedad</h1><p>{error}</p><button onClick={retry} className="catalog-button">Reintentar</button></section> : <div role="status" aria-label="Cargando propiedad" className="space-y-8"><div className="h-12 w-2/3 bg-white/5 rounded-xl animate-pulse" /><div className="h-[50vh] bg-white/5 rounded-xl animate-pulse" /></div>}</main></>;
  if (!data?.property) return <NotFoundPage />;
  return <PropertyDetailPage key={slug} property={data?.property ? fromApi(data.property) : undefined} phone={site?.telefono?.replace(/\D/g, '')} />;
}

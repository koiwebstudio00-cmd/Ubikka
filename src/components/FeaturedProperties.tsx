import { SiteLink } from './SiteLink';
import { useResource } from '../lib/resource';
import { fromApi } from '../lib/catalog';
import React, { useState } from 'react';
import { Property } from '../data/properties';
import { PropertyCard } from './PropertyCard';
import { ArrowRight } from 'lucide-react';

interface FeaturedPropertiesProps {
  onSelectProperty?: (property: Property) => void;
}

export const FeaturedProperties: React.FC<FeaturedPropertiesProps> = ({
  onSelectProperty,
}) => {
  const [filter, setFilter] = useState<'TODAS' | 'VENTA' | 'ALQUILER'>('TODAS');

  const { data, loading, error, retry } = useResource('/api/properties');
  const properties: Property[] = (data?.data || []).map(fromApi);
  const filteredProperties = [...properties].sort((a, b) => Number(b.featured) - Number(a.featured)).filter((p) => {
    if (filter === 'TODAS') return true;
    return p.operation.includes(filter);
  }).slice(0, 6);

  return (
    <section id="propiedades" aria-labelledby="properties-title" className="py-24 md:py-36 bg-[#0E1216] border-t border-[#E6E0D6]/05">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-[10px] md:text-[11px] tracking-[0.35em] uppercase font-medium text-[#E6E0D6]/80 block mb-3">
              PROPIEDADES
            </span>
            <h2 id="properties-title" className="text-3xl md:text-4xl lg:text-5xl font-light text-[#F4F1EB] tracking-tight">
              Propiedades destacadas
            </h2>
            <p className="text-[14px] md:text-[15px] font-normal text-[#6B6F76] mt-3 max-w-xl">
              Una selección de espacios elegidos por su arquitectura, ubicación y potencial.
            </p>
          </div>

          {/* Desktop Right Link & Operation Filters */}
          <div className="flex flex-col md:items-end gap-4 shrink-0">
            {/* Filter buttons */}
            <div className="flex items-center gap-2 border-b border-[#E6E0D6]/10 pb-2">
              {(['TODAS', 'VENTA', 'ALQUILER'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`text-[11px] tracking-[0.2em] uppercase font-medium transition-all px-3 py-1.5 ${
                    filter === tab
                      ? 'text-[#E6E0D6] border-b-2 border-[#E6E0D6]'
                      : 'text-[#6B6F76] hover:text-[#F4F1EB]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <SiteLink
              href="/propiedades"
              className="hidden md:inline-flex items-center gap-2 text-[12px] tracking-[0.25em] uppercase font-medium text-[#E6E0D6] hover:text-white transition-colors duration-300 group"
            >
              <span>VER TODAS</span>
              <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
            </SiteLink>
          </div>
        </div>

        {loading && <div role="status" aria-label="Cargando propiedades" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-12">
          <span className="sr-only">Cargando propiedades…</span>
          {[1, 2, 3].map(i => <div key={i} aria-hidden="true" className="motion-safe:animate-pulse border border-[#E6E0D6]/10">
            <div className="aspect-[4/3] bg-[#1B1F26]" />
            <div className="p-8 space-y-5"><div className="h-4 w-2/3 bg-[#1B1F26]" /><div className="h-7 w-3/4 bg-[#1B1F26]" /><div className="h-16 bg-[#1B1F26]" /></div>
          </div>)}
        </div>}
        {error && <p role="alert">No pudimos cargar las propiedades. <button onClick={retry} className="underline">Reintentar</button></p>}
        {!loading && !error && !filteredProperties.length && <p className="text-sm text-[#F4F1EB]/65">No hay propiedades disponibles para esta operación.</p>}
        {/* Properties Grid - 2 columns on desktop/tablet, 1 column on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-12">
          {filteredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onSelectProperty={onSelectProperty}
            />
          ))}
        </div>

        {/* Mobile View All CTA */}
        <div className="mt-12 text-center md:hidden">
          <SiteLink
            href="/propiedades"
            className="inline-flex items-center gap-2 text-[12px] tracking-[0.25em] uppercase font-medium text-[#E6E0D6] border border-[#E6E0D6]/20 px-6 py-3"
          >
            <span>VER TODAS</span>
            <ArrowRight size={15} />
          </SiteLink>
        </div>
      </div>
    </section>
  );
};

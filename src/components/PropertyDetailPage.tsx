import React, { useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, MapPin } from 'lucide-react';
import { Property } from '../data/properties';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Contact } from './Contact';
import { PropertyFacts } from './PropertyFacts';

export function PropertyDetailPage({ property }: { property?: Property }) {
  const navbarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = property ? `${property.title} · ${property.operation === 'VENTA' ? 'Venta' : 'Alquiler'} | UBIKKA` : 'Propiedad no encontrada | UBIKKA';
    return () => { document.title = previousTitle; };
  }, [property]);

  return (
    <>
      <Navbar headerRef={navbarRef} logoVisible solid homeHref="/" />
      <main className="property-page">
        <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-16 pt-28 md:pt-36 pb-16 md:pb-24">
          <a href="/#propiedades" className="inline-flex items-center gap-3 text-[10px] sm:text-xs tracking-[0.18em] uppercase text-[#E6E0D6]/75 hover:text-white transition-colors">
            <ArrowLeft size={16} aria-hidden="true" /> Volver a propiedades
          </a>

          {property ? (
            <article className="property-page-enter mt-10 md:mt-14" aria-labelledby="property-title">
              <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-10">
                <div>
                  <p className="text-[10px] tracking-[0.25em] uppercase text-[#E6E0D6]/65 mb-4">{property.type} · {property.operation}</p>
                  <h1 id="property-title" className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-[-0.035em] leading-tight">{property.title}</h1>
                  <p className="mt-5 flex items-center gap-2 text-sm text-[#E6E0D6]/70">
                    <MapPin size={16} strokeWidth={1.5} aria-hidden="true" /> {property.location}
                  </p>
                </div>
                <a href="#contacto" className="property-action property-action-secondary property-heading-action">
                  Consultar <ArrowRight size={17} aria-hidden="true" />
                </a>
              </header>

              <figure className="overflow-hidden bg-[#1B1F26] border border-[#E6E0D6]/10">
                <img src={property.image} alt={property.title} fetchPriority="high" className="w-full aspect-[4/3] md:aspect-[21/10] object-cover" />
              </figure>

              <div className="grid lg:grid-cols-[minmax(0,1fr)_380px] gap-10 lg:gap-20 mt-10 md:mt-16 items-start">
                <section aria-labelledby="property-description-title">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[#E6E0D6]/60 mb-4">La propiedad</p>
                  <h2 id="property-description-title" className="text-2xl md:text-3xl font-light mb-6">Un espacio para tu próxima etapa.</h2>
                  {property.description && <p className="text-[#F4F1EB]/70 text-sm md:text-base leading-loose max-w-2xl mb-9">{property.description}</p>}
                  <PropertyFacts property={property} />
                </section>

                <aside aria-label="Precio y consulta" className="bg-[#1B1F26]/60 border border-[#E6E0D6]/15 p-7 md:p-8">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[#E6E0D6]/60 mb-3">{property.operation === 'VENTA' ? 'Valor de venta' : 'Alquiler mensual'}</p>
                  <p className="text-2xl sm:text-3xl font-light text-[#E6E0D6] mb-6">{property.formattedPrice}</p>
                  <p className="text-sm leading-relaxed text-[#F4F1EB]/65 mb-7">¿Te imaginás acá? Consultanos por esta propiedad y te acompañamos en el próximo paso.</p>
                  <a href="#contacto" className="property-action property-action-primary">Consultar propiedad <ArrowRight size={17} aria-hidden="true" /></a>
                </aside>
              </div>
            </article>
          ) : (
            <section className="py-24 max-w-2xl">
              <p className="text-xs tracking-[0.25em] text-[#E6E0D6]/60 mb-5">404 · PROPIEDAD NO ENCONTRADA</p>
              <h1 className="text-4xl md:text-5xl font-light leading-tight mb-6">Esta propiedad no está disponible.</h1>
              <p className="text-[#E6E0D6]/70 leading-relaxed">Podés volver a las propiedades destacadas o escribirnos para que te ayudemos a encontrar lo que buscás.</p>
            </section>
          )}
        </div>
        <Contact selectedProperty={property} />
      </main>
      <Footer homeHref="/" />
    </>
  );
}

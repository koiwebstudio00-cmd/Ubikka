import React from 'react';
import { ABOUT_IMAGE } from '../data/properties';
import { ArrowRight } from 'lucide-react';

export const AboutUs: React.FC = () => {
  return (
    <section id="nosotros" className="py-24 md:py-36 bg-[#1B1F26] border-t border-b border-[#E6E0D6]/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Column: Architectural Interior Photography */}
          <div className="relative group">
            <div className="relative aspect-[4/5] sm:aspect-[4/3] lg:aspect-[4/5] overflow-hidden border border-[#E6E0D6]/15">
              <img
                src={ABOUT_IMAGE}
                alt="UBIKKA Criterio Arquitectónico e Interiorismo"
                className="w-full h-full object-cover object-center grayscale-[15%] group-hover:grayscale-0 transition-all duration-700 ease-out group-hover:scale-[1.02]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-[#0E1216]/20 group-hover:bg-transparent transition-colors duration-500" />
            </div>

            {/* Subtle decorative accent corner frame */}
            <div className="absolute -bottom-3 -right-3 w-24 h-24 border-r border-b border-[#E6E0D6]/30 hidden sm:block pointer-events-none" />
          </div>

          {/* Right Column: Editorial Copy */}
          <div className="flex flex-col justify-center">
            {/* Eyebrow */}
            <span className="text-[10px] md:text-[11px] tracking-[0.35em] uppercase font-medium text-[#E6E0D6]/80 block mb-4">
              ABOUT US
            </span>

            {/* Heading */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-[#F4F1EB] leading-[1.25] tracking-tight mb-8">
              Una forma diferente de vivir el mercado inmobiliario.
            </h2>

            {/* Paragraphs with generous spacing */}
            <div className="space-y-6 text-[#F4F1EB]/80 text-[15px] md:text-[16px] font-normal leading-relaxed">
              <p>
                En UBIKKA entendemos que elegir una propiedad es mucho más que encontrar metros cuadrados.
              </p>
              <p>
                Buscamos espacios que conecten con la forma de vivir, invertir y proyectar el futuro de cada persona.
              </p>
              <p>
                Combinamos conocimiento del mercado, criterio arquitectónico y acompañamiento personalizado para construir relaciones de largo plazo.
              </p>
            </div>

            {/* Text-only CTA */}
            <div className="mt-10 pt-4">
              <a
                href="#contacto"
                className="inline-flex items-center gap-3 text-[12px] tracking-[0.25em] uppercase font-medium text-[#E6E0D6] hover:text-white transition-colors duration-300 group py-2"
              >
                <span>CONOCER UBIKKA</span>
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-2" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { CTA_BACKGROUND_IMAGE } from '../data/properties';
import { ArrowRight } from 'lucide-react';

export const CTASection: React.FC = () => {
  return (
    <section className="relative w-full h-[420px] md:h-[500px] flex items-center justify-center overflow-hidden bg-[#0E1216]">
      {/* Full-width Background Photo */}
      <div className="absolute inset-0 z-0">
        <img
          src={CTA_BACKGROUND_IMAGE}
          alt="Living contemporáneo con grandes ventanales al atardecer"
          className="w-full h-full object-cover object-center"
          loading="lazy"
        />
        {/* Dark overlay for contrast */}
        <div className="absolute inset-0 bg-[#0E1216]/75 backdrop-blur-[2px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col items-center justify-center">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-[#F4F1EB] tracking-tight leading-[1.25] mb-4">
          Encontrá la propiedad <br className="hidden sm:inline" />
          <span className="text-[#E6E0D6] font-normal">ideal para vos.</span>
        </h2>

        {/* Subtitle */}
        <p className="text-[14px] md:text-[16px] text-[#F4F1EB]/80 font-normal max-w-xl mb-8 leading-relaxed">
          Contanos qué estás buscando y nosotros nos ocupamos del resto.
        </p>

        {/* CTA Button */}
        <a
          href="#contacto"
          className="inline-flex items-center gap-3 border border-[#E6E0D6] text-[#E6E0D6] hover:bg-[#E6E0D6] hover:text-[#0E1216] font-medium text-[12px] tracking-[0.25em] uppercase px-8 py-4 transition-all duration-300 group"
        >
          <span>AGENDAR CONSULTA</span>
          <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1.5" />
        </a>
      </div>
    </section>
  );
};

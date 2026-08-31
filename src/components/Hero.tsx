import React from 'react';
import { HERO_BACKGROUND_IMAGE } from '../data/properties';
import { ArrowRight } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section id="hero" className="relative w-full h-screen min-h-[640px] max-h-[1080px] flex items-center overflow-hidden bg-[#0E1216]">
      {/* Background Photograph */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_BACKGROUND_IMAGE}
          alt="UBIKKA Arquitectura Residencial Contemporánea"
          className="w-full h-full object-cover object-center scale-105 animate-subtleZoom"
        />
        {/* Soft dark vignette & gradient overlay for legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0E1216]/90 via-[#0E1216]/65 to-[#0E1216]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E1216] via-transparent to-[#0E1216]/30" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-12 pt-20 md:pt-0">
        <div className="max-w-2xl text-left">
          {/* Eyebrow */}
          <span className="inline-block text-[10px] md:text-[11px] tracking-[0.35em] uppercase font-medium text-[#E6E0D6]/80 mb-5">
            UBIKKA INMOBILIARIA
          </span>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-[#F4F1EB] leading-[1.25] tracking-tight mb-6">
            Espacios que inspiran <br className="hidden sm:inline" />
            <span className="text-[#E6E0D6] font-normal">una nueva forma de vivir.</span>
          </h1>

          {/* Decorative Horizontal Branding Line */}
          <div className="w-16 h-[1px] bg-[#E6E0D6]/40 my-6" />

          {/* Description */}
          <p className="text-[14px] md:text-[16px] font-normal text-[#F4F1EB]/75 leading-relaxed max-w-xl mb-10">
            Encontramos propiedades excepcionales y acompañamos cada decisión con una mirada personalizada.
          </p>

          {/* Primary CTA Button */}
          <div>
            <a
              href="#propiedades"
              className="inline-flex items-center gap-3 bg-[#E6E0D6] text-[#0E1216] font-medium text-[13px] tracking-[0.2em] uppercase px-8 py-4 hover:bg-white transition-all duration-300 group shadow-lg"
            >
              <span>VER PROPIEDADES</span>
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator - subtle line */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
        <span className="text-[9px] tracking-[0.3em] uppercase text-[#E6E0D6]">Scroll</span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-[#E6E0D6] to-transparent animate-pulse" />
      </div>
    </section>
  );
};

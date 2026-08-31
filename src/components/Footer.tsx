import React from 'react';
import { Logo } from './Logo';

export const Footer: React.FC<{ homeHref?: string }> = ({ homeHref = '' }) => {
  return (
    <footer className="bg-[#090D10] text-[#F4F1EB] pt-20 pb-12 border-t border-[#E6E0D6]/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* 3 Columns Desktop Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 pb-16 border-b border-[#E6E0D6]/08">
          
          {/* Column 1: Logo & Slogan */}
          <div className="flex flex-col items-start space-y-4">
            <Logo variant="cream" href={`${homeHref}#hero`} />
            <p className="text-[13px] text-[#6B6F76] font-normal tracking-wide pl-0.5 pt-2">
              Espacios que construyen futuro.
            </p>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#E6E0D6]/60 font-medium block mb-5">
              Navegación
            </span>
            <ul className="space-y-3 text-[13px] tracking-[0.15em] font-normal text-[#F4F1EB]/80 uppercase">
              <li>
                <a href={`${homeHref}#hero`} className="hover:text-[#E6E0D6] transition-colors">
                  Inicio
                </a>
              </li>
              <li>
                <a href={`${homeHref}#propiedades`} className="hover:text-[#E6E0D6] transition-colors">
                  Propiedades
                </a>
              </li>
              <li>
                <a href={`${homeHref}#nosotros`} className="hover:text-[#E6E0D6] transition-colors">
                  Nosotros
                </a>
              </li>
              <li>
                <a href="#contacto" className="hover:text-[#E6E0D6] transition-colors">
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Social */}
          <div>
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#E6E0D6]/60 font-medium block mb-5">
              Contacto
            </span>
            <div className="space-y-2 text-[14px] text-[#F4F1EB]/80 font-normal">
              <p>
                <a href="tel:+543815550123" className="hover:text-[#E6E0D6] transition-colors">
                  +54 381 555 0123
                </a>
              </p>
              <p>
                <a href="mailto:hola@ubikka.com.ar" className="hover:text-[#E6E0D6] transition-colors">
                  hola@ubikka.com.ar
                </a>
              </p>

              <div className="flex items-center gap-6 pt-4 text-[12px] tracking-[0.2em] uppercase text-[#E6E0D6]">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline hover:text-white transition-colors"
                >
                  Instagram
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline hover:text-white transition-colors"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Rights */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#6B6F76] font-normal tracking-wider gap-4">
          <p>© 2026 UBIKKA Inmobiliaria. Todos los derechos reservados.</p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#6B6F76]/60">
            Boutique Real Estate & Architecture
          </p>
        </div>
      </div>
    </footer>
  );
};

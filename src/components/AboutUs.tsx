import { SiteLink } from './SiteLink';
import React, { useEffect, useRef } from 'react';
import { ABOUT_IMAGE } from '../data/properties';
import { ArrowRight } from 'lucide-react';

export const AboutUs: React.FC = () => {
  const copyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const copy: HTMLDivElement | null = copyRef.current;
    if (!copy) return;
    const items = copy.querySelectorAll('.about-reveal');
    if (!('IntersectionObserver' in window)) {
      items.forEach((item) => item.classList.add('is-revealed'));
      return;
    }

    // Observe the text itself so mobile's taller image doesn't trigger it early.
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <section aria-labelledby="about-title" className="py-24 md:py-36 bg-[#3A3936] border-t border-b border-[#E6E0D6]/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Column: Portrait */}
          <div className="relative group">
            <div className="relative aspect-[4/5] sm:aspect-[4/3] lg:aspect-[4/5] overflow-hidden border border-[#E6E0D6]/15">
              <img
                src={ABOUT_IMAGE}
                alt="Retrato del equipo de Ubikka"
                width="1122"
                height="1402"
                className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-[#3A3936]/20 group-hover:bg-transparent transition-colors duration-500" />
            </div>

            {/* Subtle decorative accent corner frame */}
            <div className="absolute -bottom-3 -right-3 w-24 h-24 border-r border-b border-[#E6E0D6]/30 hidden sm:block pointer-events-none" />
          </div>

          {/* Right Column: Editorial Copy */}
          <div ref={copyRef} className="about-copy flex flex-col justify-center">
            {/* Eyebrow */}
            <span className="brand-eyebrow about-reveal text-[10px] md:text-[11px] tracking-[0.35em] uppercase font-medium block mb-4">
              NOSOTROS
            </span>

            {/* Heading */}
            <h2 id="about-title" className="about-reveal text-3xl md:text-4xl lg:text-5xl font-light text-[#E6E0D6] leading-[1.25] tracking-tight mb-8">
              Ubicar es encontrar.
            </h2>

            {/* Paragraphs with generous spacing */}
            <div className="space-y-6 text-[#E6E0D6]/80 text-[15px] md:text-[16px] font-normal leading-relaxed">
              <p className="about-reveal">
                Ubikka viene de ubicar: encontrar lo que buscás.
              </p>
              <p className="about-reveal">
                Trabajamos para que se encuentren quien vende y quien compra, quien ofrece un alquiler y quien busca una propiedad.
              </p>
              <p className="about-reveal">
                Nuestro punto amarillo representa ese encuentro y destaca la información que importa para decidir.
              </p>
            </div>

            {/* Text-only CTA */}
            <div className="about-reveal mt-10 pt-4">
              <SiteLink
                href="#contacto"
                className="inline-flex items-center gap-3 text-[12px] tracking-[0.25em] uppercase font-medium text-[#E6E0D6] hover:text-white transition-colors duration-300 group py-2"
              >
                <span>HABLAR CON UBIKKA</span>
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-2" />
              </SiteLink>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

import { SiteLink } from './SiteLink';
import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
  sectionRef: React.RefObject<HTMLElement | null>;
}

export const Hero: React.FC<HeroProps> = ({ sectionRef }) => {
  const [sceneReady, setSceneReady] = useState(false);

  useEffect(() => {
    const scene: HTMLElement | null = sectionRef.current;
    if (!scene) return;
    let cancelled = false;

    // Start the coordinated entrances once the supplied layers are ready to paint.
    const layers = Array.from(scene.querySelectorAll<HTMLImageElement>('.hero-layer img'));
    Promise.all(layers.map((layer) => layer.decode().catch(() => undefined))).then(() => {
      if (!cancelled) setSceneReady(true);
    });

    return () => { cancelled = true; };
  }, [sectionRef]);

  return (
    <section ref={sectionRef} id="hero" className={`hero ${sceneReady ? 'hero-ready' : ''}`} aria-labelledby="hero-title">
      <div className="hero-scene">
        <div className="hero-layer hero-sky" aria-hidden="true">
          <img src="/images/hero-sky.webp" alt="" width="1672" height="941" fetchPriority="high" />
        </div>

        {/* Keep the official artwork in the parallax scene; the accessible name stays as text. */}
        <h1 id="hero-title" className="hero-wordmark">
          <span className="sr-only">Ubikka Inmobiliaria</span>
          <img
            className="hero-wordmark-image"
            src="/images/ubikka-hero-logotipo.png"
            alt=""
            aria-hidden="true"
            width="1983"
            height="793"
            fetchPriority="high"
          />
        </h1>

        <div className="hero-layer hero-house hero-house-back" aria-hidden="true">
          <img className="hero-house-image" src="/images/hero-house.webp" alt="" width="1672" height="941" fetchPriority="high" />
        </div>
        <div className="hero-layer hero-house hero-house-front" aria-hidden="true">
          <img className="hero-house-image" src="/images/hero-house.webp" alt="" width="1672" height="941" fetchPriority="high" />
        </div>
        <div className="hero-shade" aria-hidden="true" />
      </div>

      <div className="hero-content">
        <div className="hero-rule" aria-hidden="true" />
        <p className="hero-description">
          Alquileres · Administración · Ventas<br className="hidden sm:block" />
          {' '}en <strong>San Miguel de Tucumán y Yerba Buena.</strong>
        </p>
        <SiteLink href="#propiedades" className="hero-cta group">
          <span>Ver propiedades</span>
          <ArrowRight size={19} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none" />
        </SiteLink>
      </div>
    </section>
  );
};

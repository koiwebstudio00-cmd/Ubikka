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
          <img src="/images/hero-sky.png" alt="" width="1672" height="941" fetchPriority="high" />
        </div>

        {/* The transparent mountain silhouette masks the wordmark naturally. */}
        <h1 id="hero-title" className="hero-wordmark">
          <span className="hero-wordmark-text">UBIKKA</span>
        </h1>

        <div className="hero-layer hero-house" aria-hidden="true">
          <img className="hero-house-image" src="/images/hero-house.png" alt="" width="1672" height="941" fetchPriority="high" />
        </div>
        <div className="hero-shade" aria-hidden="true" />
      </div>

      <div className="hero-content">
        <div className="hero-rule" aria-hidden="true" />
        <p className="hero-description">
          Residencias exclusivas en las zonas más<br className="hidden sm:block" />
          {' '}privilegiadas de <strong>Tucumán, Argentina.</strong>
        </p>
        <a href="#propiedades" className="hero-cta group">
          <span>Ver propiedades</span>
          <ArrowRight size={19} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none" />
        </a>
      </div>
    </section>
  );
};

import React, { useLayoutEffect, useRef } from 'react';
import { AboutUs } from './AboutUs';
import { CTASection } from './CTASection';

interface AboutCTAProps {
  children: React.ReactNode;
}

export const AboutCTA: React.FC<AboutCTAProps> = ({ children }) => {
  const stackRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const stack: HTMLDivElement | null = stackRef.current;
    const about: HTMLDivElement | null = aboutRef.current;
    const cover: HTMLDivElement | null = coverRef.current;
    if (!stack || !about || !cover) return;
    const navbar = document.querySelector<HTMLElement>('.site-navbar');
    let frame = 0;
    let lastBlur = '';

    const updateBlur = () => {
      frame = 0;
      const viewportHeight = window.innerHeight;
      const navbarBottom = navbar?.getBoundingClientRect().bottom ?? 0;
      const coverTop = cover.getBoundingClientRect().top;
      const progress = Math.min(1, Math.max(0,
        (viewportHeight - coverTop) / Math.max(1, viewportHeight - navbarBottom),
      ));
      // Ease from clear to blurred as the CTA travels from the bottom to the navbar.
      // Position-based progress restores sharpness when scrolling back up.
      const easedProgress = progress * progress * (3 - 2 * progress);
      const blur = `${(12 * easedProgress).toFixed(2)}px`;
      if (blur !== lastBlur) {
        about.style.setProperty('--about-blur', blur);
        lastBlur = blur;
      }
    };
    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateBlur);
    };

    // Let the entire About section be read before the consultation panel covers it.
    // Measure again when fonts or responsive layouts change its height.
    const measure = () => {
      stack.style.setProperty('--about-height', `${about.getBoundingClientRect().height}px`);
      scheduleUpdate();
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(about);
    observer.observe(cover);
    if (navbar) observer.observe(navbar);
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    window.addEventListener('pageshow', measure);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      window.removeEventListener('pageshow', measure);
    };
  }, []);

  return (
    <div ref={stackRef} id="nosotros" className="about-cta-stack">
      <div ref={aboutRef} className="about-sticky">
        <div className="about-blur">
          <AboutUs />
        </div>
      </div>
      {/* Keep the following content in the foreground so the short CTA can
          reach the navbar before the sticky About section is released. */}
      <div ref={coverRef} className="about-cover">
        <CTASection />
        {children}
      </div>
    </div>
  );
};

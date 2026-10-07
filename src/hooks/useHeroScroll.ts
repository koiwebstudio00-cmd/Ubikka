import { useEffect, useRef, useState } from 'react';
import { getPageScrollY } from '../utils/scrollLock';

const clamp = (value: number) => Math.min(1, Math.max(0, value));

export function useHeroScroll() {
  const heroRef = useRef<HTMLElement>(null);
  const navbarRef = useRef<HTMLElement>(null);
  const [logoVisible, setLogoVisible] = useState(false);

  useEffect(() => {
    const hero = heroRef.current;
    const navbar = navbarRef.current;
    if (!hero || !navbar) return;

    let frame = 0;
    let heroTop = 0;
    let heroHeight = 1;
    let lastProgress = -1;
    let visible: boolean | undefined;

    const update = () => {
      frame = 0;
      const progress = clamp((getPageScrollY() - heroTop) / heroHeight);
      if (progress === lastProgress) return;
      lastProgress = progress;

      // Write only to the animated sections, without rerendering on each scroll.
      hero.style.setProperty('--hero-scroll', `${progress * heroHeight}px`);
      const fadeProgress = clamp(progress / 0.75);
      const easedFade = fadeProgress * fadeProgress * (3 - 2 * fadeProgress);
      // Deriving opacity from position makes the fade fully reversible.
      hero.style.setProperty('--hero-wordmark-opacity', String(0.88 - 0.82 * easedFade));
      const mobile = window.innerWidth < 640;
      const wordingStart = mobile ? 0.78 : 0.65;
      navbar.style.setProperty('--logo-reveal', String(clamp((progress - wordingStart) / (1 - wordingStart))));
      navbar.style.setProperty('--surface-reveal', String(clamp((progress - 0.45) / 0.45)));

      const nextVisible = progress > wordingStart;
      if (nextVisible !== visible) {
        visible = nextVisible;
        setLogoVisible(nextVisible);
      }
    };

    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    const measure = () => {
      const bounds = hero.getBoundingClientRect();
      heroTop = bounds.top + getPageScrollY();
      heroHeight = Math.max(1, bounds.height);
      lastProgress = -1;
      scheduleUpdate();
    };

    const observer = new ResizeObserver(measure);
    observer.observe(hero);
    measure();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', measure);
    window.addEventListener('pageshow', measure);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', measure);
      window.removeEventListener('pageshow', measure);
    };
  }, []);

  return { heroRef, navbarRef, logoVisible };
}

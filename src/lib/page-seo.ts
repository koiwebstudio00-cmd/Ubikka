import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
export function usePageSeo(title: string, description: string, entity?: object, unavailable = false) {
  const { pathname } = useLocation();
  const serialized = JSON.stringify(entity || { '@type': 'WebPage', name: title });
  useEffect(() => {
    document.title = title;
    const set = (key: string, content: string, property = false) => {
      const attribute = property ? 'property' : 'name';
      let element = document.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
      if (!element) { element = document.createElement('meta'); element.setAttribute(attribute, key); document.head.append(element); }
      element.content = content;
    };
    set('description', description); set('og:title', title, true); set('og:description', description, true);
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const url = canonical ? new URL(pathname, canonical.href).href : undefined;
    if (canonical && url) { canonical.href = url; set('og:url', url, true); }
    const robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (robots) { robots.dataset.base ??= robots.content; robots.content = unavailable ? 'noindex,follow' : robots.dataset.base; }
    document.querySelectorAll('script[type="application/ld+json"]').forEach(node => node.remove());
    const script = document.createElement('script'); script.type = 'application/ld+json';
    const entityData = JSON.parse(serialized);
    const business = entityData['@type'] === 'RealEstateAgent' && url ? { '@id': `${new URL(url).origin}/#inmobiliaria`, logo: `${new URL(url).origin}/favicon.svg` } : {};
    script.textContent = JSON.stringify({ '@context':'https://schema.org', ...entityData, ...business, ...(url ? {url} : {}) }); document.head.append(script);
  }, [pathname, title, description, serialized, unavailable]);
}

import { useEffect, useState } from 'react';
export interface Site { nombre: string; telefono: string; email: string; direccion: string; ciudad: string }
let request: Promise<Site | null> | undefined;
export function useSite() {
  const [site, setSite] = useState<Site | null>(null);
  useEffect(() => {
    let active = true;
    request ??= fetch('/api/site').then(async response => response.ok ? (await response.json()).site : null).catch(() => null);
    request.then(value => { if (active) setSite(value); });
    return () => { active = false; };
  }, []);
  return site;
}

import { Logo } from './Logo';
import { SiteLink } from './SiteLink';
import { usePageSeo } from '../lib/page-seo';
import { ArrowLeft, ArrowRight } from 'lucide-react';
export function NotFoundPage() {
  usePageSeo('404 · Página no encontrada | Ubikka', 'La página que buscás no existe o ya no está disponible. Explorá el catálogo de Ubikka.', undefined, true);
  return <main className="min-h-dvh flex flex-col items-center justify-center px-6 py-16 text-center"><Logo href="/" className="mb-16" /><p className="text-[100px] md:text-[160px] leading-none font-light text-[#E6E0D6]/20" aria-hidden="true">404</p><h1 className="mt-8 text-3xl md:text-5xl font-light">Este espacio no está disponible.</h1><p className="max-w-lg mt-6 text-sm leading-7 text-[#F4F1EB]/60">La página puede haber cambiado o la propiedad ya no estar publicada. Te ayudamos a encontrar otras opciones.</p><div className="flex flex-wrap justify-center gap-4 mt-10"><SiteLink href="/" className="catalog-button"><ArrowLeft size={16} /> Volver al inicio</SiteLink><SiteLink href="/propiedades" className="property-action property-action-primary">Ver propiedades <ArrowRight size={16} /></SiteLink></div><SiteLink href="/privacidad" className="mt-16 text-xs underline text-[#F4F1EB]/50">Privacidad</SiteLink></main>;
}

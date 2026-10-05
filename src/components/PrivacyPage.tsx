import { useRef } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { SiteLink } from './SiteLink';
import { useSite } from '../lib/site';
import { usePageSeo } from '../lib/page-seo';
import { privacyTitle, privacyDescription, privacySections } from '../../shared/public-content';
export function PrivacyPage() {
  const header = useRef<HTMLElement>(null), site = useSite();
  usePageSeo(privacyTitle, privacyDescription);
  return <><Navbar headerRef={header} logoVisible solid homeHref="/" /><main className="max-w-4xl mx-auto px-6 pt-36 pb-24"><p className="text-xs tracking-widest uppercase text-[#E6E0D6]/60">Ubikka Inmobiliaria</p><h1 className="text-4xl md:text-5xl font-light mt-5 mb-6">Privacidad y datos personales</h1><p className="text-sm text-[#F4F1EB]/50 mb-12">Última actualización: 5 de octubre de 2026.</p><div className="space-y-10">{privacySections.map(([title, text]) => <section key={title}><h2 className="text-xl mb-4">{title}</h2><p className="text-sm leading-8 text-[#F4F1EB]/70">{text}</p></section>)}</div><section className="detail-panel mt-12"><h2 className="text-xl mb-4">Contactar a Ubikka</h2>{site?.email && <p className="mb-4"><a href={`mailto:${site.email}`} className="underline">{site.email}</a></p>}<SiteLink href="/#contacto" className="underline underline-offset-4">Ir al formulario de contacto</SiteLink></section></main><Footer /></>;
}

import { Logo } from './Logo';
import { SiteLink } from './SiteLink';
import { useSite } from '../lib/site';
import { Mail, MapPin, MessageSquare, Phone } from 'lucide-react';
import { brandContact } from '../../shared/public-content';
export function Footer({ homeHref = '/' }: { homeHref?: string }) {
 const site = useSite();
 return <footer className="bg-[#3A3936] border-t border-[#E6E0D6]/10 text-[#E6E0D6] pt-20 pb-8"><div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 pb-16">
   <div><div className="footer-logo-panel"><Logo href="/#hero" variant="light" showText showIcon={false} /><span className="footer-signature">Entender antes de decidir.</span></div><p className="text-sm leading-7 text-[#E6E0D6]/65 mt-6">Alquileres · Administración · Ventas<br />{brandContact.city}<br />{brandContact.registration}</p>{site?.email && <a href={`mailto:${site.email}`} aria-label="Enviar email a Ubikka" className="inline-flex mt-5 p-3 border border-[#E6E0D6]/25"><Mail size={20} /></a>}</div>
   <div><h2 className="font-medium mb-6">Navegación</h2><ul className="space-y-4 text-sm text-[#E6E0D6]/65">{[['Inicio','/#hero'],['Propiedades','/propiedades'],['Venta','/propiedades?op=venta'],['Alquiler','/propiedades?op=alquiler'],['Nosotros','/#nosotros'],['Contacto','/#contacto']].map(([name,href])=><li key={name}><SiteLink href={href} className="hover:text-white">{name}</SiteLink></li>)}</ul></div>
   <div><h2 className="font-medium mb-6">Tipos de propiedades</h2><ul className="space-y-4 text-sm text-[#E6E0D6]/65">{[['Casas','casa'],['Departamentos','departamento'],['Terrenos','terreno'],['Locales comerciales','local_comercial']].map(([name,type])=><li key={type}><SiteLink href={`/propiedades?tipo=${type}`} className="hover:text-white">{name}</SiteLink></li>)}</ul></div>
   <div><h2 className="font-medium mb-6">Contacto</h2><div className="space-y-5 text-sm text-[#E6E0D6]/65"><p className="flex gap-3"><MapPin size={18} className="shrink-0" /><span>{brandContact.address}<br />{brandContact.city}</span></p><a className="flex gap-3 font-bold" href={brandContact.phoneHref}><Phone size={18} />{brandContact.phoneDisplay}</a><a className="flex gap-3" href={brandContact.whatsappHref} target="_blank" rel="noopener noreferrer"><MessageSquare size={18} />WhatsApp</a>{site?.email && <a className="flex gap-3 break-all" href={`mailto:${site.email}`}><Mail size={18} className="shrink-0" />{site.email}</a>}<SiteLink href="/#contacto" className="inline-block underline underline-offset-4">Enviar una consulta</SiteLink></div></div>
  </div>
  <div className="border-t border-white/10 pt-7 flex flex-col sm:flex-row gap-4 justify-between text-xs text-[#E6E0D6]/45"><p>© {new Date().getFullYear()} Ubikka Inmobiliaria.</p><SiteLink href="/privacidad" className="hover:text-[#E6E0D6]">Privacidad</SiteLink><a href="https://koistudio.com.ar/" target="_blank" rel="noopener noreferrer" className="hover:text-[#E6E0D6]">Desarrollado por Koi Studio ↗</a></div>
 </div></footer>;
}

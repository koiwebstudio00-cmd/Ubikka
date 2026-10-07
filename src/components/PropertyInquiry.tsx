import { SiteLink } from './SiteLink';
import React, { useState, useRef } from 'react';
import { MessageCircle } from 'lucide-react';
import type { Property } from '../data/properties';
export function PropertyInquiry({ property, phone }: { property: Property; phone?: string }) {
  const [pending, setPending] = useState(false), [error, setError] = useState(''), [sent, setSent] = useState(false);
  const inFlight = useRef(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (inFlight.current) return;
    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') || '').trim(), telefono = String(form.get('telefono') || '').trim();
    if (!email && !telefono) { setError('Dejá al menos un dato de contacto: teléfono o email.'); return; }
    inFlight.current = true; setPending(true); setError('');
    try {
      const response = await fetch('/api/inquiries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nombre: form.get('nombre'), email, telefono, mensaje: form.get('mensaje'), website: form.get('website'), property_id: property.id }) });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || 'No pudimos confirmar la consulta.');
      setSent(true);
    } catch (e) { setError(e instanceof Error ? e.message : 'No pudimos enviar la consulta.'); }
    finally { inFlight.current = false; setPending(false); }
  }
  return <section id="contacto" className="detail-panel scroll-mt-28 inquiry-panel" aria-labelledby="inquiry-title"><h2 id="inquiry-title" className="text-xl font-medium mb-6">Consultar por esta propiedad</h2>
    {sent ? <div role="status" className="text-sm leading-relaxed text-[#E6E0D6]">Recibimos tu consulta por <strong>{property.title}</strong>. La inmobiliaria se pondrá en contacto con vos.</div> : <form onSubmit={submit} className="property-inquiry space-y-4">
      <label className="sr-only" htmlFor="inquiry-name">Nombre completo</label><input id="inquiry-name" name="nombre" placeholder="Nombre completo" autoComplete="name" required maxLength={200} />
      <label className="sr-only" htmlFor="inquiry-phone">Teléfono</label><input id="inquiry-phone" name="telefono" type="tel" placeholder="Teléfono" autoComplete="tel" maxLength={50} aria-describedby="contact-help" />
      <label className="sr-only" htmlFor="inquiry-email">Email</label><input id="inquiry-email" name="email" type="email" placeholder="Email" autoComplete="email" maxLength={254} aria-describedby="contact-help" />
      <p id="contact-help" className="text-xs text-[#E6E0D6]/60">Dejá al menos un dato de contacto: teléfono o email.</p>
      <label className="sr-only" htmlFor="inquiry-message">Mensaje</label><textarea id="inquiry-message" name="mensaje" rows={5} required maxLength={5000} defaultValue={`Hola, me interesa la propiedad «${property.title}». Quisiera recibir más información.`} />
      <div hidden aria-hidden="true"><label>Sitio web<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
      <button disabled={pending} className="property-action property-action-primary w-full disabled:opacity-50">{pending ? 'Enviando…' : 'Consultar por esta propiedad'}</button>
    <p className="text-xs leading-6 text-[#E6E0D6]/55">Usamos tus datos para responder a tu consulta. <SiteLink href="/privacidad" className="underline underline-offset-4">Conocé nuestra política de privacidad.</SiteLink></p></form>}
    {phone && <><p className="inquiry-divider">O CONTACTANOS VÍA</p><SiteLink className="property-action w-full bg-[#16a34a] text-white" href={`https://wa.me/${phone}?text=${encodeURIComponent(`Hola, me interesa ${property.title}: ${window.location.origin}/propiedades/${property.slug}`)}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} /> WhatsApp directo</SiteLink></>}
  </section>;
}

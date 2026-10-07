import { SiteLink } from './SiteLink';
import React, { useState, useEffect, useRef } from 'react';
import { Phone, Mail, MessageSquare, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';
import { useSite } from '../lib/site';
import { Property } from '../data/properties';

interface ContactProps {
  selectedProperty?: Property | null;
}

export const Contact: React.FC<ContactProps> = ({ selectedProperty }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    busqueda: 'Comprar',
    mensaje: '',
  });

  const site = useSite();
  const inFlight = useRef(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (selectedProperty) {
      setFormData((prev) => ({
        ...prev,
        busqueda: selectedProperty.operation === 'VENTA' ? 'Comprar' : 'Alquilar',
        mensaje: `Hola, quisiera consultar por la propiedad "${selectedProperty.title}" (${selectedProperty.location}).`,
      }));
    }
  }, [selectedProperty]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inFlight.current) return;
    if (!formData.email.trim() && !formData.telefono.trim()) {
      setError('Dejá al menos un dato de contacto: teléfono o email.'); return;
    }
    const website = new FormData(e.currentTarget).get('website');
    inFlight.current = true; setSubmitting(true); setError(''); setSubmitted(false);
    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, website, mensaje: `Estoy buscando: ${formData.busqueda}.\n${formData.mensaje}`, ...(selectedProperty ? { property_id: selectedProperty.id } : {}) }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || 'No pudimos confirmar el envío.');
      setSubmitted(true);
      setFormData({ nombre: '', email: '', telefono: '', busqueda: 'Comprar', mensaje: '' });
    } catch (err) { setError(err instanceof Error ? err.message : 'No pudimos enviar la consulta.'); }
    finally { inFlight.current = false; setSubmitting(false); }
  };

  return (
    <section id="contacto" className="scroll-mt-20 py-24 md:py-36 bg-[#3A3936] relative border-t border-[#E6E0D6]/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* 2 Columns Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* Left Column: Contact Info List */}
          <div className="space-y-10">
        {/* Title */}
        <div className="mb-12">
          <span className="brand-eyebrow text-[10px] md:text-[11px] tracking-[0.35em] uppercase font-medium block mb-3">
            CONTACTO
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-[#E6E0D6] tracking-tight">
            Contanos qué estás buscando.
          </h2>
        </div>


            <p className="text-[15px] text-[#E6E0D6]/70 font-normal leading-relaxed">
              Te ayudamos a comprender la información y los pasos de cada operación para que puedas decidir con claridad.
            </p>

            <div className="space-y-6 pt-2 text-sm">
              {site?.telefono && <p className="flex items-center gap-3"><Phone size={18} /><SiteLink href={`tel:${site.telefono.replace(/[^+0-9]/g, '')}`}>{site.telefono}</SiteLink></p>}
              {site?.email && <p className="flex items-center gap-3"><Mail size={18} /><SiteLink href={`mailto:${site.email}`}>{site.email}</SiteLink></p>}
              {site?.telefono && <p className="flex items-center gap-3"><MessageSquare size={18} /><SiteLink href={`https://wa.me/${site.telefono.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">Escribinos por WhatsApp</SiteLink></p>}
              {(site?.direccion || site?.ciudad) && <p className="flex items-center gap-3"><MapPin size={18} />{[site.direccion, site.ciudad].filter(Boolean).join(', ')}</p>}
            </div>
          </div>

          {/* Right Column: Minimalist Contact Form */}
          <div className="bg-[#3A3936]/30 border border-[#E6E0D6]/15 rounded-xl p-6 md:p-8 relative">
            {submitted && (
              <div role="status" className="mb-6 p-4 border border-[#E6E0D6]/30 bg-[#3A3936] text-[#E6E0D6] text-[13px] flex items-center gap-3 animate-fadeIn">
                <CheckCircle2 size={18} className="shrink-0 text-[#E6E0D6]" />
                <span>Gracias. Recibimos tu consulta y nos pondremos en contacto a la brevedad.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6" aria-busy={submitting}>
              <div hidden aria-hidden="true"><label>Sitio web<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
              <p className="text-sm text-[#E6E0D6]/70">Dejá tu teléfono o email para que podamos responderte.</p>
              {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nombre */}
                <div>
                  <label htmlFor="nombre" className="block text-[11px] tracking-[0.2em] uppercase text-[#E6E0D6]/80 mb-2 font-medium">
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre" maxLength={200} autoComplete="name"
                    required
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Tu nombre completo"
                    className="w-full bg-transparent border border-[#E6E0D6]/20 px-4 py-3 text-[#E6E0D6] placeholder-[#C9CDD2] text-[14px] focus:outline-none focus:border-[#E6E0D6] transition-colors"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-[11px] tracking-[0.2em] uppercase text-[#E6E0D6]/80 mb-2 font-medium">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email" maxLength={254} autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="tu@email.com"
                    className="w-full bg-transparent border border-[#E6E0D6]/20 px-4 py-3 text-[#E6E0D6] placeholder-[#C9CDD2] text-[14px] focus:outline-none focus:border-[#E6E0D6] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Teléfono */}
                <div>
                  <label htmlFor="telefono" className="block text-[11px] tracking-[0.2em] uppercase text-[#E6E0D6]/80 mb-2 font-medium">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono" maxLength={50} autoComplete="tel"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="+54 9 ..."
                    className="w-full bg-transparent border border-[#E6E0D6]/20 px-4 py-3 text-[#E6E0D6] placeholder-[#C9CDD2] text-[14px] focus:outline-none focus:border-[#E6E0D6] transition-colors"
                  />
                </div>

                {/* Estoy buscando */}
                <div>
                  <label htmlFor="busqueda" className="block text-[11px] tracking-[0.2em] uppercase text-[#E6E0D6]/80 mb-2 font-medium">
                    Estoy buscando
                  </label>
                  <select
                    id="busqueda"
                    name="busqueda"
                    value={formData.busqueda}
                    onChange={handleChange}
                    className="w-full bg-[#3A3936] border border-[#E6E0D6]/20 px-4 py-3 text-[#E6E0D6] text-[14px] focus:outline-none focus:border-[#E6E0D6] transition-colors cursor-pointer"
                  >
                    <option value="Comprar" className="bg-[#3A3936] text-[#E6E0D6]">Comprar</option>
                    <option value="Alquilar" className="bg-[#3A3936] text-[#E6E0D6]">Alquilar</option>
                    <option value="Vender" className="bg-[#3A3936] text-[#E6E0D6]">Vender</option>
                    <option value="Invertir" className="bg-[#3A3936] text-[#E6E0D6]">Invertir</option>
                    <option value="Otro" className="bg-[#3A3936] text-[#E6E0D6]">Otro</option>
                  </select>
                </div>
              </div>

              {/* Mensaje */}
              <div>
                <label htmlFor="mensaje" className="block text-[11px] tracking-[0.2em] uppercase text-[#E6E0D6]/80 mb-2 font-medium">
                  Mensaje
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje" maxLength={4900}
                  rows={4}
                  required
                  value={formData.mensaje}
                  onChange={handleChange}
                  placeholder="Escribinos tus inquietudes o tipo de propiedad que estás buscando..."
                  className="w-full bg-transparent border border-[#E6E0D6]/20 px-4 py-3 text-[#E6E0D6] placeholder-[#C9CDD2] text-[14px] focus:outline-none focus:border-[#E6E0D6] transition-colors resize-none"
                />
              </div>

              {/* CTA Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#E6E0D6] text-[#3A3936] font-medium text-[12px] tracking-[0.25em] uppercase py-4 px-6 hover:bg-white transition-colors duration-300 flex items-center justify-center gap-3 group"
              >
                <span>{submitting ? 'ENVIANDO...' : 'ENVIAR CONSULTA'}</span>
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            <p className="text-xs leading-6 text-[#E6E0D6]/55">Usamos tus datos para responder a tu consulta. <SiteLink href="/privacidad" className="underline underline-offset-4">Conocé nuestra política de privacidad.</SiteLink></p></form>
          </div>

        </div>
      </div>
    </section>
  );
};

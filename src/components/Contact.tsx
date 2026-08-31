import React, { useState, useEffect } from 'react';
import { Phone, Mail, MessageSquare, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      // reset message after 6 seconds
      setTimeout(() => setSubmitted(false), 6000);
    }, 600);
  };

  return (
    <section id="contacto" className="py-24 md:py-36 bg-[#0E1216] relative border-t border-[#E6E0D6]/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Title */}
        <div className="mb-16">
          <span className="text-[10px] md:text-[11px] tracking-[0.35em] uppercase font-medium text-[#E6E0D6]/80 block mb-3">
            CONTACTO
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-[#F4F1EB] tracking-tight">
            Hablemos de tu próximo espacio.
          </h2>
        </div>

        {/* 2 Columns Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Contact Info List */}
          <div className="lg:col-span-5 space-y-10">
            <p className="text-[15px] text-[#F4F1EB]/70 font-normal leading-relaxed">
              Estamos a tu disposición para asesorarte con cercanía y confidencialidad en cada proyecto inmobiliario.
            </p>

            <div className="space-y-6 pt-2">
              {/* Phone */}
              <div className="flex items-start gap-4 group">
                <div className="p-2.5 rounded-none border border-[#E6E0D6]/15 text-[#E6E0D6] group-hover:border-[#E6E0D6]/40 transition-colors">
                  <Phone size={18} strokeWidth={1.5} />
                </div>
                <div>
                  <span className="text-[10px] tracking-[0.2em] uppercase text-[#6B6F76] block mb-0.5">
                    Teléfono
                  </span>
                  <a href="tel:+543815550123" className="text-[15px] text-[#F4F1EB] hover:text-[#E6E0D6] transition-colors">
                    +54 381 555 0123
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4 group">
                <div className="p-2.5 rounded-none border border-[#E6E0D6]/15 text-[#E6E0D6] group-hover:border-[#E6E0D6]/40 transition-colors">
                  <Mail size={18} strokeWidth={1.5} />
                </div>
                <div>
                  <span className="text-[10px] tracking-[0.2em] uppercase text-[#6B6F76] block mb-0.5">
                    Email
                  </span>
                  <a href="mailto:hola@ubikka.com.ar" className="text-[15px] text-[#F4F1EB] hover:text-[#E6E0D6] transition-colors">
                    hola@ubikka.com.ar
                  </a>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-start gap-4 group">
                <div className="p-2.5 rounded-none border border-[#E6E0D6]/15 text-[#E6E0D6] group-hover:border-[#E6E0D6]/40 transition-colors">
                  <MessageSquare size={18} strokeWidth={1.5} />
                </div>
                <div>
                  <span className="text-[10px] tracking-[0.2em] uppercase text-[#6B6F76] block mb-0.5">
                    WhatsApp
                  </span>
                  <a
                    href="https://wa.me/543815550123"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[15px] text-[#F4F1EB] hover:text-[#E6E0D6] transition-colors"
                  >
                    +54 381 555 0123
                  </a>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-4 group">
                <div className="p-2.5 rounded-none border border-[#E6E0D6]/15 text-[#E6E0D6] group-hover:border-[#E6E0D6]/40 transition-colors">
                  <MapPin size={18} strokeWidth={1.5} />
                </div>
                <div>
                  <span className="text-[10px] tracking-[0.2em] uppercase text-[#6B6F76] block mb-0.5">
                    Dirección
                  </span>
                  <span className="text-[15px] text-[#F4F1EB]">
                    San Miguel de Tucumán, Tucumán, Argentina
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Minimalist Contact Form */}
          <div className="lg:col-span-7 bg-[#1B1F26]/30 border border-[#E6E0D6]/15 p-8 md:p-10 relative">
            {submitted && (
              <div className="mb-6 p-4 border border-[#E6E0D6]/30 bg-[#1B1F26] text-[#E6E0D6] text-[13px] flex items-center gap-3 animate-fadeIn">
                <CheckCircle2 size={18} className="shrink-0 text-[#E6E0D6]" />
                <span>Gracias. Recibimos tu consulta y nos pondremos en contacto a la brevedad.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nombre */}
                <div>
                  <label htmlFor="nombre" className="block text-[11px] tracking-[0.2em] uppercase text-[#E6E0D6]/80 mb-2 font-medium">
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    required
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Tu nombre completo"
                    className="w-full bg-transparent border border-[#E6E0D6]/20 px-4 py-3 text-[#F4F1EB] placeholder-[#6B6F76] text-[14px] focus:outline-none focus:border-[#E6E0D6] transition-colors"
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
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="tu@email.com"
                    className="w-full bg-transparent border border-[#E6E0D6]/20 px-4 py-3 text-[#F4F1EB] placeholder-[#6B6F76] text-[14px] focus:outline-none focus:border-[#E6E0D6] transition-colors"
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
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="+54 9 ..."
                    className="w-full bg-transparent border border-[#E6E0D6]/20 px-4 py-3 text-[#F4F1EB] placeholder-[#6B6F76] text-[14px] focus:outline-none focus:border-[#E6E0D6] transition-colors"
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
                    className="w-full bg-[#0E1216] border border-[#E6E0D6]/20 px-4 py-3 text-[#F4F1EB] text-[14px] focus:outline-none focus:border-[#E6E0D6] transition-colors cursor-pointer"
                  >
                    <option value="Comprar" className="bg-[#0E1216] text-[#F4F1EB]">Comprar</option>
                    <option value="Alquilar" className="bg-[#0E1216] text-[#F4F1EB]">Alquilar</option>
                    <option value="Vender" className="bg-[#0E1216] text-[#F4F1EB]">Vender</option>
                    <option value="Invertir" className="bg-[#0E1216] text-[#F4F1EB]">Invertir</option>
                    <option value="Otro" className="bg-[#0E1216] text-[#F4F1EB]">Otro</option>
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
                  name="mensaje"
                  rows={4}
                  required
                  value={formData.mensaje}
                  onChange={handleChange}
                  placeholder="Escribinos tus inquietudes o tipo de propiedad que estás buscando..."
                  className="w-full bg-transparent border border-[#E6E0D6]/20 px-4 py-3 text-[#F4F1EB] placeholder-[#6B6F76] text-[14px] focus:outline-none focus:border-[#E6E0D6] transition-colors resize-none"
                />
              </div>

              {/* CTA Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#E6E0D6] text-[#0E1216] font-medium text-[12px] tracking-[0.25em] uppercase py-4 px-6 hover:bg-white transition-colors duration-300 flex items-center justify-center gap-3 group"
              >
                <span>{submitting ? 'ENVIANDO...' : 'ENVIAR CONSULTA'}</span>
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};

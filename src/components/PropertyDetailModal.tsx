import React, { useLayoutEffect, useRef } from 'react';
import { Property } from '../data/properties';
import { X, MapPin, ArrowRight, ArrowUpRight } from 'lucide-react';
import { PropertyFacts } from './PropertyFacts';
import { lockPageScroll } from '../utils/scrollLock';

interface PropertyDetailModalProps {
  property: Property;
  onClose: () => void;
  onConsult: (property: Property) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  onClose,
  onConsult,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useLayoutEffect(() => {
    const dialog: HTMLDialogElement | null = dialogRef.current;
    if (!dialog) return;

    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const unlockScroll = lockPageScroll();
    dialog.showModal();

    return () => {
      dialog.close();
      unlockScroll();
      trigger?.focus({ preventScroll: true });
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="property-modal"
      aria-labelledby="property-modal-title"
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onKeyDown={(event) => {
        if (event.key === 'Escape') { event.preventDefault(); onClose(); }
      }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      {/* Modal Container */}
      <div className="property-modal-frame">
        
        {/* Close Button */}
        <button
          type="button"
          autoFocus
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-[#0E1216]/80 text-[#E6E0D6] p-2 hover:bg-[#E6E0D6] hover:text-[#0E1216] transition-colors"
          aria-label="Cerrar modal"
        >
          <X size={20} />
        </button>

        <div className="property-modal-panel bg-[#1B1F26] border border-[#E6E0D6]/20 shadow-2xl text-[#F4F1EB]">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image side */}
          <div className="relative aspect-[4/3] md:aspect-auto h-full min-h-[300px] bg-[#0E1216]">
            <img
              src={property.image}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className="bg-[#0E1216]/90 text-[#E6E0D6] border border-[#E6E0D6]/30 text-[10px] tracking-[0.25em] font-medium uppercase px-3 py-1.5 inline-block">
                {property.operation}
              </span>
            </div>
          </div>

          {/* Details side */}
          <div className="p-8 md:p-10 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-1.5 text-[#6B6F76] text-[12px] tracking-wide mb-2">
                <MapPin size={14} className="text-[#E6E0D6]" />
                <span>{property.location}</span>
              </div>

              <h2 id="property-modal-title" className="text-2xl md:text-3xl font-light text-[#F4F1EB] mb-2">
                {property.title}
              </h2>

              <span className="inline-block text-[11px] tracking-[0.2em] uppercase text-[#E6E0D6] bg-[#0E1216] px-3 py-1 border border-[#E6E0D6]/15 mb-4">
                {property.type}
              </span>

              <p className="text-[#F4F1EB]/80 text-[14px] leading-relaxed mb-6 font-normal">
                {property.description}
              </p>

              <div className="mb-6">
                <PropertyFacts property={property} />
              </div>

              {/* Price */}
              <div className="mb-6">
                <span className="text-[10px] tracking-[0.2em] uppercase text-[#6B6F76] block mb-1">
                  Precio de la propiedad
                </span>
                <span className="text-2xl font-medium text-[#E6E0D6]">
                  {property.formattedPrice}
                </span>
              </div>
            </div>

            {/* Action CTA */}
            <div className="space-y-3">
              <a href={`/propiedades/${property.slug}`} className="property-action property-action-primary">
                Ver ficha completa <ArrowUpRight size={17} aria-hidden="true" />
              </a>
              <button type="button" onClick={() => onConsult(property)} className="property-action property-action-secondary">
                Consultar por esta propiedad <ArrowRight size={17} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
        </div>
      </div>
    </dialog>
  );
};

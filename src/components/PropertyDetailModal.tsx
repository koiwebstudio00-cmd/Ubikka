import React from 'react';
import { Property } from '../data/properties';
import { X, MapPin, Bed, Bath, Maximize2, ArrowRight } from 'lucide-react';

interface PropertyDetailModalProps {
  property: Property | null;
  onClose: () => void;
  onConsult: (property: Property) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  onClose,
  onConsult,
}) => {
  if (!property) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-[#0E1216]/90 backdrop-blur-md animate-fadeIn">
      {/* Modal Container */}
      <div className="relative bg-[#1B1F26] border border-[#E6E0D6]/20 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl text-[#F4F1EB] rounded-none">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-[#0E1216]/80 text-[#E6E0D6] p-2 hover:bg-[#E6E0D6] hover:text-[#0E1216] transition-colors"
          aria-label="Cerrar modal"
        >
          <X size={20} />
        </button>

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

              <h2 className="text-2xl md:text-3xl font-light text-[#F4F1EB] mb-2">
                {property.title}
              </h2>

              <span className="inline-block text-[11px] tracking-[0.2em] uppercase text-[#E6E0D6] bg-[#0E1216] px-3 py-1 border border-[#E6E0D6]/15 mb-4">
                {property.type}
              </span>

              <p className="text-[#F4F1EB]/80 text-[14px] leading-relaxed mb-6 font-normal">
                {property.description}
              </p>

              {/* Specs Grid */}
              <div className="grid grid-cols-3 gap-4 py-4 border-y border-[#E6E0D6]/10 mb-6">
                {property.bedrooms && (
                  <div className="flex flex-col items-center text-center p-2">
                    <Bed size={18} className="text-[#E6E0D6] mb-1" />
                    <span className="text-[12px] text-[#F4F1EB] font-medium">{property.bedrooms} Dorms</span>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex flex-col items-center text-center p-2">
                    <Bath size={18} className="text-[#E6E0D6] mb-1" />
                    <span className="text-[12px] text-[#F4F1EB] font-medium">{property.bathrooms} Baños</span>
                  </div>
                )}
                {property.areaM2 && (
                  <div className="flex flex-col items-center text-center p-2">
                    <Maximize2 size={18} className="text-[#E6E0D6] mb-1" />
                    <span className="text-[12px] text-[#F4F1EB] font-medium">{property.areaM2} m²</span>
                  </div>
                )}
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
            <button
              onClick={() => {
                onConsult(property);
                onClose();
              }}
              className="w-full bg-[#E6E0D6] text-[#0E1216] font-medium text-[12px] tracking-[0.2em] uppercase py-3.5 px-6 hover:bg-white transition-colors flex items-center justify-center gap-2 group"
            >
              <span>CONSULTAR POR ESTA PROPIEDAD</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

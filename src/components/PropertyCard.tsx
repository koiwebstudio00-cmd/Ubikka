import React from 'react';
import { Property } from '../data/properties';
import { ArrowUpRight, MapPin } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  onSelectProperty?: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onSelectProperty,
}) => {
  return (
    <div
      onClick={() => onSelectProperty && onSelectProperty(property)}
      className="group cursor-pointer bg-[#1B1F26]/40 border border-[#E6E0D6]/15 hover:border-[#E6E0D6]/40 transition-all duration-500 overflow-hidden flex flex-col h-full rounded-sm"
    >
      {/* Image Container with subtle overflow zoom */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#090D10]">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          loading="lazy"
        />

        {/* Operation Tag (VENTA / ALQUILER) */}
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-[#0E1216]/85 backdrop-blur-md text-[#E6E0D6] border border-[#E6E0D6]/20 text-[10px] tracking-[0.25em] font-medium uppercase px-3 py-1.5 inline-block">
            {property.operation}
          </span>
        </div>

        {/* Property Type Badge (Upper Right) */}
        <div className="absolute top-4 right-4 z-10">
          <span className="bg-[#0E1216]/60 backdrop-blur-md text-[#F4F1EB]/80 text-[10px] tracking-[0.2em] font-light uppercase px-2.5 py-1 inline-block">
            {property.type}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 md:p-8 flex flex-col justify-between flex-grow">
        <div>
          {/* Location */}
          <div className="flex items-center gap-1.5 text-[#6B6F76] text-[12px] tracking-wide mb-2">
            <MapPin size={13} className="text-[#E6E0D6]/70 shrink-0" />
            <span>{property.location}</span>
          </div>

          {/* Title */}
          <h3 className="text-xl md:text-2xl font-light text-[#F4F1EB] group-hover:text-[#E6E0D6] transition-colors duration-300 mb-3">
            {property.title}
          </h3>

          {property.description && (
            <p className="text-[#6B6F76] text-[13px] line-clamp-2 leading-relaxed mb-6 font-normal">
              {property.description}
            </p>
          )}
        </div>

        {/* Price & Action */}
        <div className="pt-4 border-t border-[#E6E0D6]/10 flex items-center justify-between mt-auto">
          <div>
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#6B6F76] block mb-0.5">Precio</span>
            <span className="text-lg md:text-xl font-medium text-[#E6E0D6]">
              {property.formattedPrice}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] tracking-[0.2em] uppercase text-[#E6E0D6] font-medium group-hover:translate-x-1 transition-transform duration-300">
            <span>Ver más</span>
            <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>
      </div>
    </div>
  );
};

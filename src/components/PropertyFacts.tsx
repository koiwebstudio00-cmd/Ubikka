import React from 'react';
import { Bath, Bed, Maximize2 } from 'lucide-react';
import { Property } from '../data/properties';

export function PropertyFacts({ property }: { property: Property }) {
  const facts = [
    { value: property.bedrooms, label: property.bedrooms === 1 ? 'Dormitorio' : 'Dormitorios', icon: Bed },
    { value: property.bathrooms, label: property.bathrooms === 1 ? 'Baño' : 'Baños', icon: Bath },
    { value: property.areaM2, label: 'Superficie', suffix: ' m²', icon: Maximize2 },
  ].filter((fact) => fact.value !== undefined);

  return (
    <dl className="grid grid-cols-3 gap-3 border-y border-[#E6E0D6]/15 py-6">
      {facts.map(({ value, label, suffix, icon: Icon }) => (
        <div key={label} className="flex flex-col items-center text-center text-[#E6E0D6]">
          <Icon size={19} strokeWidth={1.4} aria-hidden="true" className="mb-3" />
          <dt className="order-2 mt-1 text-[10px] sm:text-xs text-[#F4F1EB]/60">{label}</dt>
          <dd className="text-lg font-light">{value}{suffix}</dd>
        </div>
      ))}
    </dl>
  );
}

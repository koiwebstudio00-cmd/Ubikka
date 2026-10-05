import { SiteLink } from './SiteLink';
import React from 'react';

interface LogoProps {
  href?: string;
  className?: string;
  variant?: 'light' | 'cream' | 'dark';
  showText?: boolean;
  stacked?: boolean;
  textClassName?: string;
  textHidden?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  href = '#hero',
  className = '',
  variant = 'cream',
  showText = true,
  stacked = false,
  textClassName = '',
  textHidden = false,
}) => {
  const colorClass = 
    variant === 'dark' ? 'text-[#0E1216]' : 
    variant === 'light' ? 'text-white' : 
    'text-[#E6E0D6]';

  const fillColor = 
    variant === 'dark' ? '#0E1216' : 
    variant === 'light' ? '#FFFFFF' : 
    '#E6E0D6';

  return (
    <SiteLink href={href} aria-label="UBIKKA — Inicio" className={`inline-flex items-center gap-3.5 group select-none ${colorClass} ${className}`}>
      {/* Isotipo: 3 Architectural Vertical Pillars */}
      <svg 
        width="38" 
        height="38" 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0 transition-transform duration-500 group-hover:scale-105"
      >
        {/* Left pillar - sloped top left */}
        <path 
          d="M12 40 L30 25 V85 H12 V40 Z" 
          fill={fillColor} 
          fillOpacity="0.9"
        />
        {/* Center pillar - tallest, rounded bottom curve */}
        <path 
          d="M38 12 H58 V70 C58 80.5 49 88 38 88 V12 Z" 
          fill={fillColor} 
        />
        {/* Right pillar - sloped top right */}
        <path 
          d="M66 52 L84 62 V85 H66 V52 Z" 
          fill={fillColor} 
          fillOpacity="0.8"
        />
      </svg>

      {showText && (
        <div aria-hidden={textHidden} className={`flex flex-col justify-center leading-none ${stacked ? 'text-center' : ''} ${textClassName}`}>
          <span className="font-light tracking-[0.28em] text-[18px] md:text-[20px] uppercase font-[Poppins]">
            UBIKKA
          </span>
          <span className="font-light tracking-[0.45em] text-[8px] md:text-[9px] uppercase text-[#6B6F76] mt-1 group-hover:text-[#E6E0D6] transition-colors duration-300">
            INMOBILIARIA
          </span>
        </div>
      )}
    </SiteLink>
  );
};

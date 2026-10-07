import { SiteLink } from './SiteLink';
import React from 'react';

interface LogoProps {
  href?: string;
  className?: string;
  variant?: 'light' | 'cream' | 'dark';
  showText?: boolean;
  showIcon?: boolean;
  stacked?: boolean;
  textClassName?: string;
  textHidden?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  href = '#hero',
  className = '',
  variant = 'cream',
  showText = true,
  showIcon = true,
  stacked = false,
  textClassName = '',
  textHidden = false,
}) => {
  const lightArtwork = variant === 'light';
  const iconSource = lightArtwork ? '/images/ubikka-isologo-light.png' : '/images/ubikka-isologo.png';
  const letteringSource = lightArtwork ? '/images/ubikka-lettering-light.png' : '/images/ubikka-lettering.png';

  return (
    <SiteLink href={href} aria-label="Ubikka — Inicio" data-variant={variant} className={`brand-logo inline-flex items-center group select-none ${className}`}>
      {showIcon && <img src={iconSource} width="1254" height="1254" alt="" aria-hidden="true" className="brand-isologo shrink-0" />}

      {showText && (
        <span aria-hidden="true" data-hidden={textHidden} className={`brand-wording ${stacked ? 'text-center' : ''} ${textClassName}`}>
          <img src={letteringSource} width="1774" height="887" alt="" className="brand-lettering" />
        </span>
      )}
    </SiteLink>
  );
};

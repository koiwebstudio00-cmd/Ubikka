import { SiteLink } from './SiteLink';
import React, { useState, useEffect, useRef } from 'react';
import { Logo } from './Logo';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  headerRef: React.RefObject<HTMLElement | null>;
  logoVisible: boolean;
  onContactClick?: () => void;
  homeHref?: string;
  solid?: boolean;
}

const navLinks = [
  { name: 'Inicio', href: '#hero' },
  { name: 'Propiedades', href: '/propiedades' },
  { name: 'Nosotros', href: '#nosotros' },
  { name: 'Contacto', href: '#contacto' },
];

export const Navbar: React.FC<NavbarProps> = ({ headerRef, logoVisible, onContactClick, homeHref = '', solid = false }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener('keydown', closeOnEscape);
    const desktop = window.matchMedia('(min-width: 1024px)');
    const closeOnDesktop = () => {
      if (desktop.matches) setMobileMenuOpen(false);
    };
    desktop.addEventListener('change', closeOnDesktop);
    return () => {
      window.removeEventListener('keydown', closeOnEscape);
      desktop.removeEventListener('change', closeOnDesktop);
    };
  }, [mobileMenuOpen]);

  const handleContactClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    setMobileMenuOpen(false);
    if (onContactClick) {
      event.preventDefault();
      onContactClick();
    }
  };

  return (
    <header ref={headerRef} className={`site-navbar ${solid ? 'site-navbar-solid' : ''} ${logoVisible ? 'site-navbar-compact' : ''} ${mobileMenuOpen ? 'site-navbar-menu-open' : ''}`}>
      <div className="navbar-surface" aria-hidden="true" />
      <div className="navbar-inner">
        <Logo
          href={`${homeHref}#hero`}
          variant="light"
          className="navbar-brand min-h-11 min-w-11"
          textClassName="navbar-wording"
          textHidden={!logoVisible}
        />

        <nav className="navbar-desktop hidden lg:flex items-center gap-10 xl:gap-14" aria-label="Navegación principal">
          <ul className="flex items-center gap-8 xl:gap-14 text-[12px] xl:text-[13px] tracking-[0.24em] font-normal text-[#F4F1EB]/90 uppercase">
            {navLinks.map((link) => (
              <li key={link.href}>
                <SiteLink href={link.href.startsWith('/') ? link.href : `${homeHref}${link.href}`} className="navbar-link">{link.name}</SiteLink>
              </li>
            ))}
          </ul>
          <SiteLink href={`${homeHref}#contacto`} onClick={handleContactClick} className="navbar-contact">Contactar</SiteLink>
        </nav>

        <button
          ref={menuButtonRef}
          onClick={() => setMobileMenuOpen((open) => !open)}
          className="navbar-menu-trigger lg:hidden text-[#E6E0D6] p-2"
          aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      <div className="navbar-dropdown" data-open={mobileMenuOpen} aria-hidden={!mobileMenuOpen} inert={!mobileMenuOpen}>
        <div className="navbar-dropdown-clip">
          <nav id="mobile-navigation" aria-label="Navegación móvil" className="navbar-mobile">
            {navLinks.map((link) => (
              <SiteLink key={link.href} href={link.href.startsWith('/') ? link.href : `${homeHref}${link.href}`} onClick={() => setMobileMenuOpen(false)} className="navbar-link py-3">
                {link.name}
              </SiteLink>
            ))}
            <SiteLink href={`${homeHref}#contacto`} onClick={handleContactClick} className="navbar-contact text-center mt-3">Contactar</SiteLink>
          </nav>
        </div>
      </div>
    </header>
  );
};

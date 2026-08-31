import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onContactClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onContactClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Inicio', href: '#hero' },
    { name: 'Propiedades', href: '#propiedades' },
    { name: 'Nosotros', href: '#nosotros' },
    { name: 'Contacto', href: '#contacto' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#0E1216]/90 backdrop-blur-md border-b border-[#E6E0D6]/10 py-4 shadow-xl'
          : 'bg-gradient-to-b from-[#0E1216]/80 via-[#0E1216]/30 to-transparent py-6 md:py-8'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <Logo variant="cream" />

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">
          <ul className="flex items-center gap-8 text-[13px] tracking-[0.2em] font-medium text-[#F4F1EB]/80 uppercase">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className="hover:text-[#E6E0D6] transition-colors duration-300 relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#E6E0D6] hover:after:w-full after:transition-all after:duration-300"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>

          {/* Secondary CTA Button */}
          <a
            href="#contacto"
            onClick={(e) => {
              if (onContactClick) {
                e.preventDefault();
                onContactClick();
              }
            }}
            className="text-[12px] tracking-[0.2em] uppercase font-medium text-[#E6E0D6] border border-[#E6E0D6]/30 px-5 py-2.5 rounded-none hover:border-[#E6E0D6] hover:bg-[#E6E0D6] hover:text-[#0E1216] transition-all duration-300"
          >
            Contactar
          </a>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-[#E6E0D6] p-2 focus:outline-none"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[70px] bg-[#0E1216]/98 border-b border-[#E6E0D6]/15 backdrop-blur-xl px-8 py-10 flex flex-col gap-6 animate-fadeIn z-40">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-[14px] tracking-[0.25em] font-medium uppercase text-[#F4F1EB] hover:text-[#E6E0D6] py-2 border-b border-[#E6E0D6]/05"
            >
              {link.name}
            </a>
          ))}
          <a
            href="#contacto"
            onClick={() => {
              setMobileMenuOpen(false);
              if (onContactClick) onContactClick();
            }}
            className="mt-4 text-center text-[13px] tracking-[0.25em] uppercase font-medium bg-[#E6E0D6] text-[#0E1216] py-3.5 px-6 transition-all duration-300"
          >
            Contactar
          </a>
        </div>
      )}
    </header>
  );
};

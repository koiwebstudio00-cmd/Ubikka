import { PrivacyPage } from './components/PrivacyPage';
import { NotFoundPage } from './components/NotFoundPage';
import { localBusiness } from '../shared/public-content';
import { useSite } from './lib/site';
import { usePageSeo } from './lib/page-seo';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { LivePropertyPage } from './components/LivePropertyPage';
import { PropertiesPage } from './components/PropertiesPage';
import React from 'react';
import { useHeroScroll } from './hooks/useHeroScroll';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FeaturedProperties } from './components/FeaturedProperties';
import { AboutCTA } from './components/AboutCTA';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { PropertyDetailPage } from './components/PropertyDetailPage';

function HomePage() {
  const site = useSite();
  usePageSeo('Ubikka Inmobiliaria | Propiedades en Tucumán', 'Encontrá propiedades en venta y alquiler en Tucumán. Consultá a Ubikka por tu próximo espacio.', localBusiness(site));
  const { heroRef, navbarRef, logoVisible } = useHeroScroll();

  const handleNavContactClick = () => {
    const contactElement = document.getElementById('contacto');
    if (contactElement) {
      contactElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Navbar */}
      <Navbar headerRef={navbarRef} logoVisible={logoVisible} onContactClick={handleNavContactClick} />

      {/* Main Content Sections */}
      <main>
        {/* 1. HERO */}
        <Hero sectionRef={heroRef} />

        {/* 2. PROPIEDADES DESTACADAS */}
        <FeaturedProperties />

        {/* 3–5. NOSOTROS, CTA Y CONTACTO */}
        <AboutCTA>
          <Contact />
        </AboutCTA>
      </main>

      {/* 6. FOOTER */}
      <Footer />

    </>
  );
}

function RouteEffects() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) requestAnimationFrame(() => document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView({ behavior: 'smooth' }));
    else window.scrollTo(0, 0);
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonical) canonical.href = new URL(pathname, canonical.href).href;
    if (pathname === '/') document.title = 'Ubikka Inmobiliaria | Propiedades en Tucumán';
  }, [pathname, hash]);
  return null;
}
export default function App() {
  return <BrowserRouter><RouteEffects /><div className="min-h-screen bg-[#0E1216] text-[#F4F1EB] font-[Poppins] selection:bg-[#E6E0D6] selection:text-[#0E1216]">
    <Routes><Route path="/" element={<HomePage />} /><Route path="/propiedades" element={<PropertiesPage />} /><Route path="/propiedades/:slug" element={<LivePropertyPage />} /><Route path="/privacidad" element={<PrivacyPage />} /><Route path="*" element={<NotFoundPage />} /></Routes>
  </div></BrowserRouter>;
}

import React, { useEffect, useState } from 'react';
import { useHeroScroll } from './hooks/useHeroScroll';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FeaturedProperties } from './components/FeaturedProperties';
import { AboutCTA } from './components/AboutCTA';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { PropertyDetailPage } from './components/PropertyDetailPage';
import { Property, PROPERTIES } from './data/properties';

function HomePage() {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [inquiryProperty, setInquiryProperty] = useState<Property | null>(null);
  const [consultRequested, setConsultRequested] = useState(false);
  const { heroRef, navbarRef, logoVisible } = useHeroScroll();

  const handleSelectProperty = (property: Property) => {
    setSelectedProperty(property);
  };

  const handleConsultFromModal = (property: Property) => {
    setInquiryProperty(property);
    setSelectedProperty(null);
    setConsultRequested(true);
  };

  useEffect(() => {
    if (!consultRequested || selectedProperty) return;
    // The dialog unmounts and restores scrolling before moving to the form.
    document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' });
    document.getElementById('nombre')?.focus({ preventScroll: true });
    setConsultRequested(false);
  }, [consultRequested, selectedProperty]);

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
        <FeaturedProperties onSelectProperty={handleSelectProperty} />

        {/* 3–5. NOSOTROS, CTA Y CONTACTO */}
        <AboutCTA>
          <Contact selectedProperty={inquiryProperty} />
        </AboutCTA>
      </main>

      {/* 6. FOOTER */}
      <Footer />

      {/* Optional Property Detail Modal */}
      {selectedProperty && <PropertyDetailModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
        onConsult={handleConsultFromModal}
      />}
    </>
  );
}

export default function App() {
  const pathname = window.location.pathname;
  const propertyRoute = pathname.match(/^\/propiedades\/([^/]+)\/?$/);
  const property = propertyRoute ? PROPERTIES.find((item) => item.slug === propertyRoute[1]) : undefined;

  return (
    <div className="min-h-screen bg-[#0E1216] text-[#F4F1EB] font-[Poppins] selection:bg-[#E6E0D6] selection:text-[#0E1216]">
      {pathname === '/' ? <HomePage /> : <PropertyDetailPage property={property} />}
    </div>
  );
}

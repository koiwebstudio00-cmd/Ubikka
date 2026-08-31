import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FeaturedProperties } from './components/FeaturedProperties';
import { AboutUs } from './components/AboutUs';
import { CTASection } from './components/CTASection';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { Property } from './data/properties';

export default function App() {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const handleSelectProperty = (property: Property) => {
    setSelectedProperty(property);
  };

  const handleConsultFromModal = (property: Property) => {
    // Scroll smoothly to contact section
    const contactElement = document.getElementById('contacto');
    if (contactElement) {
      contactElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavContactClick = () => {
    const contactElement = document.getElementById('contacto');
    if (contactElement) {
      contactElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0E1216] text-[#F4F1EB] font-[Poppins] selection:bg-[#E6E0D6] selection:text-[#0E1216]">
      {/* Navbar */}
      <Navbar onContactClick={handleNavContactClick} />

      {/* Main Content Sections */}
      <main>
        {/* 1. HERO */}
        <Hero />

        {/* 2. PROPIEDADES DESTACADAS */}
        <FeaturedProperties onSelectProperty={handleSelectProperty} />

        {/* 3. ABOUT US */}
        <AboutUs />

        {/* 4. CTA */}
        <CTASection />

        {/* 5. CONTACT */}
        <Contact selectedProperty={selectedProperty} />
      </main>

      {/* 6. FOOTER */}
      <Footer />

      {/* Optional Property Detail Modal */}
      <PropertyDetailModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
        onConsult={handleConsultFromModal}
      />
    </div>
  );
}

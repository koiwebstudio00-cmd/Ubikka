export interface Property {
  id: string;
  slug: string;
  title: string;
  operation: 'VENTA' | 'ALQUILER';
  type: string;
  location: string;
  price: number;
  currency: string;
  formattedPrice: string;
  image: string;
  featured: boolean;
  bedrooms?: number;
  bathrooms?: number;
  areaM2?: number;
  description?: string;
}

export const PROPERTIES: Property[] = [
  {
    id: "property-001",
    slug: "nordika-belgrano",
    title: "Nórdika Belgrano",
    operation: "VENTA",
    type: "Departamento",
    location: "Belgrano, Buenos Aires",
    price: 245000,
    currency: "USD",
    formattedPrice: "USD 245.000",
    // Contemporary premium residential building with dark wood and warm lighting at dusk
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85",
    featured: true,
    bedrooms: 2,
    bathrooms: 2,
    areaM2: 92,
    description: "Espacio de diseño nórdico contemporáneo con acabados en madera natural, grandes ventanales e iluminación cálida pensada para el máximo bienestar."
  },
  {
    id: "property-002",
    slug: "altos-del-parque",
    title: "Altos del Parque",
    operation: "ALQUILER",
    type: "Departamento",
    location: "Villa Urquiza, Buenos Aires",
    price: 1250,
    currency: "USD",
    formattedPrice: "USD 1.250 / mes",
    // Premium apartment with terrace & urban view
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=85",
    featured: true,
    bedrooms: 1,
    bathrooms: 1,
    areaM2: 68,
    description: "Unidad exclusiva con amplia terraza propia, vistas abiertas al parque y materiales nobles como hormigón visto y vidrio templado."
  },
  {
    id: "property-003",
    slug: "casa-loma",
    title: "Casa Loma",
    operation: "VENTA",
    type: "Casa",
    location: "Yerba Buena, Tucumán",
    price: 380000,
    currency: "USD",
    formattedPrice: "USD 380.000",
    // Contemporary house integrated with nature & subtle greenery
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85",
    featured: true,
    bedrooms: 3,
    bathrooms: 3,
    areaM2: 310,
    description: "Residencia contemporánea de líneas puras integrada a la vegetación autóctona de Yerba Buena. Muros de piedra y ventilación cruzada."
  },
  {
    id: "property-004",
    slug: "mirador-norte",
    title: "Mirador Norte",
    operation: "VENTA",
    type: "Penthouse",
    location: "Nordelta, Buenos Aires",
    price: 520000,
    currency: "USD",
    formattedPrice: "USD 520.000",
    // Penthouse with expansive floor-to-ceiling glass windows
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85",
    featured: true,
    bedrooms: 3,
    bathrooms: 4,
    areaM2: 245,
    description: "Penthouse de alta gama con panorámicas infinitas al lago. Ventanales de doble vidrio, suite principal con vestidor y terminaciones de lujo."
  }
];

export const HERO_BACKGROUND_IMAGE = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2000&q=90";
export const ABOUT_IMAGE = "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=85"; // Luxurious interior architecture
export const CTA_BACKGROUND_IMAGE = "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2000&q=90"; // Contemporary living room at sunset

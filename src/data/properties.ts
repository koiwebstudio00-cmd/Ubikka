export interface Property {
  id: string;
  slug: string;
  title: string;
  operation: 'VENTA' | 'ALQUILER' | 'VENTA / ALQUILER';
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

export const HERO_BACKGROUND_IMAGE = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2000&q=90";
export const ABOUT_IMAGE = "/images/nosotros-portrait.webp";
export const CTA_BACKGROUND_IMAGE = "/images/cta-background.webp";

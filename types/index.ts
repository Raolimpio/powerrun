import { ReactNode } from 'react';

// Tipos globais da aplicação
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

// Prop base para componentes
export interface ComponentProps {
  children?: ReactNode;
  className?: string;
}

// Tipos de linguagens agora são gerenciados pelo next-intl; tipos legados removidos

// Tipos para formulários
export interface FormFieldProps {
  label?: string;
  error?: string;
  required?: boolean;
}

// Tipos para equipamentos
export interface Equipment {
  id: string;
  name: string;
  cardName?: string; // Nome simplificado para cards
  category: string;
  brand: string;
  model: string;
  images: string[];
  galleryImages?: string[];
  videos?: string[];
  price?: number;
  description: string;
  shortDescription: string;
  cardDescription?: string; // Descrição sintética para cards
  specifications: Record<string, string>;
  features: string[];
  targets: ('academia' | 'condominio' | 'residencia')[];
  downloads: {
    name: string;
    url: string;
    type: 'manual' | 'catalog' | 'warranty' | 'technical';
    size?: string;
  }[];
  inStock: boolean;
  featured: boolean;
}

export interface EquipmentCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}

export interface EquipmentFilter {
  categories: string[];
  brands: string[];
  priceRange?: [number, number];
  inStock?: boolean;
  featured?: boolean;
  search?: string;
  target?: string;
}

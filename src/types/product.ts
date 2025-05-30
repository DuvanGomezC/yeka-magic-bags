// src/types/product.ts
export interface Product {
    id: string; // ¡CRÍTICO: debe ser string para coincidir con Supabase!
    name: string;
    description: string | null; // Puede ser null en tu DB
    price: number;
    category: string;
    images: string[]; // Array de URLs de imágenes
    featured: boolean;
    active: boolean;
    created_at: string;
    updated_at: string;
  }
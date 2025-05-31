// src/types/product.ts

export interface Product {
  id: string; // ID de producto ahora es string (¡CRÍTICO para Supabase!)
  name: string;
  description: string | null;
  price: number;
  category: string;
  images: string[];
  featured: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
product: Product;
quantity: number;
}
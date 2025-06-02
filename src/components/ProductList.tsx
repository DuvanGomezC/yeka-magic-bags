// src/components/ProductList.tsx
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProductCard from "./ProductCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import api from '../utils/axiosInstance';
import { Product } from "@/types/product"; // Asegúrate de que esta interfaz Product sea correcta

// Define la interfaz para el resultado esperado de la consulta de productos
interface ProductsQueryResult {
  products: Product[];
  totalProducts: number;
}

export default function ProductList() {
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  const PRODUCTS_PER_PAGE = 8;
  const [currentPage, setCurrentPage] = useState(1);

  // Efecto para el debounce de la búsqueda
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // --- Fetching de productos desde el backend con React Query ---
  const fetchProducts = async ({ queryKey }): Promise<ProductsQueryResult> => {
    const [_key, { page, limit, category, search }] = queryKey;
    
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    if (category && category !== 'todos') {
      params.append('category', category);
    }
    if (search) {
      params.append('search', search);
    }

    try {
      const response = await api.get(`/api/products?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  };

  const {
    data: productsData,
    isLoading: isLoadingProducts,
    isFetching: isFetchingProducts,
    isError: isErrorProducts,
    error: productsError
  } = useQuery<ProductsQueryResult>({
    queryKey: [
      'products',
      {
        page: currentPage,
        limit: PRODUCTS_PER_PAGE,
        category: selectedCategory,
        search: debouncedSearchQuery,
      }
    ],
    queryFn: fetchProducts,
  });

  // --- Fetching de categorías desde el backend con React Query ---
  const fetchCategories = async (): Promise<string[]> => {
    try {
      const response = await api.get('/api/products/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  };

  const {
    data: categoriesData, // Renombrado a categoriesData para evitar conflicto
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
    error: categoriesError
  } = useQuery<string[]>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos (antes cacheTime, renombrado en v5)
  });

  // Asegura que categories sea un array vacío si categoriesData es undefined/null
  const categories: string[] = categoriesData || [];


  const products = productsData?.products || [];
  const totalProducts = productsData?.totalProducts || 0;
  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, debouncedSearchQuery]);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  if (isLoadingProducts || isLoadingCategories) {
    return <div className="container mx-auto px-4 py-8 text-center">Cargando productos...</div>;
  }

  if (isErrorProducts) {
    return <div className="container mx-auto px-4 py-8 text-center text-red-500">Error al cargar los productos: {productsError?.message}</div>;
  }

  if (isErrorCategories) {
    return <div className="container mx-auto px-4 py-8 text-center text-red-500">Error al cargar las categorías: {categoriesError?.message}</div>;
  }

  const paginatedAndFilteredProducts = products;

  return (
    <section id="productos" className="container mx-auto px-4 py-8">
      <h2 className="text-4xl font-serif font-extrabold text-center mb-10 text-magia-brown dark:text-gray-100 animate-fade-in-up">
        Nuestra Colección
      </h2>

      <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-card rounded-lg shadow-sm border border-border">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar por nombre o descripción..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9"
          />
        </div>

        <div className="w-full md:w-1/3 lg:w-1/4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccionar Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todas las categorías</SelectItem>
              {/* Usa el array 'categories' que ya está garantizado como string[] */}
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {paginatedAndFilteredProducts.length > 0 ? (
          paginatedAndFilteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <h3 className="text-lg font-medium mb-2">No se encontraron productos</h3>
            <p className="text-muted-foreground mb-4">Intenta con otra búsqueda o categoría</p>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedCategory("todos");
                setSearchQuery("");
              }}
            >
              Ver todos los productos
            </Button>
          </div>
        )}

        {totalPages > 1 && (
          <div className="col-span-full flex justify-center items-center space-x-2 mt-8">
            <Button
              variant="outline"
              onClick={goToPrevPage}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <div className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, index) => (
                <Button
                  key={index + 1}
                  variant={currentPage === index + 1 ? "default" : "outline"}
                  onClick={() => goToPage(index + 1)}
                >
                  {index + 1}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
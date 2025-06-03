// src/components/ProductList.tsx
import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ProductCard from "./ProductCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

// Importaciones para fetching de datos
import { useQuery } from "@tanstack/react-query";
import api from '../utils/axiosInstance';
import { Product } from "@/types/product";

// Definir el tipo de respuesta del backend para la paginación
interface ProductsResponse {
  products: Product[];
  currentPage: number;
  totalPages: number;
  totalProducts: number;
}

export default function ProductList() {
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<string[]>([]); // Nuevo estado para las categorías

  // --- Lógica de Paginación ---
  const PRODUCTS_PER_PAGE = 8;
  const [currentPage, setCurrentPage] = useState(1);

  // Referencia para el scroll
  const productListRef = useRef<HTMLDivElement>(null);

  // Estado para controlar si es el primer render o cambio de página
  const [isPageChange, setIsPageChange] = useState(false);

  // Fetching de productos desde el backend con React Query (para la lista principal)
  const fetchProducts = async (): Promise<ProductsResponse> => {
    const params = new URLSearchParams({
      page: currentPage.toString(),
      limit: PRODUCTS_PER_PAGE.toString(),
    });

    if (selectedCategory !== "todos") {
      params.append("category", selectedCategory);
    }
    if (searchQuery) {
      params.append("search", searchQuery);
    }

    params.append("active", "true");

    const response = await api.get<ProductsResponse>(`/api/products?${params.toString()}`);
    return response.data;
  };

  const { data: productsData, isLoading, isError, error, isPlaceholderData } = useQuery<ProductsResponse, Error>({
    queryKey: ['products', currentPage, selectedCategory, searchQuery],
    queryFn: fetchProducts,
    placeholderData: (previousData) => previousData,
  });

  const products = productsData?.products || [];
  const totalPages = productsData?.totalPages || 1;
  const totalProducts = productsData?.totalProducts || 0;

  // --- NUEVA LÓGICA: Fetching de categorías únicas desde el backend ---
  const fetchAllProductsForCategories = async (): Promise<Product[]> => {
    // Fetches all active products without pagination to get all categories
    // Se usa un límite muy alto para asegurar que se obtengan todos los productos activos
    const response = await api.get<ProductsResponse>('/api/products?active=true&limit=9999');
    return response.data.products;
  };

  const { data: allProductsForCategories, isLoading: isLoadingCategories, isError: isErrorCategories } = useQuery<Product[], Error>({
    queryKey: ['allProductsForCategories'],
    queryFn: fetchAllProductsForCategories,
    staleTime: 1000 * 60 * 5, // Cache categories for 5 minutos para evitar re-fetch excesivo
  });

  // Efecto para extraer y almacenar categorías únicas
  useEffect(() => {
    if (allProductsForCategories) {
      const uniqueCategories = Array.from(
        new Set(allProductsForCategories.map(p => p.category).filter(Boolean))
      ) as string[]; // Filtra valores nulos/indefinidos y asegura el tipo string
      setCategories(uniqueCategories);
    }
  }, [allProductsForCategories]);


  // Efecto para reiniciar la paginación cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
    setIsPageChange(false); // No es cambio de página, es cambio de filtros
  }, [selectedCategory, searchQuery]);

  // Efecto SOLO para scroll cuando cambia la página (no filtros)
  useEffect(() => {
    if (isPageChange && productListRef.current) {
      productListRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // Resetear el flag después del scroll
    if (isPageChange) {
      setIsPageChange(false);
    }
  }, [currentPage, isPageChange]);

  const goToPage = (page: number) => {
    setIsPageChange(true); // Marcar que es un cambio de página
    setCurrentPage(page);
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

  // Manejo de estados de carga y error combinados
  if (isLoading || isLoadingCategories) {
    return (
      <section className="container mx-auto px-4 py-8">
        <div className="text-center text-lg">Cargando productos y categorías...</div>
      </section>
    );
  }

  if (isError || isErrorCategories) {
    return (
      <section className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500 text-lg">
          Error al cargar datos: {error?.message || (isErrorCategories ? "Error al cargar categorías." : "Error desconocido.")}
        </div>
      </section>
    );
  }

  return (
    <section ref={productListRef} id="productos" className="container mx-auto px-4 py-8">
      <h2 className="text-4xl font-extrabold text-center text-magia-brown dark:text-gray-100 mb-8 animate-fade-in-up">
        Nuestros Productos
      </h2>
      <div className="flex flex-col md:flex-row gap-4 mb-8 items-center">
        {/* Búsqueda */}
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 w-full"
          />
        </div>
        {/* Filtro de Categoría */}
        <div className="w-full md:w-1/4">
          <Select
            value={selectedCategory}
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todas las categorías</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)} {/* Capitaliza la primera letra */}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
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

        {/* Controles de Paginación */}
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
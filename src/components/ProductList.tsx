// src/components/ProductList.tsx
import React, { useEffect, useState, useRef } from "react"; // <--- Añadir 'useRef' aquí
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

export default function ProductList() {
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");
  const [searchQuery, setSearchQuery] = useState("");

  // --- Lógica de Paginación ---
  const PRODUCTS_PER_PAGE = 8;
  const [currentPage, setCurrentPage] = useState(1);

  // --- MODIFICACIÓN DEL SCROLL: Crear una ref para la parte superior de la sección de productos ---
  const productListRef = useRef<HTMLDivElement>(null);

  // Fetching de productos desde el backend con React Query
  const fetchProducts = async (): Promise<Product[]> => {
    const response = await api.get('/api/products');
    return response.data;
  };

  const {
    data: allProducts,
    isLoading,
    isError,
    error,
  } = useQuery<Product[], Error>({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Filtrado de productos
  const filteredProducts = React.useMemo(() => {
    if (!allProducts) return [];
    return allProducts.filter((product) => {
      const matchesCategory =
        selectedCategory === "todos" || product.category === selectedCategory;
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [allProducts, selectedCategory, searchQuery]);

  // Lógica de paginación
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = React.useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage, PRODUCTS_PER_PAGE]);

  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  // --- MODIFICACIÓN DEL SCROLL: Scroll a la parte superior de la lista de productos cuando cambie la página, categoría o búsqueda ---
  useEffect(() => {
    if (productListRef.current) {
      productListRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentPage, selectedCategory, searchQuery]); // Dependencias: cualquier cambio aquí activa el scroll

  if (isLoading) {
    return (
      <section className="container mx-auto py-12 px-4 animate-pulse">
        <h2 className="text-3xl font-bold text-center mb-8">Nuestros Productos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {Array.from({ length: PRODUCTS_PER_PAGE }).map((_, index) => (
            <div key={index} className="bg-gray-200 rounded-lg h-80"></div>
          ))}
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="container mx-auto py-12 px-4 text-center text-red-500">
        <h2 className="text-3xl font-bold mb-8">Error al cargar productos</h2>
        <p>Hubo un problema al intentar obtener los productos: {error.message}</p>
        <p>Por favor, inténtalo de nuevo más tarde.</p>
      </section>
    );
  }

  return (
    // --- MODIFICACIÓN DEL SCROLL: Adjuntar la ref a la sección principal de productos ---
    <section ref={productListRef} className="container mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold text-center mb-8">Nuestros Productos</h2>

      {/* Controles de filtro y búsqueda */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <div className="w-full sm:w-auto">
          <Label htmlFor="category-select" className="sr-only">Filtrar por Categoría</Label>
          <Select
            onValueChange={(value) => {
              setSelectedCategory(value);
              setCurrentPage(1); // Reset a la primera página al cambiar la categoría
            }}
            value={selectedCategory}
          >
            <SelectTrigger id="category-select" className="w-full sm:w-[180px]">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todas las categorías</SelectItem>
              <SelectItem value="casual">Casual</SelectItem>
              <SelectItem value="fiesta">Fiesta</SelectItem>
              <SelectItem value="trabajo">Trabajo</SelectItem>
              <SelectItem value="deportivo">Deportivo</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar productos..."
            className="pl-9 w-full"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset a la primera página al buscar
            }}
          />
        </div>
      </div>

      <div className="min-h-[600px] flex flex-col justify-between">
        {paginatedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {paginatedProducts.map((product) => (
              <ProductCard key={product.name} product={product} /> 
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <h3 className="text-lg font-medium mb-2">No se encontraron productos</h3>
            <p className="text-muted-foreground mb-4">Intenta con otra búsqueda o categoría</p>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedCategory("todos");
                setSearchQuery("");
                setCurrentPage(1); // Reset page on clear filters
              }}
            >
              Ver todos los productos
            </Button>
          </div>
        )}

        {/* Controles de Paginación */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-8">
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
              ))}\
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
// src/components/ProductList.tsx
import React, { useEffect, useState, useRef } from "react"; // Importa useRef
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

  // --- Lógica de Paginación ---
  const PRODUCTS_PER_PAGE = 8;
  const [currentPage, setCurrentPage] = useState(1);

  // === AÑADIDO: Referencia para el scroll ===
  const productListRef = useRef<HTMLDivElement>(null);

  // Fetching de productos desde el backend con React Query
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

    params.append("active", "true"); // Siempre pedir productos activos para el cliente

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

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "todos" || product.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description &&
        product.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Efecto para reiniciar la paginación cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  // === AÑADIDO: Efecto para el scroll al cambiar de página o filtros ===
  useEffect(() => {
    if (productListRef.current) {
      // Opciones de scroll: 'auto', 'smooth'
      // 'start' o 'center' o 'end' para block
      productListRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentPage, selectedCategory, searchQuery]); // Dependencias: cuando la página o filtros cambian

  const goToPage = (page: number) => {
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

  if (isLoading && !isPlaceholderData) {
    return (
      <section className="container mx-auto px-4 py-8">
        <div className="text-center text-lg">Cargando productos...</div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500 text-lg">
          Error al cargar productos: {error?.message}
        </div>
      </section>
    );
  }

  return (
    // === AÑADIDO: Asigna la referencia al contenedor principal ===
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
              {/* Aquí deberías cargar dinámicamente tus categorías reales */}
              <SelectItem value="velas">Velas</SelectItem>
              <SelectItem value="difusores">Difusores</SelectItem>
              <SelectItem value="jabones">Jabones Artesanales</SelectItem>
              <SelectItem value="accesorios">Accesorios</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
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
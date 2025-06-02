// src/components/ProductList.tsx
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Label might not be strictly needed here, but keeping it if used elsewhere.
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

  // Fetching de productos desde el backend con React Query
  // Se añaden los parámetros de búsqueda, categoría y paginación
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

    const response = await api.get<ProductsResponse>(`/api/products?${params.toString()}`);
    return response.data;
  };

  const { data, isLoading, isError, error, isPlaceholderData } = useQuery<
    ProductsResponse,
    Error // Assuming Error type for `error`
  >({
    queryKey: ['products', currentPage, selectedCategory, searchQuery],
    queryFn: fetchProducts,
    // Use placeholderData instead of keepPreviousData for React Query v4+
    placeholderData: (previousData) => previousData,
    // `refetchOnWindowFocus: false` might be desired for better performance on large datasets
    // refetchOnWindowFocus: false,
  });

  // Use optional chaining for `data` and provide default empty arrays/values
  const products = data?.products || [];
  const totalPages = data?.totalPages || 1;
  const availableProducts = products.filter(product => product.active); // Solo mostrar productos activos en el frontend


  // Por ahora, generamos desde los productos activos para tener algo.
  const categories = Array.from(new Set(availableProducts.map((p) => p.category))) as string[];


  const goToPage = (page: number) => {
    setCurrentPage(page);
    // Optional: Scroll to top when changing page
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

  // Resetear la página a 1 cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);


  if (isLoading && !isPlaceholderData) { // Show loading only when no placeholder data is available
    return <div className="container mx-auto px-4 py-8 text-center">Cargando productos...</div>;
  }

  if (isError) {
    return <div className="container mx-auto px-4 py-8 text-center text-red-500">Error al cargar los productos: {error?.message}</div>;
  }

  return (
    <section id="productos" className="container mx-auto px-4 py-8">
      <h2 className="text-4xl font-serif font-extrabold text-center mb-10 text-magia-brown dark:text-gray-100 animate-fade-in-up">
        Nuestra Colección
      </h2>

      {/* Controles de filtro y búsqueda */}
      <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-card rounded-lg shadow-sm border border-border">
        {/* Búsqueda por nombre/descripción */}
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

        {/* Filtro por categoría */}
        <div className="w-full md:w-1/3 lg:w-1/4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccionar Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todas las categorías</SelectItem>
              {categories.map((category: string) => ( // Explicitly type category as string
                <SelectItem key={category} value={category}>
                  {category} {/* Ensure category is treated as string */}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid de productos */}
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
              {/* Renderizar solo un subconjunto de botones de página si hay muchas páginas,
                  o ajustar el rango si es necesario para no renderizar demasiados botones */}
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
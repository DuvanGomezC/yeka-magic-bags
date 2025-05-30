import React, { useEffect, useState } from "react";
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
import axios from "axios";
import { Product } from "@/types/product";

export default function ProductList() {
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");
  const [searchQuery, setSearchQuery] = useState("");

  // --- Lógica de Paginación ---
  const PRODUCTS_PER_PAGE = 8; // CAMBIO: Ahora 8 productos por página
  const [currentPage, setCurrentPage] = useState(1); // Estado para la página actual

  // Fetching de productos desde el backend con React Query
  const fetchProducts = async (): Promise<Product[]> => {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products`);
    return response.data;
  };

  const { data: products, isLoading, isError, error } = useQuery<Product[], Error>({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  // Filtrado y búsqueda local
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (isLoading || isError || !products) {
      setFilteredProducts([]);
      return;
    }

    // Filtra solo los productos activos
    let result = products.filter(product => product.active);

    // Aplicar filtro por categoría
    if (selectedCategory !== "todos") {
      result = result.filter((product) => product.category === selectedCategory);
    }

    // Aplicar filtro de búsqueda
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((product) =>
        product.name.toLowerCase().includes(query) ||
        (product.description && product.description.toLowerCase().includes(query))
      );
    }

    setFilteredProducts(result);
    // Reiniciar la página actual a 1 cada vez que los filtros cambian
    setCurrentPage(1);
  }, [selectedCategory, searchQuery, products, isLoading, isError]);

  // --- NUEVA LÓGICA: Scroll al inicio de la sección de productos al cambiar de página ---
  useEffect(() => {
    const productsSection = document.getElementById('productos');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentPage]); // Este efecto se ejecuta cada vez que currentPage cambia

  // Obtener categorías únicas de los productos activos
  const categories = ["todos", ...Array.from(new Set(products?.filter(p => p.active).map(p => p.category) || []))];

  // Calcular productos para mostrar en la página actual
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const productsToDisplay = filteredProducts.slice(startIndex, endIndex);

  // Manejadores de paginación
  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Estado de carga
  if (isLoading) {
    return (
      <section id="productos" className="container mx-auto p-8 py-16">
        <h2 className="text-4xl font-serif font-bold text-center text-magia-brown mb-12 dark:text-gray-100">
          Cargando Productos...
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg">
              <div className="aspect-square bg-gray-300 dark:bg-gray-600 rounded-t-lg"></div>
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/4 mt-4"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Estado de error
  if (isError) {
    return (
      <section id="productos" className="container mx-auto p-8 py-16">
        <h2 className="text-4xl font-serif font-bold text-center text-red-600 mb-12 dark:text-red-400">
          Error al Cargar Productos
        </h2>
        <p className="text-center text-gray-700 dark:text-gray-300">
          Hubo un problema al intentar obtener los productos: {error?.message}.
          Por favor, asegúrate de que el servidor backend esté corriendo y sea accesible.
        </p>
      </section>
    );
  }

  return (
    <section id="productos" className="py-16 bg-white texture-bg">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-2">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-magia-brown dark:text-gray-100">
            Nuestros Productos
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explora nuestra colección de bolsos artesanales diseñados con materiales de calidad y elaborados con pasión.
          </p>
        </div>

        {/* Controles de filtrado */}
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
          <div className="w-full sm:w-auto">
            <Label htmlFor="category" className="sr-only">Categoría</Label>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category} className="capitalize">
                    {category === "todos" ? "Todas las categorías" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full sm:w-auto relative">
            <Label htmlFor="search" className="sr-only">Buscar</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                type="search"
                placeholder="Buscar productos..."
                className="w-full sm:w-[300px] pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Lista de productos */}
        {productsToDisplay.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productsToDisplay.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
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
        {totalPages > 1 && ( // Mostrar paginación solo si hay más de 1 página
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
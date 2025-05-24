
import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types";
import { dummyProducts } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from "@/components/ui/select";
import { Search } from "lucide-react";

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // In a real app, this would be an API call
    setProducts(dummyProducts);
    setFilteredProducts(dummyProducts);
  }, []);

  useEffect(() => {
    let result = products;
    
    // Apply category filter
    if (selectedCategory !== "todos") {
      result = result.filter((product) => product.category === selectedCategory);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((product) => 
        product.name.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query)
      );
    }
    
    setFilteredProducts(result);
  }, [selectedCategory, searchQuery, products]);

  // Get unique categories
  const categories = ["todos", ...Array.from(new Set(products.map(p => p.category)))];

  return (
    <section id="productos" className="py-16 bg-white texture-bg">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-2">
          <h2 className="text-3xl md:text-4xl font-serif font-bold">Nuestros Productos</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explora nuestra colección de bolsos artesanales diseñados con materiales de calidad y elaborados con pasión.
          </p>
        </div>
        
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
        
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
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
      </div>
    </section>
  );
}

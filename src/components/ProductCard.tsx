
import { useState } from "react";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCart } from "@/context/CartContext";
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [currentImage, setCurrentImage] = useState(0);
  
  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % product.images.length);
  };
  
  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="group bg-white rounded-lg overflow-hidden border border-magia-tan/20 shadow-sm hover:shadow-md transition-shadow animate-fade-in">
      <Dialog>
        <DialogTrigger asChild>
          <div className="aspect-square overflow-hidden relative cursor-pointer">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
          </div>
        </DialogTrigger>
        
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">{product.name}</DialogTitle>
          </DialogHeader>
          
          <div className="mt-4 space-y-6">
            <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
              <img
                src={product.images[currentImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center justify-center space-x-2 overflow-x-auto py-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`h-16 w-16 rounded-md overflow-hidden flex-shrink-0 border-2 transition-colors ${
                    currentImage === index
                      ? "border-magia-terracotta"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} - Imagen ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
            
            <p className="text-sm text-muted-foreground">{product.description}</p>
            
            <div className="flex items-center justify-between">
              <div className="font-bold text-lg">
                ${product.price.toLocaleString()}
              </div>
              
              <Button
                onClick={() => addToCart(product)}
                className="flex items-center space-x-2"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Añadir al carrito</span>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <div className="p-4 space-y-2">
        <h3 className="font-medium truncate">{product.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
        
        <div className="pt-2 flex items-center justify-between">
          <div className="font-bold">
            ${product.price.toLocaleString()}
          </div>
          <Button
            onClick={() => addToCart(product)}
            size="sm"
            variant="outline"
            className="flex items-center space-x-1"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only sm:inline">Comprar</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

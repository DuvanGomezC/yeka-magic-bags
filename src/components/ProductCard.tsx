import { useState } from "react";
import { Product } from "@/types/product";
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
    if (product.images && product.images.length > 0) {
      setCurrentImage((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product.images && product.images.length > 0) {
      setCurrentImage((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  // Imagen principal para mostrar
  const mainImage = product.images && product.images.length > 0 
    ? product.images[currentImage] 
    : 'https://via.placeholder.com/400x400?text=No+Image';

  return (
    <div className="group bg-card text-card-foreground rounded-lg overflow-hidden border border-border shadow-sm hover:shadow-md transition-shadow animate-fade-in">
      <Dialog>
        <DialogTrigger asChild>
          <div className="aspect-square overflow-hidden relative cursor-pointer">
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors dark:bg-black/20 dark:group-hover:bg-black/10" />
          </div>
        </DialogTrigger>

        {/* Modal del producto */}
        <DialogContent className="sm:max-w-2xl max-h-[90dvh] flex flex-col p-2 sm:p-4 bg-background text-foreground">
          <div className="grid grid-rows-[auto_1fr_auto] h-full gap-2">
            {/* Header */}
            <DialogHeader className="px-2">
              <DialogTitle className="font-serif text-xl line-clamp-2">
                {product.name}
              </DialogTitle>
            </DialogHeader>

            {/* Contenido principal */}
            <div className="flex flex-col gap-3 overflow-hidden">
              {/* Área de imagen */}
              <div className="relative bg-muted rounded-lg flex-1 min-h-[200px] max-h-[40vh]">
                <img
                  src={mainImage}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />

                {/* Botones de navegación - solo si hay múltiples imágenes */}
                {product.images && product.images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-1/2 left-2 -translate-y-1/2 bg-popover/80 hover:bg-popover rounded-full shadow-md text-popover-foreground"
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
                      className="absolute top-1/2 right-2 -translate-y-1/2 bg-popover/80 hover:bg-popover rounded-full shadow-md text-popover-foreground"
                      onClick={(e) => {
                        e.stopPropagation();
                        nextImage();
                      }}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>

              {/* Miniaturas */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto py-1 px-2 -mx-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImage(index)}
                      className={`h-14 w-14 rounded-md overflow-hidden flex-shrink-0 border-2 transition-colors ${
                        currentImage === index
                          ? "border-primary"
                          : "border-border"
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
              )}

              {/* Descripción */}
              <div className="px-2">
                <p className="text-sm text-muted-foreground line-clamp-4">
                  {product.description || 'Sin descripción disponible.'}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-border pt-3 px-2">
              <div className="font-bold text-lg">
                ${product.price.toLocaleString('es-CO')}
              </div>

              <Button
                onClick={() => addToCart(product)}
                className="flex items-center gap-2 min-w-[140px] px-4 py-2 bg-green-600 text-white hover:bg-green-700 active:bg-green-800 transition-colors duration-200"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Añadir al carrito</span>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Contenido de la tarjeta normal */}
      <div className="p-4 space-y-2">
        <h3 className="font-medium truncate text-magia-brown dark:text-gray-100">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description 
            ? product.description.substring(0, 80) + (product.description.length > 80 ? '...' : '')
            : 'Sin descripción disponible.'
          }
        </p>

        <div className="pt-2 flex items-center justify-between">
          <div className="font-bold text-magia-terracotta">
            ${product.price.toLocaleString('es-CO')}
          </div>
          <Button
            onClick={() => addToCart(product)}
            size="sm"
            className="flex items-center gap-2 min-w-[100px] px-3 py-2 bg-green-600 text-white hover:bg-green-700 active:bg-green-800 transition-colors duration-200"
          >
            <ShoppingBag className="h-4 w-4 flex-shrink-0" />
            <span className="whitespace-nowrap">Añadir</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
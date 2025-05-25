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
    <div className="group bg-card text-card-foreground rounded-lg overflow-hidden border border-border shadow-sm hover:shadow-md transition-shadow animate-fade-in">
      <Dialog>
        <DialogTrigger asChild>
          <div className="aspect-square overflow-hidden relative cursor-pointer">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {/* Superposición que se adapta al tema */}
            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors dark:bg-black/20 dark:group-hover:bg-black/10" />
          </div>
        </DialogTrigger>

        {/* Diálogo optimizado */}
        <DialogContent className="sm:max-w-2xl max-h-[90dvh] flex flex-col p-2 sm:p-4 bg-background text-foreground">
          {/* Contenedor principal con grid para mejor distribución */}
          <div className="grid grid-rows-[auto_1fr_auto] h-full gap-2">
            {/* Header */}
            <DialogHeader className="px-2">
              <DialogTitle className="font-serif text-xl line-clamp-2">
                {product.name}
              </DialogTitle>
            </DialogHeader>

            {/* Contenido principal - flex column que crece */}
            <div className="flex flex-col gap-3 overflow-hidden">
              {/* Área de imagen con tamaño flexible pero controlado */}
              <div className="relative bg-muted rounded-lg flex-1 min-h-[200px] max-h-[40vh]">
                <img
                  src={product.images[currentImage]}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />

                {/* Botones de navegación */}
                {product.images.length > 1 && (
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

              {/* Miniaturas - solo si hay múltiples imágenes */}
              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto py-1 px-2 -mx-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImage(index)}
                      className={`h-14 w-14 rounded-md overflow-hidden flex-shrink-0 border-2 transition-colors ${
                        currentImage === index
                          ? "border-primary" // Asume 'primary' es tu color de acento principal
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

              {/* Descripción con altura fija */}
              <div className="px-2">
                <p className="text-sm text-muted-foreground line-clamp-4">
                  {product.description}
                </p>
              </div>
            </div>

            {/* Footer fijo */}
            <div className="flex items-center justify-between border-t border-border pt-3 px-2">
              <div className="font-bold text-lg">
                ${product.price.toLocaleString()}
              </div>

              <Button
                onClick={() => addToCart(product)}
                className="flex items-center gap-2"
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
        <h3 className="font-medium truncate">{product.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>

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
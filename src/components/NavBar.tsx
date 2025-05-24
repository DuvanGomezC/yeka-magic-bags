
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import CartDrawer from "./CartDrawer";

export default function NavBar() {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-magia-tan/20">
      <div className="container max-w-7xl mx-auto flex items-center justify-between h-16 px-4 sm:px-6">
        <div className="flex items-center">
          <a href="/" className="flex items-center">
            <h1 className="text-2xl md:text-3xl font-serif font-bold tracking-tight text-magia-brown">
              Magia <span className="text-magia-terracotta">Yeka</span>
            </h1>
          </a>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <a
            href="/"
            className="text-magia-dark hover:text-magia-terracotta transition-colors font-medium"
          >
            Inicio
          </a>
          <a
            href="#productos" // Agrega el href con el ID del elemento
            onClick={(e) => {
              e.preventDefault(); // Previene el comportamiento por defecto del enlace (que la URL cambie)
              document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-magia-dark hover:text-magia-terracotta transition-colors font-medium"
          >
            Productos
          </a>
          <a
            href="/nosotros"
            className="text-magia-dark hover:text-magia-terracotta transition-colors font-medium"
          >
            Nosotros
          </a>
          <a
            href="/contacto"
            className="text-magia-dark hover:text-magia-terracotta transition-colors font-medium"
          >
            Contacto
          </a>
        </nav>

        <div className="flex items-center space-x-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-magia-terracotta text-white text-xs flex items-center justify-center rounded-full">
                    {totalItems}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <CartDrawer />
          </Sheet>

          <Button
            variant="ghost"
            className="md:hidden"
            size="icon"
            onClick={() => alert("Menu mobile no implementado aún")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-menu"
            >
              <line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </Button>
        </div>
      </div>
    </header>
  );
}

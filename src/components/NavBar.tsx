// src/components/NavBar.tsx
import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ShoppingCart, Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useCart } from "@/context/CartContext"; // Asegúrate de que useCart esté importado correctamente

const NavBar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { totalItems } = useCart(); // <-- CAMBIO CLAVE AQUÍ: Usamos totalItems que ya existe en el contexto

  // totalItems ya es la cantidad total de artículos, no necesitas reducir cartItems
  const totalItemsInCart = totalItems;

  const location = useLocation();

  // Función para manejar el scroll a la parte superior de la página de inicio
  const handleScrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Si ya estamos en la ruta principal, prevenimos la navegación y hacemos scroll
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false); // Cerrar menú móvil si está abierto
  };

  // Función para manejar el scroll a la sección de productos
  const handleScrollToProducts = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Si ya estamos en la ruta principal, prevenimos la navegación y hacemos scroll
    if (location.pathname === '/') {
      e.preventDefault();
      const productsSection = document.getElementById('productos');
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    setIsMobileMenuOpen(false); // Cerrar menú móvil si está abierto
  };


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 font-bold text-xl" onClick={handleScrollToTop}>
          <img src="/logo-yeka-magic-bags.png" alt="Logo Yeka Magic Bags" className="h-8 w-auto" />
          <span className="sr-only sm:not-sr-only">Yeka Magic Bags</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <NavLink
            to="/"
            onClick={handleScrollToTop} // Usa la función de scroll/navegación
            className={({ isActive }) =>
              `text-lg font-medium transition-colors hover:text-primary ${
                isActive && location.pathname === '/' ? "text-primary" : "text-foreground"
              }`
            }
          >
            Inicio
          </NavLink>
          <NavLink
            to="/"
            onClick={handleScrollToProducts} // Usa la función de scroll/navegación
            className={({ isActive }) =>
              `text-lg font-medium transition-colors hover:text-primary ${
                isActive && location.pathname === '/' ? "text-primary" : "text-foreground"
              }`
            }
          >
            Productos
          </NavLink>
          <NavLink
            to="/about-us"
            className={({ isActive }) =>
              `text-lg font-medium transition-colors hover:text-primary ${
                isActive ? "text-primary" : "text-foreground"
              }`
            }
          >
            Nosotros
          </NavLink>
          <NavLink
            to="/contact-us"
            className={({ isActive }) =>
              `text-lg font-medium transition-colors hover:text-primary ${
                isActive ? "text-primary" : "text-foreground"
              }`
            }
          >
            Contacto
          </NavLink>
        </div>

        {/* Cart Icon & Theme Toggle (Desktop & Mobile) */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/cart" className="relative">
              <ShoppingCart className="h-6 w-6" />
              {totalItemsInCart > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  {totalItemsInCart}
                </span>
              )}
              <span className="sr-only">Ver carrito</span>
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Sun className="h-[1.5rem] w-[1.5rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.5rem] w-[1.5rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Claro
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Oscuro
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                Sistema
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            <span className="sr-only">Toggle mobile menu</span>
          </Button>
        </div>
      </nav>

      {/* Mobile Menu Content */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-t pb-4">
          <nav className="flex flex-col items-center gap-4 py-4">
            <NavLink
              to="/"
              onClick={handleScrollToTop} // Usa la función de scroll/navegación
              className={({ isActive }) =>
                `text-lg font-medium transition-colors hover:text-primary ${
                  isActive && location.pathname === '/' ? "text-primary" : "text-foreground"
                }`
              }
            >
              Inicio
            </NavLink>
            <NavLink
              to="/"
              onClick={handleScrollToProducts} // Usa la función de scroll/navegación
              className={({ isActive }) =>
                `text-lg font-medium transition-colors hover:text-primary ${
                  isActive && location.pathname === '/' ? "text-primary" : "text-foreground"
                }`
              }
            >
              Productos
            </NavLink>
            <NavLink
              to="/about-us"
              className={({ isActive }) =>
                `text-lg font-medium transition-colors hover:text-primary ${
                  isActive ? "text-primary" : "text-foreground"
                }`
              }
              onClick={() => setIsMobileMenuOpen(false)} // Cerrar menú al navegar
            >
              Nosotros
            </NavLink>
            <NavLink
              to="/contact-us"
              className={({ isActive }) =>
                `text-lg font-medium transition-colors hover:text-primary ${
                  isActive ? "text-primary" : "text-foreground"
                }`
              }
              onClick={() => setIsMobileMenuOpen(false)} // Cerrar menú al navegar
            >
              Contacto
            </NavLink>
          </nav>
        </div>
      )}
    </header>
  );
};

export default NavBar;
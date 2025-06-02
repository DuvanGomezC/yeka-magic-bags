// src/components/NavBar.tsx
import { ShoppingCart, LayoutDashboard } from "lucide-react"; // Añadido LayoutDashboard
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import CartDrawer from "./CartDrawer";
import { ModeToggle } from "./mode-toggle";
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn, LogOut } from "lucide-react"; // Iconos para login/logout

export default function NavBar() {
  const { totalItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth(); // Obtén el estado de autenticación y la función logout

  // Función para manejar el clic en el enlace de "Inicio"
  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (location.pathname === '/#inicio') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Función: Para manejar el clic en el enlace de "Productos"
  const handleProductsClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault(); // Siempre prevenimos el comportamiento por defecto del <a>

    if (location.pathname !== '/') {
      // Si NO estamos en la página de inicio, navegamos a ella con el hash
      navigate('/#productos');
      setTimeout(() => {
        document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' });
      }, 100); // Pequeño retardo para asegurar que el elemento exista después de la navegación
    } else {
      // Si ya estamos en la página de inicio, simplemente hacemos scroll
      document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-magia-tan/20 dark:bg-gray-900/90 dark:border-gray-700/20">
      <div className="container max-w-7xl mx-auto flex items-center justify-between h-16 px-4 sm:px-6">
        {/* Logo/Título del sitio */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center" onClick={handleHomeClick}>
            <h1 className="text-2xl md:text-3xl font-serif font-bold tracking-tight text-magia-brown dark:text-gray-100">
              Magia <span className="text-magia-terracotta">Yeka</span>
            </h1>
          </Link>
        </div>

        {/* Navegación principal (escritorio) */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            to="/#inicio"
            onClick={handleHomeClick}
            className="text-magia-dark hover:text-magia-terracotta transition-colors font-medium dark:text-gray-300 dark:hover:text-magia-terracotta"
          >
            Inicio
          </Link>
          <a
            href="/#productos"
            onClick={handleProductsClick}
            className="text-magia-dark hover:text-magia-terracotta transition-colors font-medium dark:text-gray-300 dark:hover:text-magia-terracotta"
          >
            Productos
          </a>
          <Link
            to="/about-us"
            className="text-magia-dark hover:text-magia-terracotta transition-colors font-medium dark:text-gray-300 dark:hover:text-magia-terracotta"
          >
            Nosotros
          </Link>
          <Link
            to="/contact-us"
            className="text-magia-dark hover:text-magia-terracotta transition-colors font-medium dark:text-gray-300 dark:hover:text-magia-terracotta"
          >
            Contactanos
          </Link>
        </nav>

        {/* Acciones de la derecha (Carrito, Modo, Login/Logout, Menú móvil) */}
        <div className="flex items-center space-x-4">
          {/* Botón de Carrito con Sheet (Drawer) */}
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

          {/* Componente para el cambio de tema (Claro/Oscuro) */}
          <ModeToggle />

          {/* Botones de Admin/Login/Logout en Desktop */}
          <div className="hidden md:flex items-center space-x-2"> {/* Modificado para usar flex y space-x para alinear botones */}
            {isAuthenticated ? (
              <>
                {/* Nuevo Botón del Panel de Admin */}
                <Link to="/admin">
                  <Button variant="outline" size="icon">
                    <LayoutDashboard className="h-5 w-5" />
                  </Button>
                </Link>
                {/* Botón de Cerrar Sesión */}
                <Button onClick={logout} variant="secondary" size="icon">
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <Link to="/admin-login">
                <Button variant="outline" size="icon">
                  <LogIn className="h-5 w-5" />
                </Button>
              </Link>
            )}
          </div>

          {/* Menú para dispositivos móviles */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="md:hidden"
                size="icon"
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
                  <line x1="4" x2="20" y1="12" y2="12" />
                  <line x1="4" x2="20" y1="6" y2="6" />
                  <line x1="4" x2="20" y1="18" y2="18" />
                </svg>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Navegación</SheetTitle>
                <SheetDescription>
                  Explora las secciones de Yeka Magic Bags.
                </SheetDescription>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-6 text-lg">
                <Link to="/" onClick={handleHomeClick} className="hover:text-magia-terracotta" >Inicio</Link>
                <a
                  href="/#productos"
                  onClick={handleProductsClick}
                  className="hover:text-magia-terracotta"
                >
                  Productos
                </a>
                <Link to="/about-us" className="hover:text-magia-terracotta">Nosotros</Link>
                <Link to="/contact-us" className="hover:text-magia-terracotta">Contactanos</Link>

                {/* Enlaces de Admin en el menú móvil (se mantienen como están, son consistentes) */}
                {isAuthenticated ? (
                  <>
                    <Link to="/admin" className="hover:text-magia-terracotta">Panel Admin</Link>
                    <Button onClick={logout} variant="ghost" className="justify-start px-0 text-lg hover:text-magia-terracotta">
                      <LogOut className="h-5 w-5 mr-2" /> Cerrar Sesión
                    </Button>
                  </>
                ) : (
                  <Link to="/admin-login" className="hover:text-magia-terracotta flex items-center">
                    <LogIn className="h-5 w-5 mr-2" /> Admin Login
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
// src/components/Footer.tsx
import React from 'react'; // Asegúrate de importar React
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Importa hooks necesarios
import { Instagram, Facebook, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  // Función para manejar el clic en el enlace de "Inicio" (reutilizada del NavBar)
  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Función para manejar el clic en el enlace de "Productos" (reutilizada del NavBar)
  const handleProductsClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();

    if (location.pathname !== '/') {
      navigate('/#productos');
      setTimeout(() => {
        document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="border-t border-magia-tan/20 bg-secondary/50 texture-bg">
      <div className="container mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Columna 1: Logo y descripción */}
          <div>
            {/* El logo también debe usar Link y el handleHomeClick */}
            <Link to="/" onClick={handleHomeClick} className="flex items-center">
              <h2 className="text-xl font-serif font-bold mb-4 text-magia-brown">Magia <span className="text-magia-terracotta">Yeka</span></h2>
            </Link>
            <p className="text-muted-foreground max-w-xs">
              Creamos bolsos artesanales con pasión y dedicación, utilizando materiales de alta calidad para brindarte productos únicos y duraderos.
            </p>
          </div>

          {/* Columna 2: Enlaces Rápidos */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">Enlaces</h3>
            <ul className="space-y-2">
              <li>
                <Link // Usa Link para navegación interna
                  to="/"
                  onClick={handleHomeClick} // Aplica el handleHomeClick
                  className="text-muted-foreground hover:text-magia-terracotta transition-colors"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <a // Mantener <a> si hay un hash en href y necesitas el onClick personalizado
                  href="/#productos" // Ruta completa con hash
                  onClick={handleProductsClick} // Aplica el handleProductsClick
                  className="text-muted-foreground hover:text-magia-terracotta transition-colors"
                >
                  Productos
                </a>
              </li>
              <li>
                <Link // Usa Link para navegación interna
                  to="/about"
                  className="text-muted-foreground hover:text-magia-terracotta transition-colors"
                >
                  Nosotros
                </Link>
              </li>
              <li>
                <Link // Usa Link para navegación interna
                  to="/contact"
                  className="text-muted-foreground hover:text-magia-terracotta transition-colors"
                >
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Información de Contacto */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">Contáctanos</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-magia-terracotta" />
                <a href="tel:+573156942777" className="text-muted-foreground hover:text-magia-terracotta transition-colors">
                  +57 315 694 2777
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-magia-terracotta" />
                <a href="mailto:info@magiayeka.com" className="text-muted-foreground hover:text-magia-terracotta transition-colors">
                  info@magiayeka.com
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-magia-terracotta" />
                <span className="text-muted-foreground">
                  Arauca, Colombia
                </span>
              </li>
              <li className="pt-2 flex items-center space-x-4">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-magia-terracotta transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-magia-terracotta transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-magia-tan/20 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Magia Yeka. Todos los derechos reservados.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6 text-sm text-muted-foreground">
            {/* Estos enlaces (Términos, Privacidad) probablemente no son rutas de React Router
                a menos que tengas esas páginas. Si son solo enlaces externos o a documentos,
                déjalos como <a> nativos. Si son rutas internas, cámbialos a <Link>.
                Por ahora, los dejo como <a> asumiendo que no son rutas SPA. */}
            <a href="/terminos" className="hover:text-magia-terracotta transition-colors">
              Términos de servicio
            </a>
            <a href="/privacidad" className="hover:text-magia-terracotta transition-colors">
              Política de privacidad
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
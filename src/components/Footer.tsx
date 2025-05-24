
import { Instagram, Facebook, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-magia-tan/20 bg-secondary/50 texture-bg">
      <div className="container mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h2 className="text-xl font-serif font-bold mb-4 text-magia-brown">Magia <span className="text-magia-terracotta">Yeka</span></h2>
            <p className="text-muted-foreground max-w-xs">
              Creamos bolsos artesanales con pasión y dedicación, utilizando materiales de alta calidad para brindarte productos únicos y duraderos.
            </p>
          </div>
          
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">Enlaces</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-muted-foreground hover:text-magia-terracotta transition-colors">
                  Inicio
                </a>
              </li>
              <li>
                <a href="/productos" className="text-muted-foreground hover:text-magia-terracotta transition-colors">
                  Productos
                </a>
              </li>
              <li>
                <a href="/nosotros" className="text-muted-foreground hover:text-magia-terracotta transition-colors">
                  Nosotros
                </a>
              </li>
              <li>
                <a href="/contacto" className="text-muted-foreground hover:text-magia-terracotta transition-colors">
                  Contacto
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">Contáctanos</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-magia-terracotta" />
                <a href="tel:+573102746181" className="text-muted-foreground hover:text-magia-terracotta transition-colors">
                  +57 310 274 6181
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
                  Bogotá, Colombia
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

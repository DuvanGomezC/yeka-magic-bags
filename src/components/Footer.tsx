// src/components/Footer.tsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Instagram, Facebook, Mail, MapPin, Phone, X } from "lucide-react";

// Importar los componentes de Dialog de Shadcn UI
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  // Función para manejar el clic en el enlace de "Inicio"
  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Función para manejar el clic en el enlace de "Productos"
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

  // Contenido para Términos de Servicio
  const termsOfServiceContent = (
    <div className="space-y-4 text-foreground leading-relaxed">
      <p>Estos son los Términos de Servicio de Magia Yeka. Al utilizar nuestro sitio web y servicios, aceptas los siguientes términos:</p>
      <h3 className="font-serif text-lg font-semibold text-primary">1. Aceptación de los Términos</h3>
      <p>Al acceder o utilizar nuestro sitio web, reconoces haber leído, entendido y aceptado estos Términos de Servicio.</p>
      <h3 className="font-serif text-lg font-semibold text-primary">2. Uso del Servicio</h3>
      <p>El sitio web de Magia Yeka está destinado a proporcionar información sobre nuestros productos y facilitar la compra de bolsos artesanales.</p>
      <h3 className="font-serif text-lg font-semibold text-primary">3. Propiedad Intelectual</h3>
      <p>Todo el contenido presente en este sitio web, incluyendo textos, gráficos, logotipos, imágenes y software, es propiedad de Magia Yeka o de sus proveedores de contenido y está protegido por las leyes de derechos de autor.</p>
      <h3 className="font-serif text-lg font-semibold text-primary">4. Precios y Pagos</h3>
      <p>Todos los precios de los productos están sujetos a cambios sin previo aviso. Aceptamos pagos a través de los métodos indicados en nuestro sitio web.</p>
      <h3 className="font-serif text-lg font-semibold text-primary">5. Envíos y Devoluciones</h3>
      <p>Consulta nuestra política de envíos y devoluciones para obtener información detallada sobre estos procesos.</p>
      <h3 className="font-serif text-lg font-semibold text-primary">6. Limitación de Responsabilidad</h3>
      <p>Magia Yeka no será responsable de ningún daño directo, indirecto, incidental, especial, consecuente o punitivo que resulte del uso o la imposibilidad de usar nuestro sitio web o servicios.</p>
      <h3 className="font-serif text-lg font-semibold text-primary">7. Modificaciones de los Términos</h3>
      <p>Nos reservamos el derecho de modificar estos Términos de Servicio en cualquier momento. Se te notificará sobre cualquier cambio importante a través de nuestro sitio web.</p>
      <h3 className="font-serif text-lg font-semibold text-primary">8. Contacto</h3>
      <p>Si tienes alguna pregunta sobre estos Términos de Servicio, por favor contáctanos a través de la sección "Contáctanos" de nuestro sitio web.</p>
    </div>
  );

  // Contenido para Política de Privacidad
  const privacyPolicyContent = (
    <div className="space-y-4 text-foreground leading-relaxed">
      <p>En Magia Yeka, nos comprometemos a proteger tu privacidad. Esta política de privacidad describe cómo recopilamos, utilizamos y protegemos tu información personal.</p>
      <h3 className="font-serif text-lg font-semibold text-primary">1. Información que Recopilamos</h3>
      <p>Recopilamos información personal que nos proporcionas directamente, como tu nombre, dirección de correo electrónico, dirección de envío y detalles de pago, cuando realizas una compra o te registras en nuestro sitio.</p>
      <h3 className="font-serif text-lg font-semibold text-primary">2. Uso de la Información</h3>
      <p>Utilizamos la información recopilada para procesar tus pedidos, mejorar nuestros servicios, comunicarnos contigo sobre promociones y novedades, y personalizar tu experiencia en nuestro sitio.</p>
      <h3 className="font-serif text-lg font-semibold text-primary">3. Compartir Información</h3>
      <p>No vendemos, alquilamos ni compartimos tu información personal con terceros, excepto con proveedores de servicios que nos ayudan a operar nuestro negocio (por ejemplo, empresas de envío y pasarelas de pago), quienes están obligados a mantener la confidencialidad de tu información.</p>
      <h3 className="font-serif text-lg font-semibold text-primary">4. Seguridad de los Datos</h3>
      <p>Implementamos medidas de seguridad para proteger tu información personal contra el acceso no autorizado, la divulgación, la alteración o la destrucción.</p>
      <h3 className="font-serif text-lg font-semibold text-primary">5. Cookies</h3>
      <p>Utilizamos cookies y tecnologías similares para mejorar la funcionalidad del sitio web, analizar el tráfico y personalizar el contenido.</p>
      <h3 className="font-serif text-lg font-semibold text-primary">6. Tus Derechos</h3>
      <p>Tienes derecho a acceder, corregir o eliminar tu información personal en cualquier momento. Contáctanos si deseas ejercer estos derechos.</p>
      <h3 className="font-serif text-lg font-semibold text-primary">7. Cambios en la Política de Privacidad</h3>
      <p>Nos reservamos el derecho de actualizar esta política de privacidad ocasionalmente. Te notificaremos sobre cualquier cambio publicando la nueva política en nuestro sitio web.</p>
      <h3 className="font-serif text-lg font-semibold text-primary">8. Contacto</h3>
      <p>Si tienes alguna pregunta sobre esta Política de Privacidad, por favor contáctanos.</p>
    </div>
  );

  return (
    <footer className="border-t border-magia-tan/20 bg-secondary/50 texture-bg">
      <div className="container mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Columna 1: Logo y descripción */}
          <div>
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
                <Link
                  to="/"
                  onClick={handleHomeClick}
                  className="text-muted-foreground hover:text-magia-terracotta transition-colors"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <a
                  href="/#productos"
                  onClick={handleProductsClick}
                  className="text-muted-foreground hover:text-magia-terracotta transition-colors"
                >
                  Productos
                </a>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-muted-foreground hover:text-magia-terracotta transition-colors"
                >
                  Nosotros
                </Link>
              </li>
              <li>
                <Link
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
            {/* Diálogo para Términos de servicio */}
            <Dialog>
              <DialogTrigger asChild>
                <button className="hover:text-magia-terracotta transition-colors cursor-pointer">
                  Términos de servicio
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-xl md:max-w-3xl max-h-[90vh] overflow-y-auto border-border">
                <DialogHeader className="border-b border-border/50 pb-4 mb-4">
                  <DialogTitle className="font-serif text-2xl font-bold text-primary">
                    Términos de Servicio
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground mt-1">
                    Condiciones que rigen el uso de nuestro sitio web y servicios.
                  </DialogDescription>
                </DialogHeader>
                {termsOfServiceContent}
                <div className="flex justify-end pt-4 border-t border-border/50 mt-4">
                  <DialogClose asChild>
                    <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 text-muted-foreground hover:text-foreground">
                      Cerrar <X className="ml-2 h-4 w-4" />
                    </button>
                  </DialogClose>
                </div>
              </DialogContent>
            </Dialog>

            {/* Diálogo para Política de privacidad */}
            <Dialog>
              <DialogTrigger asChild>
                <button className="hover:text-magia-terracotta transition-colors cursor-pointer">
                  Política de privacidad
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-xl md:max-w-3xl max-h-[90vh] overflow-y-auto border-border">
                <DialogHeader className="border-b border-border/50 pb-4 mb-4">
                  <DialogTitle className="font-serif text-2xl font-bold text-primary">
                    Política de Privacidad
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground mt-1">
                    Información sobre cómo recopilamos, usamos y protegemos tus datos.
                  </DialogDescription>
                </DialogHeader>
                {privacyPolicyContent}
                <div className="flex justify-end pt-4 border-t border-border/50 mt-4">
                  <DialogClose asChild>
                    <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 text-muted-foreground hover:text-foreground">
                      Cerrar <X className="ml-2 h-4 w-4" />
                    </button>
                  </DialogClose>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </footer>
  );
}
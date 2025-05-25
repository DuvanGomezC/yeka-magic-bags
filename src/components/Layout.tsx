// src/components/Layout.tsx
import React from 'react';
import NavBar from './NavBar'; // Importa tu componente NavBar
import Footer from './Footer'; // Importa tu componente Footer

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* ¡SOLO DEJA ESTO! Renderiza tu componente NavBar */}
      <NavBar />

      {/* Contenido principal de la página */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
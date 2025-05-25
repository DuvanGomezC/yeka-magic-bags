// src/components/ScrollToTop.tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Cuando la ruta cambia, haz scroll al inicio de la ventana.
    // Solo haz scroll si no hay un hash en la URL, ya que los hashes
    // están destinados a hacer scroll a un elemento específico.
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: 'auto' }); // 'auto' para un scroll instantáneo, 'smooth' para suave
    }
  }, [pathname]); // Este efecto se ejecuta cada vez que el pathname (la ruta) cambia

  return null; // Este componente no renderiza nada visualmente
};

export default ScrollToTop;
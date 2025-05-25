import Hero from "@/components/Hero";
import ProductList from "@/components/ProductList";
// ¡Ya no necesitamos importar NavBar, Footer o CartProvider aquí!
// Ya son proporcionados por el Layout y App.tsx

const Index = () => {
  return (
    // ¡Eliminamos el CartProvider de aquí, ya está en App.tsx!
    // Eliminamos el div con flex-col y min-h-screen, ya está en Layout.tsx
    // Eliminamos <NavBar /> y <Footer /> porque ya están en Layout.tsx
    <> {/* Usamos un React Fragment <>...</> para agrupar sin añadir un div extra */}
      <Hero />
      <ProductList />
    </>
  );
};

export default Index;
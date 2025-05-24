
import NavBar from "@/components/NavBar";
import Hero from "@/components/Hero";
import ProductList from "@/components/ProductList";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";

const Index = () => {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-grow">
          <Hero />
          <ProductList />
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
};

export default Index;

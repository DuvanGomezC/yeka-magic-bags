// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { ThemeProvider } from "./components/theme-provider"; // <-- Asegúrate de que la ruta sea correcta

// Importa tu CartProvider y el nuevo ScrollToTop
import { CartProvider } from "./context/CartContext";
import ScrollToTop from "./components/ScrollToTop";

// Páginas
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";

// Componente de Layout
import Layout from "./components/Layout";

// Importa ThemeProvider desde el lugar correcto
import { ThemeProvider } from "@/components/theme-provider"; // <-- Asegúrate de esta importación

const queryClient = new QueryClient();

const App = () => (
  // ThemeProvider DEBE envolver toda la aplicación para que el tema funcione globalmente
  <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme"> {/* <-- Aquí está el ThemeProvider */}
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <CartProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Layout>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/contact" element={<ContactUs />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
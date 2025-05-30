// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster"; // Este es el Toaster de shadcn/ui para toasts
import { Toaster as SonnerToaster } from "sonner"; // <-- CAMBIO AQUÍ: Importa Toaster de sonner y renómbralo
import { TooltipProvider } from "@/components/ui/tooltip";

import { CartProvider } from "./context/CartContext";
import ScrollToTop from "./components/ScrollToTop";
// Páginas existentes
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
// Componente de Layout
import Layout from "./components/Layout";
// Importa ThemeProvider desde el lugar correcto
import { ThemeProvider } from "@/components/theme-provider";

// NUEVAS IMPORTACIONES PARA EL ADMINISTRADOR
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster /> {/* Este es el Toaster de shadcn/ui */}
        <SonnerToaster /> {/* <-- CAMBIO AQUÍ: Este es el Toaster de sonner */}
        <CartProvider>
          {/* Envuelve toda la aplicación con AuthProvider */}
          <AuthProvider>
            <BrowserRouter>
              <ScrollToTop />
              <Layout>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/about-us" element={<AboutUs />} />
                  <Route path="/contact-us" element={<ContactUs />} />
                  <Route path="/admin-login" element={<AdminLoginPage />} />

                  {/* Ruta protegida para el panel de administración */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* Manejo de rutas no encontradas */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </BrowserRouter>
          </AuthProvider>
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
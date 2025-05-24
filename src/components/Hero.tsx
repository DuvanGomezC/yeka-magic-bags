
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-r from-magia-cream via-white to-magia-cream overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 z-10">
            <div className="bg-magia-terracotta/10 text-magia-terracotta font-medium rounded-full px-4 py-1 text-sm inline-block animate-fade-in">
              Diseño artesanal
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight tracking-tighter animate-fade-in">
              Bolsos artesanales <span className="text-magia-terracotta">únicos</span> y de alta calidad
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-lg animate-fade-in">
              Cada bolso de Magia Yeka es una obra de arte única, fabricada a mano con materiales de la más alta calidad y atención al detalle.
            </p>
            
            <div className="flex items-center flex-wrap gap-4 pt-2 animate-fade-in">
              <Button 
                size="lg" 
                className="px-8 bg-magia-brown hover:bg-magia-brown/90"
                onClick={() => document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Ver catálogo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button variant="outline" size="lg" className="px-8">
                Conocer más
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -inset-4 border-4 border-magia-tan/20 rounded-lg transform rotate-6"></div>
            <div className="absolute -inset-4 border-4 border-magia-terracotta/20 rounded-lg transform -rotate-3"></div>
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-xl animate-zoom-in">
              <img 
                src="https://images.unsplash.com/photo-1591561954555-607968c989ab?q=80&w=1974&auto=format&fit=crop"
                alt="Colección de bolsos artesanales" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
}

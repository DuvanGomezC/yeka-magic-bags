import { Button } from "@/components/ui/button";
import { ArrowRight, Info, X } from "lucide-react"; // Importar Info y X
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose, // Importar DialogClose
} from "@/components/ui/dialog"; // Asegurarse de que importa de aquí

export default function Hero() {
  return (
    <section className="relative bg-background text-foreground transition-colors duration-300 overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28"> {/* Ajuste de padding para armonizar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-7 z-10"> {/* Espaciado consistente */}
            {/* Tag de diseño artesanal: Más acentuado y con un sutil degradado de texto */}
                      {/* Título principal: Mayor impacto visual y el acento estratégico */}
            <h1
              className="text-5xl md:text-6xl lg:text-7xl font-serif font-extrabold leading-tight tracking-tighter animate-fade-in drop-shadow-sm"
              style={{ '--animation-delay': '0.3s' } as React.CSSProperties}
            >
              Bolsos artesanales <span className="text-accent inline-block">únicos</span> y de alta calidad
            </h1>

            {/* Párrafo: Mejora de la legibilidad con muted-foreground */}
            <p
              className="text-xl text-muted-foreground max-w-lg leading-relaxed animate-fade-in"
              style={{ '--animation-delay': '0.45s' } as React.CSSProperties}
            >
              Cada bolso de Magia Yeka es una obra de arte única, fabricada a mano con materiales de la más alta calidad y atención al detalle.
            </p>

            <div
              className="flex items-center flex-wrap gap-5 pt-3 animate-fade-in"
              style={{ '--animation-delay': '0.6s' } as React.CSSProperties}
            >
              {/* Botón principal: Destacado, con sombra y efecto hover más premium */}
              <Button
                size="lg"
                className="px-9 py-3.5 bg-[rgb(var(--magia-brown-rgb))] hover:bg-[rgb(var(--magia-dark-rgb))] text-primary-foreground
                           shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5
                           focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-background"
                onClick={() => document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Ver catálogo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              {/* Botón "Conocer más" ahora abre un Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-9 py-3.5 border-2 border-border text-foreground hover:bg-secondary hover:text-secondary-foreground
                               transition-all duration-300 focus:ring-2 focus:ring-offset-2 focus:ring-input focus:ring-offset-background"
                  >
                    <Info className="mr-2 h-5 w-5" />
                    Conocer más
                  </Button>
                </DialogTrigger>
                {/* *** CLASES DE DialogContent EN HERO.TSX ***
                  - Eliminé cualquier clase de fondo o padding para que herede las del dialog.tsx base.
                  - Solo manejamos el tamaño y el borde aquí.
                */}
                <DialogContent className="max-w-xl md:max-w-3xl max-h-[90vh] overflow-y-auto border-border">
                  <DialogHeader className="border-b border-border/50 pb-4 mb-4">
                    <DialogTitle className="font-serif text-3xl font-bold text-primary">
                      La Esencia de Magia Yeka
                    </DialogTitle>
                    <DialogDescription className="text-lg text-muted-foreground mt-2">
                      Descubre el alma detrás de cada creación artesanal.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6 text-foreground leading-relaxed">
                    <p>
                      En Magia Yeka, cada bolso es más que un accesorio; es una historia tejida con pasión y tradición. Creemos en la belleza de lo hecho a mano, donde cada puntada y cada detalle reflejan el corazón de nuestros artesanos.
                    </p>
                    <p>
                      Utilizamos solo los materiales más finos y sostenibles, cuidadosamente seleccionados para garantizar no solo la durabilidad, sino también la autenticidad y el impacto positivo en nuestra comunidad. Nuestro proceso combina técnicas ancestrales con un toque moderno, resultando en piezas atemporales y verdaderamente únicas.
                    </p>
                    <h3 className="font-serif text-xl font-semibold text-primary pt-4">Nuestros Valores:</h3>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>Autenticidad y Artesanía: Celebramos la singularidad de cada pieza.</li>
                      <li>Calidad Inigualable: Compromiso con materiales duraderos y acabados perfectos.</li>
                      <li>Diseño Consciente: Creando belleza con responsabilidad social y ambiental.</li>
                      <li>Conexión Humana: Valoramos el talento de nuestros artesanos y la historia de cada cliente.</li>
                    </ul>
                    <p className="mt-4">
                      Te invitamos a ser parte de nuestra historia y a llevar contigo un pedazo de Magia Yeka.
                    </p>
                  </div>
                  {/* Botón de cierre funcional, envuelto en DialogClose */}
                  <div className="flex justify-end pt-4 border-t border-border/50 mt-4">
                    <DialogClose asChild>
                      <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                        Cerrar <X className="ml-2 h-4 w-4" />
                      </Button>
                    </DialogClose>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div
            className="relative animate-zoom-in"
            style={{ '--animation-delay': '0.75s' } as React.CSSProperties}
          >
            {/* Bordes decorativos: Más prominentes y artísticos */}
            <div className="absolute -inset-5 bg-[rgb(var(--magia-tan-rgb))] rounded-2xl transform rotate-6 scale-105 opacity-20 shadow-2xl"></div>
            <div className="absolute -inset-5 bg-[rgb(var(--magia-terracotta-rgb))] rounded-2xl transform -rotate-3 scale-105 opacity-20 shadow-2xl"></div>
            {/* Imagen principal: Con un sutil borde y un efecto de "flotación" al cargar */}
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-2xl border-2 border-border/50">
              <img
                src="https://images.unsplash.com/photo-1591561954555-607968c989ab?q=80&w=1974&auto=format&fit=crop"
                alt="Colección de bolsos artesanales"
                className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Degradado inferior: Más alto y prominente para una transición suave */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background to-transparent pointer-events-none"></div>
    </section>
  );
}
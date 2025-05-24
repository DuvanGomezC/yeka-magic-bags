
import { 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Minus, Plus, Trash2 } from "lucide-react";
import CheckoutForm from "./CheckoutForm";

export default function CartDrawer() {
  const { items, totalPrice, updateQuantity, removeFromCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  
  if (items.length === 0) {
    return (
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl font-serif">Tu Carrito</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-muted-foreground">Tu carrito está vacío</p>
          <SheetClose asChild>
            <Button variant="outline" className="mt-4">
              Seguir comprando
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    );
  }

  if (showCheckout) {
    return (
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl font-serif">Finalizar Compra</SheetTitle>
        </SheetHeader>
        <CheckoutForm onBack={() => setShowCheckout(false)} />
      </SheetContent>
    );
  }

  return (
    <SheetContent className="w-full sm:max-w-md overflow-y-auto">
      <SheetHeader className="mb-6">
        <SheetTitle className="text-2xl font-serif">Tu Carrito</SheetTitle>
      </SheetHeader>
      
      <div className="space-y-6 py-2">
        {items.map((item) => (
          <div key={item.product.id} className="flex items-start space-x-4 animate-fade-in">
            <div className="h-16 w-16 rounded bg-muted overflow-hidden">
              <img 
                src={item.product.images[0]} 
                alt={item.product.name} 
                className="h-full w-full object-cover"
              />
            </div>
            
            <div className="flex-1 space-y-1">
              <div className="flex justify-between">
                <h4 className="font-medium leading-none">{item.product.name}</h4>
                <button 
                  onClick={() => removeFromCart(item.product.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              
              <p className="text-sm text-muted-foreground">
                ${item.product.price.toLocaleString()}
              </p>
              
              <div className="flex items-center space-x-2 mt-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-7 w-7"
                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-6 text-center">{item.quantity}</span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-7 w-7"
                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <Separator className="my-4" />
      
      <div className="flex items-center justify-between mb-4">
        <span className="font-medium">Total:</span>
        <span className="font-bold text-lg">${totalPrice.toLocaleString()}</span>
      </div>
      
      <SheetFooter>
        <div className="w-full flex flex-col space-y-2">
          <Button 
            onClick={() => setShowCheckout(true)}
            className="w-full"
          >
            Comprar Ahora
          </Button>
          <SheetClose asChild>
            <Button variant="outline" className="w-full">
              Seguir comprando
            </Button>
          </SheetClose>
        </div>
      </SheetFooter>
    </SheetContent>
  );
}

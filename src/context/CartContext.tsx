// src/context/CartContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { CartItem, Product } from "@/types/product"; // Importa correctamente Product y CartItem
import { useToast } from "@/components/ui/use-toast";

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void; // Asegura que productId es string aquí
  updateQuantity: (productId: string, quantity: number) => void; // Asegura que productId es string aquí
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "magiayeka_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const storedCart = sessionStorage.getItem(CART_STORAGE_KEY);
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error("Error al cargar el carrito de sessionStorage:", error);
      return [];
    }
  });
  const { toast } = useToast();

  useEffect(() => {
    try {
      sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Error al guardar el carrito en sessionStorage:", error);
    }
  }, [items]);

  const addToCart = (product: Product) => {
    setItems((prevItems) => {
      // product.id (string) se compara con item.product.id (string)
      const existingItem = prevItems.find((item) => item.product.id === product.id);
      
      if (existingItem) {
        toast({
          title: "Cantidad actualizada",
          description: `${product.name} ahora tiene ${existingItem.quantity + 1} en tu carrito`,
        });
        
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        toast({
          title: "Producto añadido",
          description: `${product.name} ha sido añadido a tu carrito`,
        });
        
        return [...prevItems, { product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId: string) => { // Recibe string
    setItems((prevItems) => {
      // item.product.id (string) se compara con productId (string)
      const updatedItems = prevItems.filter((item) => item.product.id !== productId);
      toast({
        title: "Producto eliminado",
        description: "El producto ha sido eliminado de tu carrito.",
      });
      return updatedItems;
    });
  };

  const updateQuantity = (productId: string, quantity: number) => { // Recibe string
    setItems((prevItems) => {
      if (quantity <= 0) {
        // item.product.id (string) se compara con productId (string)
        const updatedItems = prevItems.filter((item) => item.product.id !== productId);
        toast({
          title: "Producto eliminado",
          description: "La cantidad llegó a cero, el producto ha sido eliminado.",
        });
        return updatedItems;
      }

      const updatedItems = prevItems.map((item) =>
        // item.product.id (string) se compara con productId (string)
        item.product.id === productId ? { ...item, quantity } : item
      );
      return updatedItems;
    });
  };

  const clearCart = () => {
    setItems([]);
    toast({
      title: "Carrito vaciado",
      description: "Todos los productos han sido eliminados de tu carrito.",
    });
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
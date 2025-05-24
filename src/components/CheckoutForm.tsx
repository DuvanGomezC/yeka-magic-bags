
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createWhatsAppLink } from "@/utils/whatsapp";
import { ArrowLeft } from "lucide-react";

interface CheckoutFormProps {
  onBack: () => void;
}

export default function CheckoutForm({ onBack }: CheckoutFormProps) {
  const { items, totalPrice, clearCart } = useCart();
  const [customerDetails, setCustomerDetails] = useState({
    fullName: "",
    address: "",
    city: "",
    phoneNumber: ""
  });

  const [errors, setErrors] = useState({
    fullName: "",
    address: "",
    city: "",
    phoneNumber: ""
  });

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      fullName: "",
      address: "",
      city: "",
      phoneNumber: ""
    };

    if (!customerDetails.fullName.trim()) {
      newErrors.fullName = "El nombre es requerido";
      valid = false;
    }

    if (!customerDetails.address.trim()) {
      newErrors.address = "La dirección es requerida";
      valid = false;
    }

    if (!customerDetails.city.trim()) {
      newErrors.city = "La ciudad es requerida";
      valid = false;
    }

    if (!customerDetails.phoneNumber.trim()) {
      newErrors.phoneNumber = "El número de teléfono es requerido";
      valid = false;
    } else if (!/^\d{10}$/.test(customerDetails.phoneNumber.replace(/\s/g, ''))) {
      newErrors.phoneNumber = "Ingresa un número válido de 10 dígitos";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerDetails((prev) => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error on input change
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const whatsappLink = createWhatsAppLink(customerDetails, items);
      window.open(whatsappLink, '_blank');
      clearCart();
    }
  };

  return (
    <div className="space-y-6">
      <Button 
        variant="ghost" 
        onClick={onBack} 
        className="flex items-center space-x-2 hover:bg-transparent hover:text-magia-terracotta p-0 mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Volver al carrito</span>
      </Button>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Nombre completo</Label>
          <Input
            id="fullName"
            name="fullName"
            placeholder="Ingresa tu nombre completo"
            value={customerDetails.fullName}
            onChange={handleChange}
          />
          {errors.fullName && <p className="text-destructive text-sm">{errors.fullName}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Dirección de entrega</Label>
          <Input
            id="address"
            name="address"
            placeholder="Ingresa tu dirección completa"
            value={customerDetails.address}
            onChange={handleChange}
          />
          {errors.address && <p className="text-destructive text-sm">{errors.address}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">Ciudad</Label>
          <Input
            id="city"
            name="city"
            placeholder="Ingresa tu ciudad"
            value={customerDetails.city}
            onChange={handleChange}
          />
          {errors.city && <p className="text-destructive text-sm">{errors.city}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Número de celular</Label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            placeholder="Ej. 3101234567"
            value={customerDetails.phoneNumber}
            onChange={handleChange}
          />
          {errors.phoneNumber && <p className="text-destructive text-sm">{errors.phoneNumber}</p>}
        </div>

        <div className="border rounded-md p-4 space-y-2 bg-secondary/50">
          <h3 className="font-medium">Resumen del pedido</h3>
          
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.product.id} className="flex justify-between text-sm">
                <span>{item.quantity}x {item.product.name}</span>
                <span>${(item.product.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          
          <div className="pt-2 border-t flex justify-between font-medium">
            <span>Total:</span>
            <span>${totalPrice.toLocaleString()}</span>
          </div>
        </div>

        <Button type="submit" className="w-full">
          Enviar pedido por WhatsApp
        </Button>
      </form>
    </div>
  );
}

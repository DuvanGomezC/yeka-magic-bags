
export function createWhatsAppLink(customerData: {
  fullName: string;
  address: string;
  city: string;
  phoneNumber: string;
}, cartItems: {
  product: {
    name: string;
    price: number;
  };
  quantity: number;
}[]) {
  // Create message content
  let message = `*Nuevo Pedido de ${customerData.fullName}*\n\n`;
  
  // Add customer information
  message += `*Información del Cliente:*\n`;
  message += `Nombre: ${customerData.fullName}\n`;
  message += `Dirección: ${customerData.address}\n`;
  message += `Ciudad: ${customerData.city}\n`;
  message += `Teléfono: ${customerData.phoneNumber}\n\n`;
  
  // Add product information
  message += `*Productos:*\n`;
  
  let totalPrice = 0;
  cartItems.forEach((item, index) => {
    const itemTotalPrice = item.product.price * item.quantity;
    totalPrice += itemTotalPrice;
    
    message += `${index + 1}. ${item.product.name} x ${item.quantity} - $${itemTotalPrice.toLocaleString()}\n`;
  });
  
  // Add total
  message += `\n*Total: $${totalPrice.toLocaleString()}*\n\n`;
  message += "Gracias por tu compra!";
  
  // Create WhatsApp link with encoded message
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/573102746181?text=${encodedMessage}`;
}


export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  images: string[];
  category: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CustomerDetails {
  fullName: string;
  address: string;
  city: string;
  phoneNumber: string;
}

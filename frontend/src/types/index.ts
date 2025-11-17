export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'CUSTOMER';
  createdAt?: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  Category: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  id: string;
  quantity: number;
  totalPrice: number;
  product: {
    id: string;
    title: string;
    price: number;
    imageUrl: string;
  };
}

export interface Order {
  id: string;
  total: number;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  createdAt: string;
  items: OrderItem[];
}

export interface OrderItem {
  id?: string;
  product: {
    id: string;
    title: string;
    price: number;
    imageUrl: string;
  };
  quantity: number;
  price: number;
  subtotal: number;
}

export interface AuthResponse {
  token?: string;
  jwt?: string;
  user?: User;
  message?: string;
}
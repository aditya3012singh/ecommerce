import axios from 'axios';
import { Product, CartItem, Order, AuthResponse } from '../types';

const API_BASE_URL = 'http://localhost:3000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

// Auth API
export const authAPI = {
  signup: async (data: { email: string; name: string; password: string; role?: string }): Promise<AuthResponse> => {
    const response = await api.post('/signup', data);
    return response.data;
  },

  signin: async (data: { email: string; password: string }): Promise<AuthResponse> => {
    const response = await api.post('/signin', data);
    return response.data;
  },

  getUser: async (id: string) => {
    const response = await api.get(`/user/${id}`);
    return response.data;
  },
};

// Products API
export const productsAPI = {
  getAll: async (): Promise<{ products: Product[] }> => {
    const response = await api.get('/products');
    return response.data;
  },

  getById: async (id: string): Promise<{ product: Product }> => {
    const response = await api.get(`/product/${id}`);
    return response.data;
  },

  create: async (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ product: Product }> => {
    const response = await api.post('/product', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Product>): Promise<{ product: Product }> => {
    const response = await api.put(`/product/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/product/${id}`);
    return response.data;
  },
};

// Cart API
export const cartAPI = {
  getCart: async (): Promise<{ cartItems: CartItem[] }> => {
    const response = await api.get('/cart');
    return response.data;
  },

  addToCart: async (data: { productId: string; quantity: number }): Promise<{ cartItem: CartItem }> => {
    const response = await api.post('/cart', data);
    return response.data;
  },

  updateCartItem: async (id: string, quantity: number): Promise<{ cartItem: CartItem }> => {
    const response = await api.put(`/cart/${id}`, { quantity });
    return response.data;
  },

  removeFromCart: async (id: string) => {
    const response = await api.delete(`/cart/${id}`);
    return response.data;
  },
};

// Orders API
export const ordersAPI = {
  createOrder: async () => {
    const response = await api.post('/orderitems');
    return response.data;
  },

  getOrders: async (): Promise<{ orders: Order[] }> => {
    const response = await api.get('/orderitems');
    return response.data;
  },

  getOrder: async (id: string): Promise<Order> => {
    const response = await api.get(`/order/${id}`);
    return response.data;
  },

  updateOrderStatus: async (id: string, status: string) => {
    const response = await api.put(`/order/${id}/status`, { status });
    return response.data;
  },

  cancelOrder: async (id: string) => {
    const response = await api.put(`/order/${id}/cancel`);
    return response.data;
  },
};

// Payment API
export const paymentAPI = {
  createPayment: async (orderId: string) => {
    const response = await api.post('/payment/create', { orderId });
    return response.data;
  },

  verifyPayment: async (data: {
    orderId: string;
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => {
    const response = await api.post('/payment/verify', data);
    return response.data;
  },
};

export default api;
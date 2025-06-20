import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem } from '../types';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateCartItem: (id: string, quantity: number) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  clearCart: () => void;
  refreshCart: () => Promise<void>;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + item.totalPrice, 0);

  const refreshCart = async () => {
    if (!user) {
      setCartItems([]);
      return;
    }

    try {
      setLoading(true);
      const response = await cartAPI.getCart();
      setCartItems(response.cartItems);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: string, quantity: number = 1) => {
    try {
      await cartAPI.addToCart({ productId, quantity });
      await refreshCart();
      toast.success('Added to cart!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  const updateCartItem = async (id: string, quantity: number) => {
    try {
      await cartAPI.updateCartItem(id, quantity);
      await refreshCart();
      toast.success('Cart updated!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update cart');
    }
  };

  const removeFromCart = async (id: string) => {
    try {
      await cartAPI.removeFromCart(id);
      await refreshCart();
      toast.success('Removed from cart!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to remove from cart');
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  useEffect(() => {
    refreshCart();
  }, [user]);

  const value = {
    cartItems,
    cartCount,
    cartTotal,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart,
    loading,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
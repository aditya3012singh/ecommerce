import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { CartItem } from '../../types';
import { cartAPI } from '../../services/api';
import toast from 'react-hot-toast';

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartAPI.getCart();
      return response.cartItems;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch cart';
      return rejectWithValue(message);
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (data: { productId: string; quantity: number }, { rejectWithValue, dispatch }) => {
    try {
      await cartAPI.addToCart(data);
      await dispatch(fetchCart());
      toast.success('Added to cart!');
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to add to cart';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async (data: { id: string; quantity: number }, { rejectWithValue, dispatch }) => {
    try {
      await cartAPI.updateCartItem(data.id, data.quantity);
      await dispatch(fetchCart());
      toast.success('Cart updated!');
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update cart';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (id: string, { rejectWithValue, dispatch }) => {
    try {
      await cartAPI.removeFromCart(id);
      await dispatch(fetchCart());
      toast.success('Removed from cart!');
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to remove from cart';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update cart item
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCartItem.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Remove from cart
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeFromCart.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCart } = cartSlice.actions;

// Selectors
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartCount = (state: { cart: CartState }) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);
export const selectCartTotal = (state: { cart: CartState }) =>
  state.cart.items.reduce((total, item) => total + item.totalPrice, 0);

export default cartSlice.reducer;


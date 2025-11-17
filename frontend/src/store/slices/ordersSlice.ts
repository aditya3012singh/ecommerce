import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Order } from '../../types';
import { ordersAPI } from '../../services/api';
import toast from 'react-hot-toast';

interface OrdersState {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
};

// Async thunks
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await ordersAPI.createOrder();
      toast.success('Order placed successfully!');
      await dispatch(fetchOrders());
      return response.order;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create order';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await ordersAPI.getOrders();
      return response.orders;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch orders';
      return rejectWithValue(message);
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (id: string, { rejectWithValue }) => {
    try {
      const order = await ordersAPI.getOrder(id);
      return order;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch order';
      return rejectWithValue(message);
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async (data: { id: string; status: string }, { rejectWithValue, dispatch }) => {
    try {
      const response = await ordersAPI.updateOrderStatus(data.id, data.status);
      toast.success('Order status updated successfully!');
      await dispatch(fetchOrders());
      if (data.id === data.id) {
        await dispatch(fetchOrderById(data.id));
      }
      return response.order;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update order status';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async (id: string, { rejectWithValue, dispatch }) => {
    try {
      const response = await ordersAPI.cancelOrder(id);
      toast.success('Order cancelled successfully!');
      await dispatch(fetchOrders());
      return response.order;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to cancel order';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.currentOrder = action.payload;
        }
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        state.error = null;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch order by ID
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.error = null;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update order status
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateOrderStatus.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Cancel order
      .addCase(cancelOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(cancelOrder.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentOrder, clearError } = ordersSlice.actions;

// Selectors
export const selectOrders = (state: { orders: OrdersState }) => state.orders.orders;
export const selectCurrentOrder = (state: { orders: OrdersState }) => state.orders.currentOrder;
export const selectOrdersLoading = (state: { orders: OrdersState }) => state.orders.loading;

export default ordersSlice.reducer;


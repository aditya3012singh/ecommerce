import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { paymentAPI } from '../../services/api';
import toast from 'react-hot-toast';

interface PaymentState {
  razorpayOrderId: string | null;
  amount: number | null;
  currency: string | null;
  loading: boolean;
  error: string | null;
  paymentSuccess: boolean;
}

const initialState: PaymentState = {
  razorpayOrderId: null,
  amount: null,
  currency: null,
  loading: false,
  error: null,
  paymentSuccess: false,
};

// Async thunks
export const createPayment = createAsyncThunk(
  'payment/createPayment',
  async (orderId: string, { rejectWithValue }) => {
    try {
      const response = await paymentAPI.createPayment(orderId);
      return {
        orderId: response.orderId,
        amount: response.amount,
        currency: response.currency,
      };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create payment';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const verifyPayment = createAsyncThunk(
  'payment/verifyPayment',
  async (data: {
    orderId: string;
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }, { rejectWithValue }) => {
    try {
      const response = await paymentAPI.verifyPayment(data);
      toast.success('Payment verified & order confirmed!');
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Payment verification failed';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    clearPayment: (state) => {
      state.razorpayOrderId = null;
      state.amount = null;
      state.currency = null;
      state.error = null;
      state.paymentSuccess = false;
    },
    setPaymentSuccess: (state, action: PayloadAction<boolean>) => {
      state.paymentSuccess = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create payment
      .addCase(createPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.razorpayOrderId = action.payload.orderId;
        state.amount = action.payload.amount;
        state.currency = action.payload.currency;
        state.error = null;
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Verify payment
      .addCase(verifyPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state) => {
        state.loading = false;
        state.paymentSuccess = true;
        state.error = null;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.paymentSuccess = false;
      });
  },
});

export const { clearPayment, setPaymentSuccess, clearError } = paymentSlice.actions;

// Selectors
export const selectPaymentData = (state: { payment: PaymentState }) => ({
  razorpayOrderId: state.payment.razorpayOrderId,
  amount: state.payment.amount,
  currency: state.payment.currency,
});
export const selectPaymentLoading = (state: { payment: PaymentState }) => state.payment.loading;
export const selectPaymentSuccess = (state: { payment: PaymentState }) => state.payment.paymentSuccess;

export default paymentSlice.reducer;


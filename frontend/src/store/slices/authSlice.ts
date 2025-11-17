import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types';
import { authAPI } from '../../services/api';
import toast from 'react-hot-toast';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  loading: false,
  error: null,
};

// Load user from localStorage on init
const storedUser = localStorage.getItem('user');
if (storedUser) {
  try {
    initialState.user = JSON.parse(storedUser);
  } catch (e) {
    console.error('Failed to parse stored user:', e);
  }
}

// Async thunks
export const signin = createAsyncThunk(
  'auth/signin',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authAPI.signin(credentials);
      const token = response.token || response.jwt;
      
      if (!token) {
        throw new Error('No token received');
      }

      localStorage.setItem('token', token);
      
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }

      return { token, user: response.user };
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Login failed';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const signup = createAsyncThunk(
  'auth/signup',
  async (data: { email: string; name: string; password: string; role?: string }, { rejectWithValue }) => {
    try {
      const response = await authAPI.signup(data);
      const token = response.token;

      if (!token || !response.user) {
        throw new Error('Invalid response');
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(response.user));

      return { token, user: response.user };
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Signup failed';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      toast.success('Logged out successfully');
    },
    clearError: (state) => {
      state.error = null;
    },
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
  },
  extraReducers: (builder) => {
    builder
      // Signin
      .addCase(signin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user || null;
        state.token = action.payload.token;
        state.error = null;
        toast.success('Login successful!');
      })
      .addCase(signin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Signup
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user || null;
        state.token = action.payload.token;
        state.error = null;
        toast.success('Account created successfully!');
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError, setCredentials } = authSlice.actions;
export default authSlice.reducer;


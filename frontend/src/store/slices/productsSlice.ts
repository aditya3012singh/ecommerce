import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../types';
import { productsAPI } from '../../services/api';
import toast from 'react-hot-toast';

interface ProductsState {
  products: Product[];
  currentProduct: Product | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  currentProduct: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productsAPI.getAll();
      return response.products;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch products';
      return rejectWithValue(message);
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await productsAPI.getById(id);
      return response.product;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch product';
      return rejectWithValue(message);
    }
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue, dispatch }) => {
    try {
      const response = await productsAPI.create(data);
      toast.success('Product created successfully!');
      await dispatch(fetchProducts());
      return response.product;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create product';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async (data: { id: string; updates: Partial<Product> }, { rejectWithValue, dispatch }) => {
    try {
      const response = await productsAPI.update(data.id, data.updates);
      toast.success('Product updated successfully!');
      await dispatch(fetchProducts());
      if (data.id === data.updates.id) {
        await dispatch(fetchProductById(data.id));
      }
      return response.product;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update product';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id: string, { rejectWithValue, dispatch }) => {
    try {
      await productsAPI.delete(id);
      toast.success('Product deleted successfully!');
      await dispatch(fetchProducts());
      return id;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete product';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
        state.error = null;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create product
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProduct.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProduct.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProduct.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentProduct, clearError } = productsSlice.actions;

// Selectors
export const selectProducts = (state: { products: ProductsState }) => state.products.products;
export const selectCurrentProduct = (state: { products: ProductsState }) => state.products.currentProduct;
export const selectProductsLoading = (state: { products: ProductsState }) => state.products.loading;

export default productsSlice.reducer;


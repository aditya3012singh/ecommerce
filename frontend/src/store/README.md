# Redux Store Setup

This directory contains the Redux store configuration and all slices for the ecommerce application.

## Structure

- `store.ts` - Main store configuration
- `hooks.ts` - Typed hooks for useDispatch and useSelector
- `slices/` - Redux slices for different features
  - `authSlice.ts` - Authentication state management
  - `cartSlice.ts` - Shopping cart state management
  - `productsSlice.ts` - Products state management
  - `ordersSlice.ts` - Orders state management
  - `paymentSlice.ts` - Payment state management

## Usage

### Using Redux in Components

```typescript
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchProducts, selectProducts } from '../store/slices/productsSlice';
import { addToCart } from '../store/slices/cartSlice';

function MyComponent() {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProducts);
  const cartItems = useAppSelector(selectCartItems);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleAddToCart = (productId: string) => {
    dispatch(addToCart({ productId, quantity: 1 }));
  };

  return (
    // Your component JSX
  );
}
```

### Available Actions

#### Auth
- `signin(credentials)` - Sign in user
- `signup(data)` - Sign up new user
- `logout()` - Log out user

#### Cart
- `fetchCart()` - Fetch user's cart
- `addToCart({ productId, quantity })` - Add item to cart
- `updateCartItem({ id, quantity })` - Update cart item quantity
- `removeFromCart(id)` - Remove item from cart
- `clearCart()` - Clear cart

#### Products
- `fetchProducts()` - Fetch all products
- `fetchProductById(id)` - Fetch single product
- `createProduct(data)` - Create new product (admin)
- `updateProduct({ id, updates })` - Update product (admin)
- `deleteProduct(id)` - Delete product (admin)

#### Orders
- `createOrder()` - Create order from cart
- `fetchOrders()` - Fetch user's orders
- `fetchOrderById(id)` - Fetch single order
- `updateOrderStatus({ id, status })` - Update order status (admin)
- `cancelOrder(id)` - Cancel order

#### Payment
- `createPayment(orderId)` - Create Razorpay payment order
- `verifyPayment(data)` - Verify payment signature

### Selectors

Use selectors to access state:

```typescript
const user = useAppSelector((state) => state.auth.user);
const cartCount = useAppSelector(selectCartCount);
const cartTotal = useAppSelector(selectCartTotal);
const products = useAppSelector(selectProducts);
```


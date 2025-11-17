import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Package, Calendar, DollarSign, Truck, CreditCard } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchOrderById,
  clearCurrentOrder,
  selectCurrentOrder,
  selectOrdersLoading,
} from '../store/slices/ordersSlice';

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const order = useAppSelector(selectCurrentOrder);
  const loading = useAppSelector(selectOrdersLoading);
  const { user } = useAppSelector((state) => state.auth);
  const error = useAppSelector((state) => state.orders.error);

  useEffect(() => {
    if (user && id) {
      dispatch(fetchOrderById(id));
    }
    return () => {
      dispatch(clearCurrentOrder());
    };
  }, [dispatch, id, user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Please log in to view order details</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Sign Up
          </button>
        </div>
      </div>
    );
  }

  if (loading || !order) {
    if (error) {
      return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Order not found</h2>
          <p className="text-gray-600">We couldn't find the requested order.</p>
          <button
            onClick={() => navigate('/orders')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Back to Orders
          </button>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const statusColorMap: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    PAID: 'bg-blue-100 text-blue-800',
    SHIPPED: 'bg-purple-100 text-purple-800',
    DELIVERED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <button
          onClick={() => navigate('/orders')}
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Orders</span>
        </button>

        <div className="bg-white rounded-xl shadow-md p-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <h1 className="text-2xl font-bold text-gray-900">#{order.id}</h1>
            </div>
            <span
              className={`px-4 py-1 rounded-full text-sm font-semibold ${
                statusColorMap[order.status] || 'bg-gray-100 text-gray-800'
              }`}
            >
              {order.status}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <Calendar className="h-10 w-10 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Order Date</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <DollarSign className="h-10 w-10 text-green-600" />
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-lg font-semibold text-gray-900">
                  ${order.total.toFixed(2)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Truck className="h-10 w-10 text-purple-600" />
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="text-lg font-semibold text-gray-900">{order.status}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
              <Package className="h-5 w-5 text-blue-600" />
              <span>Items</span>
            </h2>
            <p className="text-gray-600 text-sm">
              {order.items.length} item{order.items.length !== 1 && 's'}
            </p>
          </div>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div
                key={`${item.product.id}-${index}`}
                className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 last:border-none"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.title}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div>
                    <Link
                      to={`/products/${item.product.id}`}
                      className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                    >
                      {item.product.title}
                    </Link>
                    <p className="text-gray-600">
                      ${item.price.toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                </div>
                <p className="text-lg font-semibold text-gray-900 mt-4 sm:mt-0">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
            <CreditCard className="h-5 w-5 text-blue-600" />
            <span>Summary</span>
          </h2>
          <div className="space-y-2 text-gray-700">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-green-600">Free</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (included)</span>
              <span>${(order.total * 0.08).toFixed(2)}</span>
            </div>
            <div className="border-t pt-4 flex justify-between text-lg font-semibold text-gray-900">
              <span>Grand Total</span>
              <span>${(order.total * 1.08).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;


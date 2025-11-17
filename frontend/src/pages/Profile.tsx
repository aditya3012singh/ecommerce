import React, { useEffect, useState } from 'react';
import { Mail, ShieldCheck, Calendar, Package, ShoppingBag } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { authAPI } from '../services/api';
import { fetchOrders, selectOrders, selectOrdersLoading } from '../store/slices/ordersSlice';

const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const orders = useAppSelector(selectOrders);
  const ordersLoading = useAppSelector(selectOrdersLoading);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState(user || null);

  useEffect(() => {
    if (!user) return;

    let isMounted = true;

    const loadProfile = async () => {
      setProfileLoading(true);
      setProfileError(null);
      try {
        const data = await authAPI.getUser(user.id);
        if (isMounted) {
          setProfileData(data);
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
        if (isMounted) {
          setProfileError('Unable to load profile information.');
        }
      } finally {
        if (isMounted) {
          setProfileLoading(false);
        }
      }
    };

    loadProfile();
    dispatch(fetchOrders());

    return () => {
      isMounted = false;
    };
  }, [dispatch, user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Please log in to view your profile</h2>
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

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (profileError || !profileData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Something went wrong</h2>
        <p className="text-gray-600">{profileError || 'Unable to load profile data.'}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const orderCount = orders.length;
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
  const lastOrderDate =
    orders.length > 0
      ? new Date(
          [...orders].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )[0].createdAt
        ).toLocaleDateString()
      : 'N/A';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="bg-white rounded-xl shadow-md p-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase text-gray-500 tracking-wider mb-2">Account</p>
            <h1 className="text-3xl font-bold text-gray-900">{profileData.name}</h1>
            <p className="text-gray-600 mt-2 flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>{profileData.email}</span>
            </p>
            <p className="text-gray-600 mt-1 flex items-center space-x-2">
              <ShieldCheck className="h-4 w-4" />
              <span>{profileData.role}</span>
            </p>
            {profileData.createdAt && (
              <p className="text-gray-600 mt-1 flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>
                  Member since {new Date(profileData.createdAt).toLocaleDateString()}
                </span>
              </p>
            )}
          </div>
          <div className="mt-6 md:mt-0">
            <Link
              to="/orders"
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <Package className="h-4 w-4" />
              <span>View Orders</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow p-6 space-y-2">
            <div className="flex items-center space-x-3">
              <ShoppingBag className="h-10 w-10 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{ordersLoading ? '...' : orderCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6 space-y-2">
            <div className="flex items-center space-x-3">
              <Package className="h-10 w-10 text-green-600" />
              <div>
                <p className="text-sm text-gray-500">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">
                  {ordersLoading ? '...' : `$${totalSpent.toFixed(2)}`}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6 space-y-2">
            <div className="flex items-center space-x-3">
              <Calendar className="h-10 w-10 text-purple-600" />
              <div>
                <p className="text-sm text-gray-500">Last Order</p>
                <p className="text-lg font-semibold text-gray-900">
                  {ordersLoading ? '...' : lastOrderDate}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
              <p className="text-gray-600">Your latest purchases</p>
            </div>
            <Link
              to="/orders"
              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              View all
            </Link>
          </div>
          {ordersLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              You haven't placed any orders yet.
            </div>
          ) : (
            <div className="space-y-4">
              {orders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="p-4 border border-gray-100 rounded-lg hover:border-blue-200 transition-colors flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm text-gray-500">
                      Order #{order.id.slice(-8)} •{' '}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      ${order.total.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                      {order.status}
                    </span>
                    <button
                      onClick={() => navigate(`/orders/${order.id}`)}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;


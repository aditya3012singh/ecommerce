import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '../../types';
import { useAppDispatch } from '../../store/hooks';
import { updateCartItem, removeFromCart } from '../../store/slices/cartSlice';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const dispatch = useAppDispatch();

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    await dispatch(updateCartItem({ id: item.id, quantity: newQuantity }));
  };

  const handleRemove = async () => {
    await dispatch(removeFromCart(item.id));
  };

  return (
    <div className="flex items-center space-x-4 bg-white p-6 rounded-lg shadow-md">
      <img
        src={item.product.imageUrl}
        alt={item.product.title}
        className="w-20 h-20 object-cover rounded-lg"
      />
      
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900">{item.product.title}</h3>
        <p className="text-gray-600">${item.product.price.toFixed(2)} each</p>
      </div>
      
      <div className="flex items-center space-x-3">
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          className="p-1 rounded-md hover:bg-gray-100 transition-colors"
        >
          <Minus className="h-4 w-4" />
        </button>
        
        <span className="text-lg font-medium w-8 text-center">{item.quantity}</span>
        
        <button
          onClick={() => handleQuantityChange(item.quantity + 1)}
          className="p-1 rounded-md hover:bg-gray-100 transition-colors"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      
      <div className="text-right">
        <p className="text-lg font-semibold text-gray-900">
          ${item.totalPrice.toFixed(2)}
        </p>
      </div>
      
      <button
        onClick={handleRemove}
        className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
      >
        <Trash2 className="h-5 w-5" />
      </button>
    </div>
  );
};

export default CartItem;
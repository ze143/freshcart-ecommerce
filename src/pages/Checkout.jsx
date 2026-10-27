import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE = 'https://ecommerce.routemisr.com/api/v1';

export default function Checkout() {
  const { cart, getLoggedUserCart } = useCart();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    details: '',
    phone: '',
    city: '',
  });

  const [loading, setLoading] = useState(false);

  const cartProducts = cart?.products || [];
  const totalOrderPrice = cart?.totalCartPrice || 0;

  const handleInputChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handleCashOrder = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('userToken');

    if (!token) {
      toast.error('Please login first to complete your order');
      navigate('/login');
      return;
    }

    if (cartProducts.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setLoading(true);
    try {
      // استخدام الـ cartId المخزن أو جلبه مباشرة إن لم يكن موجوداً
      let cartId = cart?.cartId;
      if (!cartId) {
        const cartRes = await axios.get(`${API_BASE}/cart`, { headers: { token } });
        cartId = cartRes.data.data?._id;
      }

      if (!cartId) {
        toast.error('Cart ID not found. Please try refreshing your cart.');
        setLoading(false);
        return;
      }

      await axios.post(
        `${API_BASE}/orders/${cartId}`,
        { shippingAddress },
        { headers: { token } }
      );

      toast.success('Order placed successfully!', { position: 'bottom-right' });
      await getLoggedUserCart(token); // تحديث وتصفير السلة بعد نجاح الطلب
      navigate('/allorders');
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Checkout Shipping Details</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <form onSubmit={handleCashOrder} className="md:col-span-2 space-y-4 bg-white p-6 rounded-xl border shadow-sm">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
            <input
              type="text"
              name="details"
              value={shippingAddress.details}
              onChange={handleInputChange}
              required
              placeholder="e.g., 123 Main St"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={shippingAddress.phone}
              onChange={handleInputChange}
              required
              placeholder="e.g., 01012345678"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              type="text"
              name="city"
              value={shippingAddress.city}
              onChange={handleInputChange}
              required
              placeholder="e.g., Cairo"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 transition mt-4 disabled:opacity-50"
          >
            {loading ? 'Processing Order...' : 'Pay Cash on Delivery'}
          </button>
        </form>

        <div className="bg-white p-6 rounded-xl border shadow-sm h-fit">
          <h2 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">Order Summary</h2>
          <div className="flex justify-between mb-2 text-sm text-gray-600">
            <span>Items Count</span>
            <span className="font-semibold">{cartProducts.length}</span>
          </div>
          <div className="flex justify-between mb-4 text-lg font-bold text-gray-800">
            <span>Total</span>
            <span className="text-emerald-600">{totalOrderPrice} EGP</span>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function Checkout() {
  const { items, total, dispatch } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ city: '', street: '', phone: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCOD = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error('Please login first');
      navigate('/login');
      return;
    }
    if (items.length === 0) {
      toast.error('Cart is empty');
      return;
    }
    setLoading(true);
    try {
      const orderItems = items.map((i) => ({
        product: i._id,
        quantity: i.quantity,
        price: i.priceAfterDiscount || i.price,
      }));
      // استدعاء API الطلبات (COD)
      const { data } = await axios.post(
        'https://ecommerce.routemisr.com/api/v1/orders',
        {
          shippingAddress: { details: form.street, city: form.city, phone: form.phone },
          paymentMethod: 'cash',
          cartItems: orderItems,
        },
        { headers: { token } }
      );
      if (data.status === 'success') {
        toast.success('Order placed successfully!');
        dispatch({ type: 'CLEAR_CART' });
        navigate('/');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <form onSubmit={handleCOD} className="space-y-4 bg-white p-6 rounded-lg shadow-sm border">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
          <input
            name="city" required value={form.city} onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
          <input
            name="street" required value={form.street} onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            name="phone" required value={form.phone} onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div className="border-t pt-4">
          <p className="text-lg font-bold flex justify-between">
            <span>Total</span>
            <span className="text-primary">{total.toFixed(2)} EGP</span>
          </p>
        </div>
        <button
          type="submit" disabled={loading}
          className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 font-medium disabled:opacity-50"
        >
          {loading ? 'Placing Order...' : 'Place Order (Cash on Delivery)'}
        </button>
      </form>
    </div>
  );
}
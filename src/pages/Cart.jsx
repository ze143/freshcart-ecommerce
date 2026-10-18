import { Link } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { items, total, dispatch } = useCart();
  const { token } = useAuth();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your cart is empty</h2>
        <Link to="/products" className="inline-block bg-primary text-white px-6 py-3 rounded-full hover:bg-primary/90">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* قائمة المنتجات */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item._id} className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 hover:shadow-sm transition-shadow">
              <img src={item.imageCover} alt={item.title} className="w-20 h-20 object-contain rounded-lg bg-gray-50" />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-800 line-clamp-1">{item.title}</h3>
                <p className="text-primary font-bold mt-1">{item.priceAfterDiscount || item.price} EGP</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => dispatch({ type: 'UPDATE_QTY', id: item._id, quantity: item.quantity - 1 })}
                  className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40"
                  disabled={item.quantity <= 1}
                >
                  <FaMinus size={12} />
                </button>
                <span className="w-8 text-center font-medium">{item.quantity}</span>
                <button
                  onClick={() => dispatch({ type: 'UPDATE_QTY', id: item._id, quantity: item.quantity + 1 })}
                  className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <FaPlus size={12} />
                </button>
              </div>
              <button
                onClick={() => dispatch({ type: 'REMOVE_ITEM', id: item._id })}
                className="text-red-500 hover:text-red-700 p-2"
                aria-label="Remove item"
              >
                <FaTrash size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* ملخص الطلب */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-fit sticky top-24">
          <h2 className="text-lg font-bold mb-4 text-gray-800">Order Summary</h2>
          <div className="flex justify-between mb-2 text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">{total.toFixed(2)} EGP</span>
          </div>
          <div className="flex justify-between mb-4 text-sm">
            <span className="text-gray-600">Shipping</span>
            <span className="font-medium text-green-600">Free</span>
          </div>
          <hr className="mb-4" />
          <div className="flex justify-between mb-6">
            <span className="font-bold text-gray-800">Total</span>
            <span className="font-bold text-primary text-xl">{total.toFixed(2)} EGP</span>
          </div>
          <Link
            to="/checkout"
            className="block w-full text-center bg-primary text-white py-3 rounded-full hover:bg-primary/90 font-medium"
          >
            Proceed to Checkout
          </Link>
          {!token && (
            <p className="text-xs text-gray-500 text-center mt-3">
              <Link to="/login" className="text-primary hover:underline">Login</Link> for faster checkout
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
import { Link } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { cart, updateCartQuantity, removeFromCart } = useCart();
  const { token } = useAuth();

  const cartProducts = cart?.products || [];
  const total = cart?.totalCartPrice || 0;

  if (!cartProducts || cartProducts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your cart is empty</h2>
        <Link to="/products" className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-full hover:bg-emerald-700 transition">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Products List */}
        <div className="lg:col-span-2 space-y-4">
          {cartProducts.map((item) => {
            const product = item.product || {};
            const productId = product._id || product.id;
            const quantity = item.count || 1;
            const price = item.price || product.priceAfterDiscount || product.price || 0;

            return (
              <div key={productId} className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 hover:shadow-sm transition-shadow">
                <img 
                  src={product.imageCover || product.image || 'https://via.placeholder.com/80'} 
                  alt={product.title} 
                  className="w-20 h-20 object-contain rounded-lg bg-gray-50 flex-shrink-0" 
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-800 line-clamp-1">{product.title || 'Product Item'}</h3>
                  <p className="text-emerald-600 font-bold mt-1">{price} EGP</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateCartQuantity(productId, quantity - 1)}
                    className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40"
                    disabled={quantity <= 1}
                  >
                    <FaMinus size={12} />
                  </button>
                  <span className="w-8 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => updateCartQuantity(productId, quantity + 1)}
                    className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <FaPlus size={12} />
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(productId)}
                  className="text-red-500 hover:text-red-700 p-2 transition"
                  aria-label="Remove item"
                >
                  <FaTrash size={16} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-fit sticky top-24">
          <h2 className="text-lg font-bold mb-4 text-gray-800">Order Summary</h2>
          <div className="flex justify-between mb-2 text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">{typeof total === 'number' ? total.toFixed(2) : total} EGP</span>
          </div>
          <div className="flex justify-between mb-4 text-sm">
            <span className="text-gray-600">Shipping</span>
            <span className="font-medium text-green-600">Free</span>
          </div>
          <hr className="mb-4" />
          <div className="flex justify-between mb-6">
            <span className="font-bold text-gray-800">Total</span>
            <span className="font-bold text-emerald-600 text-xl">{typeof total === 'number' ? total.toFixed(2) : total} EGP</span>
          </div>
          <Link
            to="/checkout"
            className="block w-full text-center bg-emerald-600 text-white py-3 rounded-full hover:bg-emerald-700 font-medium transition"
          >
            Proceed to Checkout
          </Link>
          {!token && (
            <p className="text-xs text-gray-500 text-center mt-3">
              <Link to="/login" className="text-emerald-600 hover:underline">Login</Link> for faster checkout & local cart sync
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
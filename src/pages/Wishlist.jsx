import { Link } from 'react-router-dom';
import { FaHeart, FaShoppingCart, FaTrash } from 'react-icons/fa';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

export default function Wishlist() {
  const wishlistContext = useWishlist() || {};
  const { wishlist = [], removeFromWishlist = () => {} } = wishlistContext;
  
  const cartContext = useCart() || {};
  const { addToCart = () => {} } = cartContext;

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="bg-red-50 w-20 h-20 mx-auto rounded-full flex items-center justify-center text-red-500 mb-4">
          <FaHeart size={32} />
        </div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">Your Wishlist is Empty</h2>
        <p className="text-gray-500 mb-6">You haven't added any products to your wishlist yet.</p>
        <Link to="/products" className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-full hover:bg-emerald-700 transition font-medium">
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">My Wishlist ({wishlist.length})</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlist.map((product) => {
          const productId = product._id || product.id;
          const price = product.priceAfterDiscount || product.price;

          return (
            <div key={productId} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex flex-col justify-between group">
              <div>
                <Link to={`/product-details/${productId}`}>
                  <img
                    src={product.imageCover || product.image}
                    alt={product.title}
                    className="w-full h-48 object-contain mb-3 rounded-md bg-gray-50 group-hover:scale-105 transition-transform"
                  />
                </Link>
                <span className="text-xs text-emerald-600 font-semibold uppercase">{product.category?.name}</span>
                <Link to={`/product-details/${productId}`}>
                  <h3 className="font-medium text-gray-800 line-clamp-1 mt-1 hover:text-emerald-600 transition">
                    {product.title}
                  </h3>
                </Link>
                <p className="text-emerald-600 font-bold mt-2">{price} EGP</p>
              </div>

              <div className="flex items-center gap-2 mt-4 pt-3 border-t">
                <button
                  onClick={() => addToCart(product)}
                  className="flex-1 bg-emerald-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition flex items-center justify-center gap-2"
                >
                  <FaShoppingCart size={14} /> Add to Cart
                </button>
                <button
                  onClick={() => removeFromWishlist(productId)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                  aria-label="Remove"
                >
                  <FaTrash size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
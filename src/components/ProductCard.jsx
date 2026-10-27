import { Link } from 'react-router-dom';
import { FaStar, FaShoppingCart, FaHeart, FaRegHeart } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();
  
  const productId = product._id || product.id;

  // التحقق الحقيقي مما إذا كان المنتج موجوداً في المفضلة (محلي أو سيرفر)
  const isWishlisted = wishlist?.some(
    (item) => (item._id || item.id || item) === productId
  );

  const discount = product.priceAfterDiscount
    ? Math.round(((product.price - product.priceAfterDiscount) / product.price) * 100)
    : 0;
  const finalPrice = product.priceAfterDiscount || product.price;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (addToCart) {
      await addToCart(product._id);
    } else {
      toast.error('Unable to add to cart at the moment');
    }
  };

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    // تمرير المنتج كاملاً للكونتكست لضمان الحفظ الفوري
    await toggleWishlist(product);
  };

  return (
    <div className="group relative bg-white rounded-xl border border-gray-100 hover:border-emerald-500/30 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
      {discount > 0 && (
        <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md z-10">
          -{discount}%
        </span>
      )}

      <button
        onClick={handleToggleWishlist}
        aria-label="Toggle wishlist"
        className="absolute top-3 right-3 z-10 bg-white/90 hover:bg-white p-2 rounded-full shadow-sm transition-colors"
      >
        {isWishlisted ? (
          <FaHeart className="text-red-500" size={14} />
        ) : (
          <FaRegHeart className="text-gray-400 hover:text-red-500" size={14} />
        )}
      </button>

      <Link to={`/product-details/${productId}`} className="block">
        <div className="relative h-52 w-full overflow-hidden bg-gray-50">
          <img
            src={product.imageCover}
            alt={product.title}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-grow">
        <p className="text-xs text-gray-500 mb-1">{product.category?.name}</p>

        <Link to={`/product-details/${productId}`}>
          <h3 className="text-sm font-medium text-gray-800 line-clamp-2 hover:text-emerald-600 transition-colors min-h-[2.5rem]">
            {product.title}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mt-2">
          <FaStar className="text-yellow-400 text-xs" />
          <span className="text-xs text-gray-600">
            {product.ratingsAverage} ({product.ratingsQuantity})
          </span>
        </div>

        <div className="flex items-center justify-between mt-auto pt-3">
          <div>
            {product.priceAfterDiscount ? (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-emerald-600 font-bold text-lg">{finalPrice} EGP</span>
                <span className="text-gray-400 text-sm line-through">{product.price} EGP</span>
              </div>
            ) : (
              <span className="text-emerald-600 font-bold text-lg">{finalPrice} EGP</span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className="bg-emerald-50 text-emerald-600 p-2 rounded-full hover:bg-emerald-600 hover:text-white transition-colors duration-200"
            aria-label="Add to cart"
          >
            <FaShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
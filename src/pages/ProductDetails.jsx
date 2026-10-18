import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { FaStar, FaShoppingCart, FaHeart, FaRegHeart } from 'react-icons/fa';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import Loading from '../components/Loading';

const API_BASE = 'https://ecommerce.routemisr.com/api/v1';

const fetchProduct = async (id) => {
  const { data } = await axios.get(`${API_BASE}/products/${id}`);
  return data.data;
};

export default function ProductDetails() {
  const { id } = useParams();
  const { dispatch } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const { data: product, isLoading, isError, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProduct(id),
    enabled: !!id,
  });

  if (isLoading) return <Loading />;
  if (isError) return <div className="text-center py-20 text-red-500">Error: {error.message}</div>;
  if (!product) return <div className="text-center py-20 text-gray-500">Product not found.</div>;

  const finalPrice = product.priceAfterDiscount || product.price;
  const discount = product.priceAfterDiscount
    ? Math.round(((product.price - product.priceAfterDiscount) / product.price) * 100)
    : 0;

  const handleAddToCart = () => {
    dispatch({ type: 'ADD_ITEM', item: product });
    toast.success('Added to cart', { icon: '🛒' });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* مسار التنقل */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/products" className="hover:text-primary">Products</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-6 rounded-lg shadow-sm border">
        {/* صورة المنتج */}
        <div className="relative">
          {discount > 0 && (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded z-10">
              -{discount}%
            </span>
          )}
          <img
            src={product.imageCover}
            alt={product.title}
            className="w-full h-96 object-contain rounded-lg bg-gray-50"
          />
        </div>

        {/* معلومات المنتج */}
        <div className="flex flex-col">
          <p className="text-sm text-gray-500 mb-1">{product.category?.name}</p>
          <h1 className="text-2xl font-bold text-gray-800 mb-3">{product.title}</h1>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              <FaStar className="text-yellow-400" />
              <span className="text-sm font-medium">{product.ratingsAverage}</span>
            </div>
            <span className="text-sm text-gray-500">({product.ratingsQuantity} reviews)</span>
          </div>

          <div className="mb-6">
            {product.priceAfterDiscount ? (
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-primary">{finalPrice} EGP</span>
                <span className="text-xl text-gray-400 line-through">{product.price} EGP</span>
              </div>
            ) : (
              <span className="text-3xl font-bold text-primary">{product.price} EGP</span>
            )}
          </div>

          <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

          <div className="flex items-center gap-4 mt-auto">
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-lg hover:bg-primary/90 font-medium"
            >
              <FaShoppingCart /> Add to Cart
            </button>
            <button
              onClick={() => { setIsWishlisted(!isWishlisted); toast.success(isWishlisted ? 'Removed' : 'Added to wishlist'); }}
              className="p-3 border rounded-lg hover:bg-gray-50"
            >
              {isWishlisted ? <FaHeart className="text-red-500" /> : <FaRegHeart className="text-gray-400" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
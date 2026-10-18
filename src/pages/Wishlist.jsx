import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaTrash, FaShoppingCart } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Loading from '../components/Loading';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const API_BASE = 'https://ecommerce.routemisr.com/api/v1';

export default function Wishlist() {
  const { token } = useAuth();
  const { dispatch } = useCart();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE}/wishlist`, {
        headers: { token },
      });
      return data.data;
    },
    enabled: !!token,
  });

  const removeMutation = useMutation({
    mutationFn: async (productId) => {
      await axios.delete(`${API_BASE}/wishlist/${productId}`, {
        headers: { token },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success('Removed from wishlist');
    },
    onError: () => toast.error('Failed to remove item'),
  });

  if (!token) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Please login to view your wishlist</h2>
        <Link to="/login" className="inline-block bg-primary text-white px-6 py-3 rounded-full hover:bg-primary/90">
          Login
        </Link>
      </div>
    );
  }

  if (isLoading) return <Loading />;
  if (isError) return <div className="text-center py-20 text-red-500">Error: {error.message}</div>;

  const items = data || [];

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your wishlist is empty</h2>
        <Link to="/products" className="inline-block bg-primary text-white px-6 py-3 rounded-full hover:bg-primary/90">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">My Wishlist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((product) => (
          <div key={product._id} className="bg-white rounded-xl border border-gray-100 hover:shadow-lg transition-all p-4 flex flex-col">
            <Link to={`/product/${product._id}`}>
              <div className="h-48 bg-gray-50 rounded-lg overflow-hidden mb-3">
                <img src={product.imageCover} alt={product.title} className="w-full h-full object-contain" loading="lazy" />
              </div>
            </Link>
            <Link to={`/product/${product._id}`}>
              <h3 className="text-sm font-medium text-gray-800 line-clamp-2 hover:text-primary min-h-[2.5rem]">{product.title}</h3>
            </Link>
            <p className="text-primary font-bold mt-2">{product.priceAfterDiscount || product.price} EGP</p>

            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={() => dispatch({ type: 'ADD_ITEM', item: product })}
                className="flex-1 flex items-center justify-center gap-1 bg-primary text-white py-2 rounded-lg hover:bg-primary/90 text-sm"
              >
                <FaShoppingCart size={14} /> Add
              </button>
              <button
                onClick={() => removeMutation.mutate(product._id)}
                disabled={removeMutation.isPending}
                className="p-2 text-red-500 hover:text-red-700 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50"
                aria-label="Remove from wishlist"
              >
                <FaTrash size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
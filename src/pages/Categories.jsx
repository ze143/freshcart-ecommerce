import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Loading from '../components/Loading';

const API_BASE = 'https://ecommerce.routemisr.com/api/v1';

export default function Categories() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['allCategories'],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE}/categories`);
      return data.data;
    },
    staleTime: 1000 * 60 * 10,
  });

  if (isLoading) return <Loading />;
  if (isError) return <div className="text-center py-20 text-red-500">Error: {error.message}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">All Categories</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {data?.map((cat) => (
          <Link
            key={cat._id}
            to={`/products?category=${cat._id}`}
            className="group bg-white rounded-xl border border-gray-100 hover:border-primary/30 hover:shadow-lg transition-all duration-300 p-6 text-center flex flex-col items-center"
          >
            <div className="w-24 h-24 mb-4 rounded-full bg-gray-50 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-20 h-20 object-contain"
                loading="lazy"
              />
            </div>
            <p className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">
              {cat.name}
            </p>
          </Link>
        ))}
      </div>

      {data?.length === 0 && (
        <p className="text-center text-gray-500 py-20">No categories found.</p>
      )}
    </div>
  );
}
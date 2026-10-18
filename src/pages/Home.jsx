import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';

const API_BASE = 'https://ecommerce.routemisr.com/api/v1';

const fetchFeatured = async () => {
  const { data } = await axios.get(`${API_BASE}/products`, { params: { limit: 10 } });
  return data.data;
};

export default function Home() {
  const { data: products, isLoading } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: fetchFeatured,
  });

  return (
    <div>
      {/* Hero Banners */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Deal of the Day */}
          <div className="relative bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8 overflow-hidden min-h-[220px] flex flex-col justify-center">
            <span className="text-sm font-semibold text-orange-600 mb-2">🔥 Deal of the Day</span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Fresh Organic Fruits</h2>
            <p className="text-gray-600 mb-4">Get up to 40% off on selected organic fruits</p>
            <Link
              to="/products"
              className="inline-block bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 w-fit text-sm font-medium"
            >
              Shop Now
            </Link>
            <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 text-xs font-bold text-orange-600 shadow">
              40% OFF
            </div>
            <p className="text-xs text-gray-500 mt-3">Use code: <span className="font-mono font-bold">ORGANIC40</span></p>
          </div>

          {/* New Arrivals */}
          <div className="relative bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 overflow-hidden min-h-[220px] flex flex-col justify-center">
            <span className="text-sm font-semibold text-green-600 mb-2">✨ New Arrivals</span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Exotic Vegetables</h2>
            <p className="text-gray-600 mb-4">Discover our latest collection of premium vegetables</p>
            <Link
              to="/products"
              className="inline-block bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 w-fit text-sm font-medium"
            >
              Explore Now
            </Link>
            <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 text-xs font-bold text-green-600 shadow">
              25% OFF
            </div>
            <p className="text-xs text-gray-500 mt-3">Use code: <span className="font-mono font-bold">FRESH25</span></p>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Featured Products</h2>
          <Link to="/products" className="text-primary text-sm font-medium hover:underline">
            View All →
          </Link>
        </div>

        {isLoading ? (
          <Loading />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {products?.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Newsletter */}
      <section className="bg-gray-50 py-12 mt-8">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <span className="text-sm font-semibold text-primary">50,000+ subscribers</span>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mt-2 mb-2">
            Get the Freshest Updates Delivered Free
          </h2>
          <p className="text-gray-600 mb-6">
            Weekly recipes, seasonal offers & exclusive member perks.
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            />
            <button className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 font-medium text-sm">
              Subscribe
            </button>
          </form>
          <div className="flex flex-wrap justify-center gap-4 mt-4 text-xs text-gray-500">
            <span>✓ Fresh Picks Weekly</span>
            <span>✓ Free Delivery Codes</span>
            <span>✓ Members-Only Deals</span>
          </div>
          <p className="text-xs text-gray-400 mt-4">✨ Unsubscribe anytime. No spam, ever.</p>
        </div>
      </section>
    </div>
  );
}
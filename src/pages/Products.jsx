import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';

const API_BASE = 'https://ecommerce.routemisr.com/api/v1';

// جلب الفئات
const fetchCategories = async () => {
  const { data } = await axios.get(`${API_BASE}/categories`);
  return data.data;
};

// جلب العلامات التجارية
const fetchBrands = async () => {
  const { data } = await axios.get(`${API_BASE}/brands`);
  return data.data;
};

// جلب المنتجات (مع دعم التصفية)
const fetchProducts = async ({ category, brand, page = 1 }) => {
  const params = { page, limit: 20 };
  if (category) params.category = category;
  if (brand) params.brand = brand;
  const { data } = await axios.get(`${API_BASE}/products`, { params });
  return data;
};

export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [page, setPage] = useState(1);

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const { data: brands } = useQuery({
    queryKey: ['brands'],
    queryFn: fetchBrands,
  });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['products', selectedCategory, selectedBrand, page],
    queryFn: () => fetchProducts({ category: selectedCategory, brand: selectedBrand, page }),
    keepPreviousData: true,
  });

  const products = data?.data || [];
  const totalPages = data?.metadata?.numberOfPages || 1;

  if (isLoading) return <Loading />;
  if (isError) return <div className="text-center py-20 text-red-500">Error: {error.message}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">All Products</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* الشريط الجانبي للتصفية */}
        <aside className="lg:w-64 flex-shrink-0 space-y-6">
          {/* تصفية الفئات */}
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="font-semibold mb-3 text-gray-700">Categories</h3>
            <ul className="space-y-2 max-h-60 overflow-y-auto">
              <li>
                <button
                  onClick={() => { setSelectedCategory(''); setPage(1); }}
                  className={`text-sm ${!selectedCategory ? 'text-primary font-medium' : 'text-gray-600 hover:text-primary'}`}
                >
                  All Categories
                </button>
              </li>
              {categories?.map((cat) => (
                <li key={cat._id}>
                  <button
                    onClick={() => { setSelectedCategory(cat._id); setPage(1); }}
                    className={`text-sm ${selectedCategory === cat._id ? 'text-primary font-medium' : 'text-gray-600 hover:text-primary'}`}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* تصفية العلامات التجارية */}
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="font-semibold mb-3 text-gray-700">Brands</h3>
            <ul className="space-y-2 max-h-60 overflow-y-auto">
              <li>
                <button
                  onClick={() => { setSelectedBrand(''); setPage(1); }}
                  className={`text-sm ${!selectedBrand ? 'text-primary font-medium' : 'text-gray-600 hover:text-primary'}`}
                >
                  All Brands
                </button>
              </li>
              {brands?.map((b) => (
                <li key={b._id}>
                  <button
                    onClick={() => { setSelectedBrand(b._id); setPage(1); }}
                    className={`text-sm ${selectedBrand === b._id ? 'text-primary font-medium' : 'text-gray-600 hover:text-primary'}`}
                  >
                    {b.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* شبكة المنتجات */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {products.length === 0 && (
            <p className="text-center text-gray-500 py-20">No products found.</p>
          )}

          {/* الترقيم */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-4 py-2 border rounded-lg disabled:opacity-40 hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 border rounded-lg disabled:opacity-40 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
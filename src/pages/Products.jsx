import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTitle, setFilterTitle] = useState('');
  
  const [searchParams] = useSearchParams();
  const brandId = searchParams.get('brand');
  const categoryId = searchParams.get('category');
  const keyword = searchParams.get('keyword');

  async function getProducts() {
    setLoading(true);
    try {
      const params = {};
      if (brandId) params.brand = brandId;
      if (categoryId) params.category = categoryId;
      if (keyword) params.keyword = keyword;

      const { data } = await api.get('/products', { params });
      setProducts(data.data);

      if (brandId) {
        fetchBrandName(brandId);
      } else if (categoryId) {
        fetchCategoryName(categoryId);
      } else if (keyword) {
        setFilterTitle(`Search results for: "${keyword}"`);
      } else {
        setFilterTitle('All Products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchBrandName(id) {
    try {
      const { data } = await api.get(`/brands/${id}`);
      setFilterTitle(`Brand Products: ${data.data.name}`);
    } catch (error) {
      setFilterTitle('Brand Products');
    }
  }

  async function fetchCategoryName(id) {
    try {
      const { data } = await api.get(`/categories/${id}`);
      setFilterTitle(`Category: ${data.data.name}`);
    } catch (error) {
      setFilterTitle('Category Products');
    }
  }

  useEffect(() => {
    getProducts();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <div className="flex flex-col items-center gap-3">
          <i className="fa-solid fa-spinner fa-spin text-4xl text-emerald-600"></i>
          <p className="text-gray-600 font-medium">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header & Filter Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{filterTitle}</h1>
          <p className="text-sm text-gray-500 mt-1">
            Available products: <span className="font-semibold text-emerald-600">{products.length}</span>
          </p>
        </div>

        {(brandId || categoryId || keyword) && (
          <Link
            to="/products"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md transition text-sm font-medium w-fit"
          >
            <i className="fa-solid fa-xmark"></i>
            Clear Filter (View All)
          </Link>
        )}
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <i className="fa-solid fa-box-open text-5xl text-gray-400 mb-3"></i>
          <p className="text-lg text-gray-600 font-medium">No products found matching this filter.</p>
          <Link
            to="/products"
            className="mt-4 inline-block bg-emerald-600 text-white px-5 py-2 rounded-md hover:bg-emerald-700 transition"
          >
            Browse All Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
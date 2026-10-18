import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  FaShoppingCart, FaUser, FaBars, FaTimes, FaSignOutAlt,
  FaSearch, FaHeart, FaTruck, FaShieldAlt, FaUndo, FaHeadset,
  FaChevronDown,
} from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const API_BASE = 'https://ecommerce.routemisr.com/api/v1';

export default function Navbar() {
  const { itemCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { data: categories } = useQuery({
    queryKey: ['navCategories'],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE}/categories`);
      return data.data;
    },
    staleTime: 1000 * 60 * 10,
  });

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setCategoriesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(query.trim())}`);
      setQuery('');
      setMobileOpen(false);
    }
  };

  const desktopLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors whitespace-nowrap ${
      isActive ? 'text-primary' : 'text-gray-700 hover:text-primary'
    }`;

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gray-900 text-white text-xs">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center md:justify-between gap-x-6 gap-y-1 py-2">
            <div className="flex items-center gap-1.5">
              <FaTruck className="text-primary text-[10px]" />
              <span>Free Shipping on orders over 500 EGP</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FaShieldAlt className="text-primary text-[10px]" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FaUndo className="text-primary text-[10px]" />
              <span>14-day return policy</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FaHeadset className="text-primary text-[10px]" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-16 gap-4">
            {/* Logo */}
            <Link to="/" className="text-xl font-bold text-primary flex-shrink-0">
              Fresh<span className="text-gray-800">Cart</span>
            </Link>

            {/* Search - Desktop (بعد اللوجو مباشرة) */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 min-w-0 max-w-md">
              <div className="relative w-full">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full border border-gray-300 rounded-full py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary">
                  <FaSearch size={16} />
                </button>
              </div>
            </form>

            {/* روابط التنقل - يمين البحث */}
            <nav className="hidden md:flex items-center gap-5 flex-shrink-0">
              <NavLink to="/" className={desktopLinkClass}>Home</NavLink>
              <NavLink to="/products" className={desktopLinkClass}>Products</NavLink>

              {/* Categories Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setCategoriesOpen((prev) => !prev)}
                  className={`flex items-center gap-1 text-sm font-medium transition-colors whitespace-nowrap ${
                    categoriesOpen ? 'text-primary' : 'text-gray-700 hover:text-primary'
                  }`}
                >
                  Categories <FaChevronDown size={10} className={`transition-transform ${categoriesOpen ? 'rotate-180' : ''}`} />
                </button>

                {categoriesOpen && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-100 rounded-lg shadow-lg py-2 z-50 max-h-80 overflow-y-auto">
                    <Link
                      to="/categories"
                      onClick={() => setCategoriesOpen(false)}
                      className="block px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5"
                    >
                      View All Categories
                    </Link>
                    <hr className="my-1" />
                    {categories?.map((cat) => (
                      <Link
                        key={cat._id}
                        to={`/products?category=${cat._id}`}
                        onClick={() => setCategoriesOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary"
                      >
                        <img src={cat.image} alt={cat.name} className="w-6 h-6 object-contain rounded-full" />
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <NavLink to="/brands" className={desktopLinkClass}>Brands</NavLink>
              <NavLink to="/wishlist" className={desktopLinkClass}>Wishlist</NavLink>
            </nav>

            {/* Right Icons */}
            <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
              <Link to="/wishlist" className="sm:hidden p-2 text-gray-700 hover:text-primary" aria-label="Wishlist">
                <FaHeart size={18} />
              </Link>

              <Link to="/cart" className="relative p-2 text-gray-700 hover:text-primary" aria-label="Cart">
                <FaShoppingCart size={18} />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="hidden md:flex items-center gap-3">
                  <span className="text-sm text-gray-700 flex items-center gap-1">
                    <FaUser size={14} /> {user.name?.split(' ')[0]}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1 whitespace-nowrap"
                  >
                    <FaSignOutAlt size={14} /> Logout
                  </button>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-3">
                  <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-primary whitespace-nowrap">
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="text-sm font-medium bg-primary text-white px-4 py-2 rounded-full hover:bg-primary/90 whitespace-nowrap"
                  >
                    Register
                  </Link>
                </div>
              )}

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 text-gray-700"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileOpen && (
            <div className="md:hidden border-t py-3 space-y-2">
              <form onSubmit={handleSearch} className="px-3 pb-2">
                <div className="relative w-full">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full border border-gray-300 rounded-full py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                  />
                  <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary">
                    <FaSearch size={16} />
                  </button>
                </div>
              </form>

              <NavLink
                to="/" onClick={() => setMobileOpen(false)}
                className={({ isActive }) => `block px-3 py-2 rounded-lg text-sm font-medium ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                Home
              </NavLink>
              <NavLink
                to="/products" onClick={() => setMobileOpen(false)}
                className={({ isActive }) => `block px-3 py-2 rounded-lg text-sm font-medium ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                Products
              </NavLink>

              <div>
                <button
                  onClick={() => setMobileCategoriesOpen((prev) => !prev)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Categories
                  <FaChevronDown size={10} className={`transition-transform ${mobileCategoriesOpen ? 'rotate-180' : ''}`} />
                </button>
                {mobileCategoriesOpen && (
                  <div className="pl-4 space-y-1 mt-1">
                    <Link
                      to="/categories"
                      onClick={() => setMobileOpen(false)}
                      className="block px-3 py-1.5 text-sm text-primary font-medium"
                    >
                      View All
                    </Link>
                    {categories?.map((cat) => (
                      <Link
                        key={cat._id}
                        to={`/products?category=${cat._id}`}
                        onClick={() => setMobileOpen(false)}
                        className="block px-3 py-1.5 text-sm text-gray-600 hover:text-primary"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <NavLink
                to="/brands" onClick={() => setMobileOpen(false)}
                className={({ isActive }) => `block px-3 py-2 rounded-lg text-sm font-medium ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                Brands
              </NavLink>
              <NavLink
                to="/wishlist" onClick={() => setMobileOpen(false)}
                className={({ isActive }) => `block px-3 py-2 rounded-lg text-sm font-medium ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                Wishlist
              </NavLink>

              <div className="border-t pt-2">
                {user ? (
                  <>
                    <p className="px-3 py-1 text-sm text-gray-600">Hi, {user.name}</p>
                    <button
                      onClick={() => { handleLogout(); setMobileOpen(false); }}
                      className="block w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-gray-50 rounded-lg"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">Login</Link>
                    <Link to="/register" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm bg-primary text-white rounded-full text-center mt-1">Register</Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
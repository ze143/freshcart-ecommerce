import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="container mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* الشعار والوصف */}
        <div>
          <h3 className="text-xl font-bold text-primary mb-3">FreshCart</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Your one-stop shop for fresh products delivered to your door. Quality guaranteed.
          </p>
        </div>

        {/* روابط */}
        <div>
          <h4 className="font-semibold text-white mb-3">Shop</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/products" className="hover:text-primary">All Products</Link></li>
            <li><Link to="/products" className="hover:text-primary">Categories</Link></li>
            <li><Link to="/cart" className="hover:text-primary">Cart</Link></li>
          </ul>
        </div>

        {/* حساب */}
        <div>
          <h4 className="font-semibold text-white mb-3">Account</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/login" className="hover:text-primary">Login</Link></li>
            <li><Link to="/register" className="hover:text-primary">Register</Link></li>
            <li><Link to="/checkout" className="hover:text-primary">Checkout</Link></li>
          </ul>
        </div>

        {/* تواصل */}
        <div>
          <h4 className="font-semibold text-white mb-3">Contact</h4>
          <p className="text-sm flex items-center gap-2 mb-2">
            <FaEnvelope /> support@freshcart.com
          </p>
          <div className="flex gap-3 mt-4">
            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-primary transition-colors"><FaFacebook size={14} /></a>
            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-primary transition-colors"><FaTwitter size={14} /></a>
            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-primary transition-colors"><FaInstagram size={14} /></a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} FreshCart. All rights reserved.
      </div>
    </footer>
  );
}

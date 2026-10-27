import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const WishlistContext = createContext();
const API_BASE = 'https://ecommerce.routemisr.com/api/v1';

export function WishlistProvider({ children }) {
  // جلب المفضلة المحلية من الـ LocalStorage أول ما التطبيق يفتح
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('freshcart_local_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('freshcart_local_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // جلب المفضلة من السيرفر عند تسجيل الدخول
  const getLoggedUserWishlist = async (customToken) => {
    const token = customToken || localStorage.getItem('userToken');
    if (!token) return;

    try {
      const { data } = await axios.get(`${API_BASE}/wishlist`, {
        headers: { token },
      });
      setWishlist(data.data || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  // دمج المفضلة المحلية مع السيرفر بعد تسجيل الدخول
  const mergeWishlistAfterLogin = async (token) => {
    const saved = localStorage.getItem('freshcart_local_wishlist');
    if (!saved) {
      await getLoggedUserWishlist(token);
      return;
    }

    try {
      const localItems = JSON.parse(saved) || [];
      if (localItems.length > 0) {
        for (let item of localItems) {
          const productId = item._id || item.id;
          if (productId) {
            await axios.post(
              `${API_BASE}/wishlist`,
              { productId },
              { headers: { token } }
            );
          }
        }
        localStorage.removeItem('freshcart_local_wishlist');
      }
      await getLoggedUserWishlist(token);
      toast.success('Wishlist synced with your account!', { position: 'bottom-right' });
    } catch (error) {
      console.error('Error merging wishlist:', error);
      await getLoggedUserWishlist(token);
    }
  };

  // إضافة أو إزالة منتج (سواء زائر أو مسجل دخول)
  const toggleWishlist = async (productOrId) => {
    const token = localStorage.getItem('userToken');
    
    // استخراج المنتج والـ ID بدقة سواء تم تمرير كائن أو ID فقط
    const product = typeof productOrId === 'object' ? productOrId : { _id: productOrId };
    const productId = product._id || product.id;

    const exists = wishlist.some((item) => (item._id || item.id) === productId);

    if (token) {
      try {
        if (exists) {
          await axios.delete(`${API_BASE}/wishlist/${productId}`, {
            headers: { token },
          });
          toast.success('Removed from wishlist');
        } else {
          await axios.post(
            `${API_BASE}/wishlist`,
            { productId },
            { headers: { token } }
          );
          toast.success('Added to wishlist');
        }
        await getLoggedUserWishlist(token);
      } catch (error) {
        console.error('Wishlist error:', error);
        toast.error('Failed to update wishlist');
      }
    } else {
      // وضع الزائر: التخزين المحلي الفوري في الـ LocalStorage
      setWishlist((prev) => {
        if (exists) {
          toast.success('Removed from wishlist');
          return prev.filter((item) => (item._id || item.id) !== productId);
        } else {
          toast.success('Added to wishlist');
          return [...prev, product];
        }
      });
    }
  };

  const removeFromWishlist = async (productId) => {
    const token = localStorage.getItem('userToken');
    if (token) {
      try {
        await axios.delete(`${API_BASE}/wishlist/${productId}`, {
          headers: { token },
        });
        await getLoggedUserWishlist(token);
        toast.success('Removed from wishlist');
      } catch (error) {
        console.error('Error removing from wishlist:', error);
      }
    } else {
      setWishlist((prev) => prev.filter((item) => (item._id || item.id) !== productId));
      toast.success('Removed from wishlist');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (token) {
      getLoggedUserWishlist(token);
    }
  }, []);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, removeFromWishlist, mergeWishlistAfterLogin, getLoggedUserWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
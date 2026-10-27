import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const CartContext = createContext();
const API_BASE = 'https://ecommerce.routemisr.com/api/v1';

export function CartContextProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('freshcart_local_cart');
    return savedCart ? JSON.parse(savedCart) : { cartId: null, products: [], totalCartPrice: 0, numOfCartItems: 0 };
  });
  
  const [itemCount, setItemCount] = useState(() => {
    const savedCount = localStorage.getItem('freshcart_item_count');
    return savedCount ? Number(savedCount) : 0;
  });

  useEffect(() => {
    localStorage.setItem('freshcart_local_cart', JSON.stringify(cart));
    localStorage.setItem('freshcart_item_count', itemCount);
  }, [cart, itemCount]);

  const getLoggedUserCart = async (customToken) => {
    const token = customToken || localStorage.getItem('userToken');
    if (!token) return;

    try {
      const { data } = await axios.get(`${API_BASE}/cart`, {
        headers: { token },
      });
      
      // حفظ الـ cartId الحقيقي من السيرفر
      setCart({
        cartId: data.data?._id || data.cartId || null,
        products: data.data?.products || [],
        totalCartPrice: data.data?.totalCartPrice || 0,
        numOfCartItems: data.numOfCartItems || 0
      });
      setItemCount(data.numOfCartItems || 0);
    } catch (error) {
      if (error.response?.status === 404) {
        setCart({ cartId: null, products: [], totalCartPrice: 0, numOfCartItems: 0 });
        setItemCount(0);
      }
    }
  };

  const mergeCartAfterLogin = async (token) => {
    const savedCart = localStorage.getItem('freshcart_local_cart');
    if (!savedCart) {
      await getLoggedUserCart(token);
      return;
    }

    try {
      const parsedCart = JSON.parse(savedCart);
      const localProducts = parsedCart?.products || [];

      if (localProducts.length > 0) {
        for (let item of localProducts) {
          const productId = item.product?._id || item.product;
          const count = item.count || 1;
          
          for (let i = 0; i < count; i++) {
            await axios.post(
              `${API_BASE}/cart`,
              { productId },
              { headers: { token } }
            );
          }
        }
        localStorage.removeItem('freshcart_local_cart');
      }

      await getLoggedUserCart(token);
      toast.success('Cart synced with your account!', { position: 'bottom-right' });
    } catch (error) {
      console.error('Error merging local cart:', error);
      await getLoggedUserCart(token);
    }
  };

  const addToCart = async (productObjOrId) => {
    const token = localStorage.getItem('userToken');
    const productId = typeof productObjOrId === 'object' ? productObjOrId._id : productObjOrId;

    if (token) {
      try {
        const { data } = await axios.post(
          `${API_BASE}/cart`,
          { productId },
          { headers: { token } }
        );
        await getLoggedUserCart(token);
        toast.success('Product added successfully to cart', { position: 'bottom-right' });
        return data;
      } catch (error) {
        console.error('Error adding to cart:', error);
        toast.error('Failed to add product');
      }
    } else {
      try {
        let productDetails = typeof productObjOrId === 'object' ? productObjOrId : null;
        if (!productDetails) {
          const res = await axios.get(`${API_BASE}/products/${productId}`);
          productDetails = res.data.data;
        }

        setCart((prevCart) => {
          const products = [...(prevCart.products || [])];
          const existingIndex = products.findIndex(
            (p) => (p.product?._id || p.product) === productId
          );

          if (existingIndex > -1) {
            products[existingIndex].count += 1;
          } else {
            products.push({
              product: productDetails,
              count: 1,
              price: productDetails.priceAfterDiscount || productDetails.price
            });
          }

          const newCount = itemCount + 1;
          const newTotalPrice = products.reduce((acc, item) => acc + (item.price * item.count), 0);
          
          setItemCount(newCount);
          return {
            ...prevCart,
            products,
            totalCartPrice: newTotalPrice,
            numOfCartItems: newCount
          };
        });

        toast.success('Product added to cart', { position: 'bottom-right' });
      } catch (err) {
        console.error('Error adding local item:', err);
      }
    }
  };

  const updateCartQuantity = async (productId, count) => {
    const token = localStorage.getItem('userToken');
    if (token) {
      try {
        await axios.put(
          `${API_BASE}/cart/${productId}`,
          { count },
          { headers: { token } }
        );
        await getLoggedUserCart(token);
      } catch (error) {
        console.error('Error updating quantity:', error);
      }
    } else {
      setCart((prevCart) => {
        const products = [...(prevCart.products || [])];
        const index = products.findIndex((p) => (p.product?._id || p.product) === productId);
        if (index > -1) {
          products[index].count = count;
        }
        const newTotalPrice = products.reduce((acc, item) => acc + (item.price * item.count), 0);
        return { ...prevCart, products, totalCartPrice: newTotalPrice };
      });
    }
  };

  const removeFromCart = async (productId) => {
    const token = localStorage.getItem('userToken');
    if (token) {
      try {
        await axios.delete(`${API_BASE}/cart/${productId}`, {
          headers: { token },
        });
        await getLoggedUserCart(token);
        toast.success('Product removed from cart');
      } catch (error) {
        console.error('Error removing item:', error);
      }
    } else {
      setCart((prevCart) => {
        const products = (prevCart.products || []).filter(
          (p) => (p.product?._id || p.product) !== productId
        );
        const newCount = Math.max(0, itemCount - 1);
        const newTotalPrice = products.reduce((acc, item) => acc + (item.price * item.count), 0);
        setItemCount(newCount);
        return { ...prevCart, products, totalCartPrice: newTotalPrice, numOfCartItems: newCount };
      });
      toast.success('Product removed from cart');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (token) {
      getLoggedUserCart(token);
    }
  }, []);

  return (
    <CartContext.Provider value={{ 
      cart, 
      itemCount, 
      addToCart, 
      updateCartQuantity, 
      removeFromCart, 
      getLoggedUserCart,
      mergeCartAfterLogin
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const CartProvider = CartContextProvider;

export function useCart() {
  return useContext(CartContext);
}
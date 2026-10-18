import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const AuthContext = createContext(null);

const API_BASE = 'https://ecommerce.routemisr.com/api/v1';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('freshcart_token'));

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({ id: decoded.id, name: decoded.name, email: decoded.email });
      } catch {
        logout();
      }
    }
  }, [token]);

  const login = async (email, password) => {
    const { data } = await axios.post(`${API_BASE}/auth/signin`, { email, password });
    if (data.message === 'success') {
      localStorage.setItem('freshcart_token', data.token);
      setToken(data.token);
      return { success: true };
    }
    return { success: false, message: data.message };
  };

  const register = async (name, email, password, rePassword, phone) => {
    const { data } = await axios.post(`${API_BASE}/auth/signup`, {
      name, email, password, rePassword, phone,
    });
    if (data.message === 'success') {
      localStorage.setItem('freshcart_token', data.token);
      setToken(data.token);
      return { success: true };
    }
    return { success: false, message: data.message };
  };

  const logout = () => {
    localStorage.removeItem('freshcart_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
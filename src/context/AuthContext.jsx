import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();
const API_BASE = 'https://ecommerce.routemisr.com/api/v1';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('userToken');
    return token ? { token } : null;
  });

  const login = async (email, password) => {
    try {
      const { data } = await axios.post(`${API_BASE}/auth/signin`, { email, password });
      localStorage.setItem('userToken', data.token);
      setUser({ token: data.token, name: data.user?.name });
      toast.success('Logged in successfully', { position: 'bottom-right' });
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('userToken');
    setUser(null);
    toast.success('Logged out', { position: 'bottom-right' });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, token: localStorage.getItem('userToken') }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
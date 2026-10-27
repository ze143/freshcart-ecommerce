import axios from 'axios';

const api = axios.create({
  baseURL: 'https://ecommerce.routemisr.com/api/v1',
});

// إضافة التوكن تلقائياً في الطلبات التي تتطلب تسجيل دخول
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('userToken');
  if (token) {
    config.headers.token = token;
  }
  return config;
});

export default api;
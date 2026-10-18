import axios from 'axios';

const API_BASE = 'https://ecommerce.routemisr.com/api/v1';

export const getProducts = async (page = 1, limit = 20) => {
  const response = await axios.get(`${API_BASE}/products`, {
    params: { page, limit }
  });
  return response.data;
};

export const getProductById = async (id) => {
  const response = await axios.get(`${API_BASE}/products/${id}`);
  return response.data;
};

export const getCategories = async () => {
  const response = await axios.get(`${API_BASE}/categories`);
  return response.data;
};
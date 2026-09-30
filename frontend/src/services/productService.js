import api from './api';

// All product-related API calls

// Get all products — supports search and pagination query params
export const getProducts = async (params = {}) => {
  const { data } = await api.get('/products', { params });
  return data;
};

// Get a single product by ID
export const getProductById = async (id) => {
  const { data } = await api.get(`/products/${id}`);
  return data;
};

// Create a new product (authenticated)
export const createProduct = async (productData) => {
  const { data } = await api.post('/products', productData);
  return data;
};

// Update an existing product (authenticated)
export const updateProduct = async (id, productData) => {
  const { data } = await api.put(`/products/${id}`, productData);
  return data;
};

// Delete a product (authenticated)
export const deleteProduct = async (id) => {
  const { data } = await api.delete(`/products/${id}`);
  return data;
};

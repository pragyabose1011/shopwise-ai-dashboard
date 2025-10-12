import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Health check
export const checkAPIHealth = () => api.get('/health');

// Products API
export const getProducts = (params = {}) => api.get('/products/', { params });
export const getProduct = (id) => api.get(`/products/${id}`);
export const getCategories = () => api.get('/products/categories');
export const getPopularProducts = (limit = 8) => api.get(`/products/popular?limit=${limit}`);
export const recordInteraction = (data) => api.post('/products/interact', data);

// Users API
export const getUsers = () => api.get('/users/');
export const getUser = (id) => api.get(`/users/${id}`);
export const createUser = (data) => api.post('/users/', data);
export const getUserStats = (id) => api.get(`/users/${id}/stats`);
export const getUserInteractions = (id, params = {}) => api.get(`/users/${id}/interactions`, { params });

// Recommendations API
export const getUserRecommendations = (userId, params = {}) => 
  api.get(`/recommendations/${userId}`, { params });
export const generateRecommendations = (userId, data = {}) => 
  api.post(`/recommendations/${userId}/generate`, data);
export const getPopularRecommendations = (limit = 10) => 
  api.get(`/recommendations/popular?limit=${limit}`);

export default api;

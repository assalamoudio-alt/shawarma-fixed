import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      toast.error('Session expirée, veuillez vous reconnecter');
    } else if (error.response?.status === 500) {
      toast.error('Erreur serveur, veuillez réessayer plus tard');
    }
    return Promise.reject(error);
  }
);

// Produits
export const fetchProducts = () => api.get('/products').then(res => res.data);
export const fetchProductById = (id) => api.get(`/products/${id}`).then(res => res.data);

// Commandes
export const createOrder = (orderData) => api.post('/orders', orderData).then(res => res.data);
export const fetchUserOrders = () => api.get('/orders/my-orders').then(res => res.data);

// Auth
export const login = (credentials) => api.post('/auth/login', credentials).then(res => res.data);
export const register = (userData) => api.post('/auth/register', userData).then(res => res.data);
export const getCurrentUser = () => api.get('/auth/me').then(res => res.data);

export default api;

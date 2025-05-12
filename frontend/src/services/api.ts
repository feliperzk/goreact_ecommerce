import axios, { InternalAxiosRequestConfig } from 'axios';

// Este arquivo está configurado, mas não será utilizado enquanto não houver backend
// Mantido para referência futura quando o backend estiver disponível

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
});

// Adiciona o token de autenticação em todas as requisições
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

// Serviços de autenticação
export const authService = {
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  register: (name: string, email: string, password: string) => api.post('/auth/register', { name, email, password }),
};

// Serviços de produtos
export const productService = {
  getAll: () => api.get('/products'),
  getById: (id: string) => api.get(`/products/${id}`),
};

// Serviços de pedidos
export const orderService = {
  create: (items: { productId: string; quantity: number }[]) => api.post('/orders', { items }),
  getAll: () => api.get('/orders'),
  getById: (id: string) => api.get(`/orders/${id}`),
}; 
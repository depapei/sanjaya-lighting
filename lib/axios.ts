import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://public-api.wordpress.com/wp/v2/sites/www.tokolampuhiasjakarta.com',
  timeout: 10000,
});

// interceptor request
api.interceptors.request.use(
  (config) => {
    // contoh: inject token
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// interceptor response
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('API Error:', error.response?.data);
    return Promise.reject(error);
  }
);

export default api;

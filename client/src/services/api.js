import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to attach JWT token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('eventease_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to catch unauthorized errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Optional: Clear invalid token if expired
      // localStorage.removeItem('eventease_token');
    }
    return Promise.reject(error);
  }
);

export default API;

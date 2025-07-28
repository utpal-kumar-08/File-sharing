// src/config/axiosInstance.js
import axios from "axios";

const BASE_URL = "http://localhost:5600/api/";
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Include cookies for authentication
});

// ✅ Fixed request interceptor without circular dependency
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage instead of Redux store
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

// ✅ Optional: Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 errors (token expired)
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Optionally redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

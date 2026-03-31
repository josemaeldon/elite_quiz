// src/middleware/axiosInterceptor.js

import { store } from '@/store/store';
import axios from 'axios';

// Create Axios instance
const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/`,
});

// Function to get stored token
const getStoredToken = async () => {
  const token = store.getState()?.User?.data?.api_token;
  return token || null;
};

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await getStoredToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      config.headers['Content-Type'] = 'multipart/form-data';
      return config;
    } catch (error) {
      console.error('Error in token retrieval:', error);
      return Promise.reject(error);
    }
  },
  (error) => {
    console.error('Error in request interceptor:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("401 Unauthorized - Logging out user...");
    }
    return Promise.reject(error);
  }
);

export default api;

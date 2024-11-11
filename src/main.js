// main.js
import { createApp } from 'vue';
import './assets/main.css'; // This should contain Tailwind CSS imports
import App from './App.vue';
import router from './router';
import axios from 'axios';

// Helper function to check if token is expired
function isTokenExpired(token) {
  if (!token) return true;
  const payload = JSON.parse(atob(token.split('.')[1]));
  return payload.exp * 1000 < Date.now();
}

// Axios configuration
axios.defaults.baseURL = 'https://ecommerce-backend-sage-eight.vercel.app/api';
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    if (isTokenExpired(token)) {
      // Clear expired token and redirect to login
      localStorage.removeItem('authToken');
      router.push({ name: 'Login' });
      return Promise.reject(new Error('Token expired'));
    }
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => Promise.reject(error));

// Initialize and mount app
createApp(App).use(router).mount('#app');

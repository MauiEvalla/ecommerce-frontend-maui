import { createApp } from 'vue';
import './assets/main.css'; // This should contain Tailwind CSS imports
import App from './App.vue';
import router from './router';
import axios from 'axios';

// Axios configuration
axios.defaults.baseURL = 'https://ecommerce-backend-sage-eight.vercel.app/api';
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken'); // Adjust to where your token is stored
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

createApp(App).use(router).mount('#app');

import { createApp } from 'vue';
import './assets/main.css'; // This should contain Tailwind CSS imports
import App from './App.vue';
import router from './router';

createApp(App).use(router).mount('#app');

import { fileURLToPath, URL } from 'node:url';
import tailwindcss from 'tailwindcss';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/API': {
        target: 'https://ecommerce-backend-sage-eight.vercel.app', // Target URL of your backend
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/API/, '/api'), // Rewrite '/API' to '/api'
      }
    }
  },
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
});

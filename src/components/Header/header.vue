<template>
  <header class="bg-amber-500 shadow-md py-4">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
      <!-- Search Bar -->
      <div class="flex items-center space-x-4">
        <img src="../../assets/images/icons/magnify.svg" alt="Search" class="h-6 w-6" />
        <input
          type="text"
          placeholder="Search products..."
          class="px-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          @input="onSearchInput"
        />
      </div>

      <!-- Icons Section -->
      <div class="flex items-center space-x-6">
        <!-- Shopping Cart with Cart Count -->
        <div class="relative cursor-pointer" @click="goToCart">
          <img src="../../assets/images/icons/cart-outline.svg" alt="Cart" class="h-6 w-6" />
          <!-- Cart item count badge -->
          <span
            v-if="cartCount > 0"
            class="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
          >
            {{ cartCount }}
          </span>
        </div>
        
        <!-- Notifications -->
        <img src="../../assets/images/icons/bell-outline.svg" alt="Notifications" class="h-6 w-6 cursor-pointer" />
      </div>
    </div>
  </header>
</template>

<script>
import axios from 'axios';

export default {
  name: 'HeaderBar',
  data() {
    return {
      cartCount: 0, // This will hold the number of items in the cart
    };
  },
  methods: {
    onSearchInput(event) {
      const query = event.target.value;
      this.$emit('search-query', query);
    },
    async loadCartCount() {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        const response = await axios.get('https://ecommerce-backend-sage-eight.vercel.app/api/cart/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        // Update cart count
        this.cartCount = response.data.items.reduce((sum, item) => sum + item.quantity, 0);
      } catch (error) {
        console.error('Failed to load cart count:', error);
      }
    },
    goToCart() {
      this.$router.push({ name: 'Cart' });
    },
  },
  mounted() {
    this.loadCartCount();
    
    // Listen for custom events to update cart count
    this.$root.$on('cart-updated', this.loadCartCount);
  },
  beforeDestroy() {
    this.$root.$off('cart-updated', this.loadCartCount);
  },
};
</script>

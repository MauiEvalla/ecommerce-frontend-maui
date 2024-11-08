<template>
    <HeaderBar />
  
    <div class="max-w-7xl mx-auto p-6 bg-gray-200">
      <h1 class="text-4xl font-bold text-center text-gray-800 mb-8">Account Dashboard</h1>
  
      <!-- Links to MyOrders and MyWishlist -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-20">
        <div
          class="bg-white p-4 rounded-lg shadow-md flex flex-col items-center cursor-pointer"
          @click="goToMyOrders"
        >
          <h2 class="text-lg font-bold text-gray-800 mb-1">My Orders</h2>
          <p class="text-lg text-amber-700 mb-2">View your order history</p>
        </div>
  
        <div
          class="bg-white p-4 rounded-lg shadow-md flex flex-col items-center cursor-pointer"
          @click="goToMyWishlist"
        >
          <h2 class="text-lg font-bold text-gray-800 mb-1">My Wishlist</h2>
          <p class="text-lg text-amber-700 mb-2">Check your saved items</p>
        </div>
      </div>
    </div>
  
    <NavBar />
  </template>
  
  <script>
  import HeaderBar from '@/components/Header/header.vue';
  import NavBar from '@/components/Navbar/Navbar.vue';
  
  export default {
    components: {
      HeaderBar,
      NavBar,
    },
    methods: {
      goToMyOrders() {
        this.$router.push({ name: 'MyOrders' });
      },
      goToMyWishlist() {
        this.$router.push({ name: 'MyWishlist' });
      },
    },
  };
  </script>
  
  <style scoped>
  /* Add any additional styling as needed */
  </style>
  
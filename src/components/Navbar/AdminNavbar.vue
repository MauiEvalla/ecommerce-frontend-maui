<template>
    <div class="fixed bg-amber-500 bottom-0 left-0 right-0 shadow-md py-3 flex justify-around items-center z-50">
      <!-- Home Icon (Admin View) -->
      <router-link to="/AdminView" class="flex flex-col items-center">
        <img
          src="../../assets/images/icons/home.svg"
          alt="Home"
          class="w-8 h-8"
        />
        <span class="text-xs text-white">Home</span>
      </router-link>
  
      <!-- Add Item Icon -->
      <router-link to="/AddProduct" class="flex flex-col items-center">
        <img
          src="../../assets/images/icons/plus-circle.svg"
          alt="Add Item"
          class="w-8 h-8"
        />
        <span class="text-xs text-white">Add Item</span>
      </router-link>
    </div>
  </template>
  
  <script>
  export default {
    name: 'AdminNavbar',
  };
  </script>
  
  <style scoped>
  /* Ensure the navbar sticks at the bottom */
  </style>
  
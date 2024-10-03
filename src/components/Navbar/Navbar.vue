<template>
  <div class="fixed bg-amber-500 bottom-0 left-0 right-0 shadow-md py-3 flex justify-around items-center z-50">
    <!-- Home Icon -->
    <div class="flex flex-col items-center">
      <img
        src="../../assets/images/icons/home.svg"
        alt="Home"
        class="w-8 h-8"
      />
      <span class="text-xs text-white">Home</span>
    </div>

    <!-- Shopping Cart Icon -->
    <div class="flex flex-col items-center">
      <img
        src="../../assets/images/icons/chat-outline.svg"
        alt="Cart"
        class="w-8 h-8"
      />
      <span class="text-xs text-white">Message</span>
    </div>

    <!-- Bell Icon -->
    <div class="flex flex-col items-center">
      <img
        src="../../assets/images/icons/account.svg"
        alt="Notifications"
        class="w-8 h-8"
      />
      <span class="text-xs text-white">Profile</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Navbar'
};
</script>

<style scoped>
/* Ensure the navbar sticks at the bottom */
</style>

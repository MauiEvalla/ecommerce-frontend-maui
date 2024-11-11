<template>
  <HeaderBar />
  <div class="max-w-7xl mx-auto p-6 bg-gray-200">
    <h1 class="text-4xl font-bold text-center text-gray-800 mb-8">My Wishlist</h1>

    <!-- Loading State -->
    <div v-if="loading" class="text-center text-lg font-semibold text-gray-600">Loading...</div>

    <!-- No Wishlist Items Message -->
    <div v-if="!loading && wishlist.length === 0" class="text-center text-lg font-semibold text-gray-600">
      Your wishlist is empty.
    </div>

    <!-- Wishlist Items -->
    <div v-if="!loading && wishlist.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="item in wishlist" :key="item._id" class="bg-white p-4 rounded-lg shadow-md">
        <img :src="item.image" alt="Product Image" class="w-full h-48 object-cover rounded-lg mb-4" />
        <h2 class="text-2xl font-bold text-gray-800 mb-2">{{ item.name }}</h2>
        <p class="text-gray-600 mb-2">Price: ₱{{ item.price.toFixed(2) }}</p>
        <p class="text-gray-600 mb-2">Weight: {{ item.weight }} kg</p>
        <button
          @click="removeFromWishlist(item._id)"
          class="mt-4 w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        >
          Remove from Wishlist
        </button>
      </div>
    </div>
  </div>
  <NavBar />
</template>

<script>
import HeaderBar from "@/components/Header/header.vue";
import NavBar from "@/components/Navbar/Navbar.vue";
import Swal from "sweetalert2";

export default {
  components: {
    HeaderBar,
    NavBar,
  },
  data() {
    return {
      wishlist: [],
      loading: true,
    };
  },
  async created() {
    await this.fetchWishlist();
  },
  methods: {
    // Fetch the user's wishlist
    async fetchWishlist() {
      this.loading = true;
      const token = localStorage.getItem("authToken");
      if (!token) {
        return Swal.fire({
          icon: "error",
          title: "Not Logged In",
          text: "Please log in to view your wishlist.",
        });
      }

      try {
        const response = await fetch("https://ecommerce-backend-sage-eight.vercel.app/api/wishlist/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch wishlist");
        }

        const data = await response.json();
        this.wishlist = data.wishlist.productIds; // Access the product details in wishlist
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load wishlist. Please try again.",
        });
      } finally {
        this.loading = false;
      }
    },

    // Remove an item from the wishlist
    async removeFromWishlist(productId) {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return Swal.fire({
          icon: "error",
          title: "Not Logged In",
          text: "Please log in to manage your wishlist.",
        });
      }

      try {
        const response = await fetch("https://ecommerce-backend-sage-eight.vercel.app/api/wishlist/remove", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId: this.userId, productId }),
        });

        if (!response.ok) {
          throw new Error("Failed to remove item from wishlist");
        }

        Swal.fire({
          icon: "success",
          title: "Removed",
          text: "Product removed from wishlist.",
        });

        // Refresh the wishlist after removal
        this.fetchWishlist();
      } catch (error) {
        console.error("Error removing item from wishlist:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to remove item. Please try again.",
        });
      }
    },
  },
};
</script>

<style scoped>
/* Optional styling */
</style>

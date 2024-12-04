<template>
  <ShopNav @search-query="filterProductsBySearch" />

  <div class="max-w-full mx-auto p-4 bg-gray-200">
    <!-- Carousel Section -->
    <div class="mb-4 relative">
      <div class="absolute top-4 left-4 bg-black bg-opacity-60 px-4 py-2 rounded-md">
        <h2 class="text-white text-2xl font-semibold">Our Deals</h2>
      </div>
      <div class="relative w-full h-48 sm:h-64 overflow-hidden rounded-md">
        <div
          class="carousel flex transition-transform duration-500 ease-in-out"
          :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
        >
          <div
            v-for="(image, index) in adImages"
            :key="index"
            class="w-full h-48 sm:h-64 flex-shrink-0"
          >
            <img
              :src="getImageUrl(image)"
              :alt="`Ad ${index + 1}`"
              class="w-full h-full object-cover"
            />
          </div>
        </div>
        <!-- Navigation Dots -->
        <div class="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
          <span
            v-for="(image, index) in adImages"
            :key="index"
            class="h-3 w-3 rounded-full cursor-pointer"
            :class="{
              'bg-orange-500': currentSlide === index,
              'bg-gray-300': currentSlide !== index,
            }"
            @click="setCurrentSlide(index)"
          ></span>
        </div>
      </div>
    </div>

    <!-- Credit Section -->
    <div class="bg-white p-4 mb-4 rounded-md shadow">
      <div class="bg-gradient-to-r from-amber-300 to-amber-600 p-6 rounded-md">
        <h2 class="text-2xl sm:text-3xl font-bold text-amber-900 mb-1">
          {{ creditsBalance.toLocaleString() }}
        </h2>
        <p class="text-gray-800">Available Credits</p>
      </div>
    </div>

    <!-- Categories Section -->
    <div class="bg-white p-4 mb-4 rounded-md">
      <h3 class="text-lg font-semibold text-gray-700 mb-2">Categories</h3>
      <div class="overflow-x-auto whitespace-nowrap no-scrollbar flex space-x-2">
        <button
          v-for="category in categories"
          :key="category._id"
          @click="filterProductsByCategory(category._id)"
          class="px-4 py-2 bg-white border shadow text-gray-700 rounded-md hover:bg-gray-50"
        >
          {{ category.categoryName }}
        </button>
      </div>
    </div>

    <!-- Products Section -->
    <div
      v-if="!loading"
      class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4"
    >
      <div
        v-for="product in filteredProducts"
        :key="product._id"
        class="bg-white p-4 rounded-md shadow hover:shadow-md cursor-pointer flex flex-col"
        @click="goToProductDetails(product._id)"
      >
        <img
          v-if="product.image"
          :src="product.image"
          alt="Product Image"
          class="w-full h-32 sm:h-48 object-cover rounded-md mb-3"
        />
        <h3 class="text-base sm:text-lg font-bold text-gray-800 truncate">
          {{ product.name }}
        </h3>
        <p class="text-base sm:text-lg font-bold text-amber-700 mt-1">
          ₱{{ product.price.toFixed(2) }}
        </p>
        <button
          @click.stop="addToCart(product)"
          class="mt-4 px-2 sm:px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600"
        >
          Add to Cart
        </button>
      </div>
    </div>

    <div v-if="loading" class="text-center text-lg text-gray-600">Loading...</div>
    <div
      v-if="!loading && filteredProducts.length === 0"
      class="text-center text-lg text-gray-600"
    >
      No products available.
    </div>
  </div>

  <BottomNavigation />
</template>


<script>
import Swal from "sweetalert2";
import ShopNav from "@/components/Navbar/ShopNav.vue";
import BottomNavigation from "@/components/Navbar/BottomNavigation.vue";

export default {
  components: { ShopNav, BottomNavigation },
  data() {
    return {
      products: [],
      filteredProducts: [],
      categories: [],
      creditsBalance: 20000, // Example balance
      loading: true,
      searchQuery: "",
      adImages: ["ad1.jpg", "ad2.jpg", "ad3.jpg", "ad4.jpg"],
      currentSlide: 0,
    };
  },
  async created() {
    await this.fetchProducts();
    await this.fetchCategories();
    this.startCarousel();
  },
  methods: {
    getImageUrl(image) {
      return new URL(`../assets/images/ads/${image}`, import.meta.url).href;
    },
    async fetchProducts() {
      const response = await fetch(
        `https://ecommerce-backend-sage-eight.vercel.app/api/product?searchQuery=${encodeURIComponent(
          this.searchQuery
        )}`
      );
      const data = await response.json();
      this.products = data.allProduct;
      this.filteredProducts = data.allProduct;
      this.loading = false;
    },
    async fetchCategories() {
      const response = await fetch("https://ecommerce-backend-sage-eight.vercel.app/api/category/");
      const data = await response.json();
      this.categories = data.allCategories;
    },
    filterProductsByCategory(categoryId) {
      this.filteredProducts = this.products.filter(
        (product) => product.categoryId === categoryId
      );
    },
    setCurrentSlide(index) {
      this.currentSlide = index;
    },
    startCarousel() {
      setInterval(() => {
        this.currentSlide = (this.currentSlide + 1) % this.adImages.length;
      }, 3000);
    },
    async addToCart(product) {
      const token = localStorage.getItem("authToken");
      const response = await fetch("https://ecommerce-backend-sage-eight.vercel.app/api/cart/addItemToCart", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product._id, quantity: 1 }),
      });
      if (response.ok) {
        Swal.fire("Success", `${product.name} added to cart`, "success");
      }
    },
  },
};
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>

<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Product List</h1>

    <div v-if="loading" class="text-center">Loading...</div>

    <div v-if="!loading && products.length === 0" class="text-center">
      No products available.
    </div>

    <div v-if="!loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="product in products"
        :key="product._id"
        class="bg-white p-4 shadow rounded-lg"
      >
        <h2 class="text-xl font-semibold">{{ product.name }}</h2>
        <p class="text-gray-700">Price: ${{ product.price }}</p>
        <p class="text-gray-500">{{ product.description }}</p>
        <p class="text-gray-500">Quantity: {{ product.quantity }}</p>
        <img v-if="product.image" :src="product.image" alt="Product Image" class="w-full h-auto mt-2" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      products: [],
      loading: true,
    };
  },
  async created() {
    try {
      const response = await fetch('/API/product/Products');
      const data = await response.json();
      this.products = data.allProduct;
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      this.loading = false;
    }
  },
};
</script>


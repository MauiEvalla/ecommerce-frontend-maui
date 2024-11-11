<template>
  <HeaderBar />
  <div class="max-w-7xl mx-auto p-6 pb-20 bg-gray-200">
    <h1 class="text-4xl font-bold text-center text-gray-800 mb-8">My Orders</h1>

    <!-- Loading State -->
    <div v-if="loading" class="text-center text-lg font-semibold text-gray-600">Loading...</div>

    <!-- No Orders Message -->
    <div v-if="!loading && orders.length === 0" class="text-center text-lg font-semibold text-gray-600">
      No orders found.
    </div>

    <!-- Orders List -->
    <div v-if="!loading && orders.length > 0">
      <div v-for="order in orders" :key="order._id" class="bg-white p-4 rounded-lg shadow-md mb-4">
        <!-- Display half of the Order ID to avoid overflow -->
        <h2 class="text-2xl font-bold text-gray-800">Order #{{ order._id.slice(0, 12) }}...</h2>
        <p class="text-gray-600 mb-2">Status: {{ order.order_status }}</p>
        <p class="text-gray-600 mb-2">User Email: {{ order.user_id.email }}</p>

        <!-- Calculate and display total order price -->
        <p class="text-gray-800 font-semibold">Total Price: ₱{{ calculateTotalPrice(order.orderDetails).toFixed(2) }}</p>

        <!-- Order Details -->
        <div
        v-for="detail in order.orderDetails"
        :key="detail._id"
        class="p-2 mt-2 bg-gray-100 rounded-lg cursor-pointer"
        @click="fetchProductDetail(detail.product_id._id)" 
      >
        <h3 class="text-lg font-semibold text-gray-700">{{ detail.product_id.name }}</h3>
        <p>Quantity: {{ detail.quantity }}</p>
        <p>Price: ₱{{ detail.price.toFixed(2) }}</p>
        </div>
      </div>
    </div>

    <!-- Product Detail Modal -->
    <div v-if="selectedProduct" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-6 rounded-lg max-w-lg">
        <button @click="closeProductModal" class="float-right text-red-500 font-bold">X</button>
        <h2 class="text-2xl font-bold">{{ selectedProduct.name }}</h2>
        <img :src="selectedProduct.image" alt="Product Image" class="w-full h-64 object-cover rounded-lg my-4" />
        <p class="text-gray-700 mb-2">Price: ₱{{ selectedProduct.price.toFixed(2) }}</p>
        <p class="text-gray-700 mb-2">Weight: {{ selectedProduct.weight }} kg</p>
        <p class="text-gray-700 mb-2">Description: {{ selectedProduct.description }}</p>
        <p class="text-gray-700 mb-2">Location: {{ selectedProduct.location }}</p>
        <p v-if="!selectedProduct.inStock" class="text-red-500">Out of Stock</p>
        <p v-if="!selectedProduct.available" class="text-yellow-500">Unavailable</p>
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
      orders: [],
      loading: true,
      selectedProduct: null, // Store the selected product details
    };
  },
  async created() {
    await this.fetchOrders();
  },
  methods: {
    async fetchOrders() {
      this.loading = true;
      const token = localStorage.getItem("authToken");
      if (!token) {
        return Swal.fire({
          icon: "error",
          title: "Not Logged In",
          text: "Please log in to view your orders.",
        });
      }

      try {
        const response = await fetch("https://ecommerce-backend-sage-eight.vercel.app/api/order/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        this.orders = await response.json();
      } catch (error) {
        console.error("Error fetching orders:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load orders. Please try again.",
        });
      } finally {
        this.loading = false;
      }
    },

    // Fetch product details and open the modal
    async fetchProductDetail(productId) {
      try {
        const response = await fetch(`https://ecommerce-backend-sage-eight.vercel.app/api/product/${productId}`);
        if (!response.ok) throw new Error("Failed to fetch product details");
        this.selectedProduct = await response.json();
      } catch (error) {
        console.error("Error fetching product details:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load product details. Please try again.",
        });
      }
    },

    // Close the product detail modal
    closeProductModal() {
      this.selectedProduct = null;
    },

    // Calculate total price for an order's details
    calculateTotalPrice(orderDetails) {
      return orderDetails.reduce((total, detail) => total + detail.price * detail.quantity, 0);
    },
  },
};
</script>

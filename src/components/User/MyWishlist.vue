<template>
    <HeaderBar />
    <div class="max-w-7xl mx-auto p-6 bg-gray-200">
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
          <h2 class="text-2xl font-bold text-gray-800">Order #{{ order._id }}</h2>
          <p class="text-gray-600 mb-2">Status: {{ order.order_status }}</p>
          <p class="text-gray-600 mb-2">Order Email: {{ order.orderEmail }}</p>
          <p class="text-gray-600 mb-2">Total Amount: ₱{{ order.totalAmount.toFixed(2) }}</p>
  
          <!-- Order Details -->
          <div v-for="detail in order.orderDetails" :key="detail._id" class="p-2 mt-2 bg-gray-100 rounded-lg">
            <h3 class="text-lg font-semibold text-gray-700">{{ detail.product_id.name }}</h3>
            <p>Quantity: {{ detail.quantity }}</p>
            <p>Price: ₱{{ detail.price.toFixed(2) }}</p>
          </div>
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
          const response = await fetch("https://ecommerce-backend-sage-eight.vercel.app/api/orders", {
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
    },
  };
  </script>
  
  <style scoped>
  /* Add any additional styles if needed */
  </style>
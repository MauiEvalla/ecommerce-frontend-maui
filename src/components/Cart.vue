<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Back to Home Icon -->
    <div class="mb-4">
      <router-link to="/" class="flex items-center">
        <img
          src="../assets/images/icons/arrow-left-circle.svg"
          alt="Back to Home"
          class="w-6 h-6 mr-2"
        />
        <span class="text-blue-500 hover:underline">Back to Home</span>
      </router-link>
    </div>

    <h1 class="text-3xl font-semibold mb-6">Your Cart</h1>

    <!-- Loading state -->
    <div v-if="loading" class="text-center text-lg font-semibold text-gray-600">
      Loading...
    </div>

    <!-- Cart Items -->
    <div v-if="!loading && cart.length > 0">
      <div
        v-for="item in cart"
        :key="item._id"
        class="bg-white shadow-md rounded-lg p-4 flex flex-col md:flex-row items-center space-x-4 mb-6"
      >
        <img
          :src="item.productId.image"
          alt="Product Image"
          class="w-full md:w-1/3 h-40 object-cover rounded-md"
        />

        <div class="flex-1 md:ml-4">
          <h3 class="text-lg font-semibold">{{ item.productId.name }}</h3>
          <p class="text-gray-500">
            Price: ₱{{ item.productId.price.toFixed(2) }}
          </p>
          <div class="flex items-center mt-2">
            <button
              @click="updateQuantity(item.productId._id, 'decrease')"
              class="px-3 py-1 bg-gray-300 text-gray-700 rounded-l"
            >
              -
            </button>
            <input
              type="text"
              v-model="item.quantity"
              class="w-12 text-center border border-gray-300 focus:outline-none mx-2"
              readonly
            />
            <button
              @click="updateQuantity(item.productId._id, 'increase')"
              class="px-3 py-1 bg-gray-300 text-gray-700 rounded-r"
            >
              +
            </button>
          </div>
        </div>

        <button
          @click="removeFromCart(item.productId._id)"
          class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 self-end md:self-start"
        >
          Remove
        </button>
      </div>
    </div>

    <!-- Empty Cart -->
    <div v-else-if="!loading" class="text-center">
      <p class="text-xl text-gray-500">Your cart is empty.</p>
    </div>

    <!-- Sticky Total and Checkout -->
    <div v-if="!loading && cart.length > 0" class="fixed bottom-0 left-0 right-0 bg-amber-500 shadow-md p-4">
      <div class="flex justify-between items-center">
        <p class="text-lg font-semibold">Total: ₱{{ totalPrice.toFixed(2) }}</p>
        <button @click="showModal = true" class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
          Checkout
        </button>
      </div>
    </div>

    <!-- Modal for Input -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 class="text-2xl font-semibold mb-4">Enter Order Details</h2>
        <label class="block mb-2">Shipping Address</label>
        <input
          v-model="shippingAddress"
          class="w-full p-2 border rounded mb-4"
          type="text"
          placeholder="Shipping Address"
        />

        <label class="block mb-2">Order Address</label>
        <input
          v-model="orderAddress"
          class="w-full p-2 border rounded mb-4"
          type="text"
          placeholder="Order Address"
        />

        <label class="block mb-2">Order Email</label>
        <input
          v-model="orderEmail"
          class="w-full p-2 border rounded mb-4"
          type="email"
          placeholder="Order Email"
        />

        <div class="flex justify-end">
          <button @click="showModal = false" class="px-4 py-2 bg-gray-500 text-white rounded-lg mr-2">
            Cancel
          </button>
          <button @click="submitOrder" class="px-4 py-2 bg-blue-500 text-white rounded-lg">
            Submit
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cart: [],
      shippingAddress: '',
      orderAddress: '',
      orderEmail: '',
      showModal: false,
      loading: true, // Added loading state
    };
  },
  computed: {
    totalPrice() {
      return this.cart.reduce(
        (total, item) => total + item.productId.price * item.quantity,
        0
      );
    },
  },
  created() {
    this.loadCart();
  },
  methods: {
    async loadCart() {
      this.loading = true; // Set loading to true before fetch
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(
          'https://ecommerce-backend-sage-eight.vercel.app/api/cart/',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        const data = await response.json();
        this.cart = data.items;
      } catch (error) {
        console.error('Failed to load cart:', error);
      } finally {
        this.loading = false; // Set loading to false after fetch
      }
    },
    async updateQuantity(productId, action) {
    const quantity = action === 'increase' ? 1 : -1;
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('https://ecommerce-backend-sage-eight.vercel.app/api/cart/addItemToCart', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity }),
      });
      if (!response.ok) throw new Error('Failed to update cart quantity');
      this.loadCart();
      this.$root.$emit('cart-updated'); // Emit the event
    } catch (error) {
      console.error('Failed to update cart quantity:', error);
    }
  },
  
  async removeFromCart(productId) {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('https://ecommerce-backend-sage-eight.vercel.app/api/cart/removeItemFromCart', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });
      if (!response.ok) throw new Error('Failed to remove item from cart');
      this.loadCart();
      this.$root.$emit('cart-updated'); // Emit the event
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
    }
  },
    async submitOrder() {
      this.showModal = false;
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(
          'https://ecommerce-backend-sage-eight.vercel.app/api/order/OrderFromCart',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              shippingAddress: this.shippingAddress,
              orderAddress: this.orderAddress,
              orderEmail: this.orderEmail,
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log('Order created:', data);
          alert('Order placed successfully!');
          this.cart = [];
        } else {
          const error = await response.json();
          console.error('Failed to place order:', error);
          alert('Failed to place order');
        }
      } catch (error) {
        console.error('Error during checkout:', error);
        alert('Error during checkout');
      }
    },
  },
};
</script>

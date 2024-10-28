<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-semibold mb-6">Your Cart</h1>

    <!-- Cart Items -->
    <div v-if="cart.length > 0">
      <div v-for="item in cart" :key="item._id" class="bg-white shadow-md rounded-lg p-4 flex flex-col md:flex-row items-center space-x-4 mb-6">
        <img :src="item.productId.image" alt="Product Image" class="w-full md:w-1/3 h-40 object-cover rounded-md" />
        
        <div class="flex-1 md:ml-4">
          <h3 class="text-lg font-semibold">{{ item.productId.name }}</h3>
          <p class="text-gray-500">Price: ₱{{ item.productId.price.toFixed(2) }}</p>
          <div class="flex items-center mt-2">
            <button @click="updateQuantity(item.productId._id, 'decrease')" class="px-3 py-1 bg-gray-300 text-gray-700 rounded-l">-</button>
            <input type="text" v-model="item.quantity" class="w-12 text-center border border-gray-300 focus:outline-none mx-2" readonly />
            <button @click="updateQuantity(item.productId._id, 'increase')" class="px-3 py-1 bg-gray-300 text-gray-700 rounded-r">+</button>
          </div>
        </div>

        <button @click="removeFromCart(item.productId._id)" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 self-end md:self-start">Remove</button>
      </div>
    </div>    

    <!-- Empty Cart -->
    <div v-else class="text-center">
      <p class="text-xl text-gray-500">Your cart is empty.</p>
    </div>

    <!-- Sticky Total and Checkout -->
    <div v-if="cart.length > 0" class="fixed bottom-0 left-0 right-0 bg-amber-500 shadow-md p-4">
      <div class="flex justify-between items-center">
        <p class="text-lg font-semibold">Total: ₱{{ totalPrice.toFixed(2) }}</p>
        <button class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
          Checkout
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cart: [],
    };
  },
  computed: {
    totalPrice() {
      return this.cart.reduce((total, item) => total + item.productId.price * item.quantity, 0);
    },
  },
  created() {
    this.loadCart();
  },
  methods: {
    async loadCart() {
  try {
    const token = localStorage.getItem('authToken');
    console.log('Token:', token); // Log the token to check its value
    const response = await fetch('https://ecommerce-backend-sage-eight.vercel.app/api/cart/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    console.log('Cart data:', data);
    this.cart = data.items; // Directly store items without grouping
  } catch (error) {
    console.error('Failed to load cart:', error);
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
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ productId, quantity })
        });
        if (!response.ok) throw new Error('Failed to update cart quantity');
        this.loadCart(); // Refresh cart after updating quantity
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
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ productId })
        });
        if (!response.ok) throw new Error('Failed to remove item from cart');
        this.loadCart(); // Refresh cart after removing item
      } catch (error) {
        console.error('Failed to remove item from cart:', error);
      }
    },
  },
};
</script>











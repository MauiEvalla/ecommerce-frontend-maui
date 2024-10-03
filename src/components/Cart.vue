<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-semibold mb-6">Your Cart</h1>

    <!-- Cart Items with Merchant (Shop) Name -->
    <div v-if="cart.length > 0">
      <div v-for="shop in shops" :key="shop.name" class="mb-8">
        <!-- Shop Name (Merchant) -->
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold">{{ shop.name }}</h2>
          <hr class="flex-grow border-t border-gray-300 ml-4" />
        </div>

        <!-- Cart Items -->
        <div v-for="item in shop.items" :key="item._id" class="bg-white shadow-md rounded-lg p-4 flex flex-col md:flex-row items-center space-x-4 mb-6">
          <!-- Product Image (Responsive) -->
          <img :src="item.image" alt="Product Image" class="w-full md:w-1/3 h-40 object-cover rounded-md" />

          <!-- Product Details (Responsive) -->
          <div class="flex-1 md:ml-4">
            <h3 class="text-lg font-semibold">{{ item.name }}</h3>
            <p class="text-gray-500">Price: ₱{{ item.price.toFixed(2) }}</p>

            <!-- Quantity Control -->
            <div class="flex items-center mt-2">
              <button @click="updateQuantity(item._id, 'decrease')" class="px-3 py-1 bg-gray-300 text-gray-700 rounded-l">
                -
              </button>
              <input type="text" v-model="item.quantity" class="w-12 text-center border border-gray-300 focus:outline-none mx-2" readonly />
              <button @click="updateQuantity(item._id, 'increase')" class="px-3 py-1 bg-gray-300 text-gray-700 rounded-r">
                +
              </button>
            </div>
          </div>

          <!-- Remove Button -->
          <button @click="removeFromCart(item._id)" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 self-end md:self-start">
            Remove
          </button>
        </div>
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
      shops: [],
    };
  },
  computed: {
    totalPrice() {
      return this.cart.reduce((total, item) => total + item.price * item.quantity, 0);
    },
  },
  created() {
    this.loadCart();
  },
  methods: {
    loadCart() {
      const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
      this.cart = cartItems;
      this.groupItemsByShop(cartItems);
    },
    groupItemsByShop(cartItems) {
      const shopGroups = {};
      cartItems.forEach((item) => {
        if (!shopGroups[item.shopName]) {
          shopGroups[item.shopName] = [];
        }
        shopGroups[item.shopName].push(item);
      });
      this.shops = Object.keys(shopGroups).map((name) => ({
        name,
        items: shopGroups[name],
      }));
    },
    updateQuantity(productId, action) {
      const cart = this.cart.map((item) => {
        if (item._id === productId) {
          if (action === 'increase') {
            item.quantity += 1;
          } else if (action === 'decrease' && item.quantity > 1) {
            item.quantity -= 1;
          }
        }
        return item;
      });
      localStorage.setItem('cart', JSON.stringify(cart));
      this.loadCart();
    },
    removeFromCart(productId) {
      const cart = this.cart.filter((item) => item._id !== productId);
      localStorage.setItem('cart', JSON.stringify(cart));
      this.loadCart();
    },
  },
};
</script>
<template>
  <div class="cart">
    <h1>Your Cart</h1>
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <div v-if="cartItems.length === 0" class="empty-cart">
        Your cart is empty.
      </div>
      <div v-else class="cart-items">
        <div v-for="item in cartItems" :key="item._id" class="cart-item">
          <img :src="item.productId.image" alt="Product Image" class="product-image" />
          <div class="details">
            <h2>{{ item.productName }}</h2>
            <p>Price: ₱{{ item.productId.price }}</p>
            <p>Quantity: {{ item.quantity }}</p>
            <div class="actions">
              <button @click="updateQuantity(item.productId._id, 'increase')">+</button>
              <button @click="updateQuantity(item.productId._id, 'decrease')">-</button>
              <button @click="removeItem(item.productId._id)">Remove</button>
            </div>
          </div>
        </div>
      </div>
      <button @click="clearCart" class="clear-cart">Clear Cart</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Cart",
  data() {
    return {
      cartItems: [],
      loading: true,
      error: null,
    };
  },
  methods: {
    async fetchCart() {
      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          "https://ecommerce-backend-sage-eight.vercel.app/api/cart",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        this.cartItems = response.data.items;
      } catch (error) {
        console.error("Error fetching cart:", error);
        this.error = "Failed to load your cart. Please try again later.";
      } finally {
        this.loading = false;
      }
    },
    async updateQuantity(productId, action) {
  try {
    console.log("Updating quantity for product:", productId, "Action:", action); // Add logs to verify
    const token = localStorage.getItem("authToken");
    await axios.put(
      "https://ecommerce-backend-sage-eight.vercel.app/api/cart/quantity-item-cart",
      { productId, action },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    this.fetchCart(); // Refresh cart after update
  } catch (error) {
    console.error("Error updating quantity:", error);
    this.error = "Failed to update quantity. Please try again.";
  }
},
    async removeItem(productId) {
      try {
        const token = localStorage.getItem("authToken");
        await axios.delete(
          "https://ecommerce-backend-sage-eight.vercel.app/api/cart/removeItemFromCart",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            data: { productId },
          }
        );
        this.fetchCart(); // Refresh cart after removal
      } catch (error) {
        console.error("Error removing item:", error);
        this.error = "Failed to remove item. Please try again.";
      }
    },
    async clearCart() {
      try {
        const token = localStorage.getItem("authToken");
        await axios.delete(
          "https://ecommerce-backend-sage-eight.vercel.app/api/cart/clearCart",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        this.fetchCart(); // Refresh cart after clearing
      } catch (error) {
        console.error("Error clearing cart:", error);
        this.error = "Failed to clear the cart. Please try again.";
      }
    },
  },
  mounted() {
    this.fetchCart();
  },
};
</script>

<style scoped>
.cart {
  padding: 20px;
  font-family: Arial, sans-serif;
}

.loading,
.error,
.empty-cart {
  text-align: center;
  margin-top: 20px;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 20px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
}

.product-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 10px;
}

.details h2 {
  margin: 0;
  font-size: 18px;
}

.details p {
  margin: 5px 0;
  font-size: 16px;
}

.actions button {
  margin: 5px;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.actions button:hover {
  background-color: #ddd;
}

.clear-cart {
  margin-top: 20px;
  padding: 10px 20px;
  border: none;
  background-color: red;
  color: white;
  border-radius: 5px;
  cursor: pointer;
}

.clear-cart:hover {
  background-color: darkred;
}
</style>

<template>
  <div class="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-lg">
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
    <!-- Display Product Details -->
    <div v-if="product">
      <!-- Product Image -->
      <img
        :src="product.image"
        alt="Product Image"
        class="w-full h-64 object-cover rounded-md mb-4"
      />
      <!-- Product Information -->
      <div class="flex flex-col sm:flex-row justify-between">
        <div class="flex-grow">
          <h1 class="text-3xl font-bold text-gray-800 mb-2">{{ product.name }}</h1>
          <p class="text-xl font-bold text-orange-600 mb-4">Price: ${{ product.price.toFixed(2) }}</p>
          <p class="text-gray-700 mb-2">{{ product.description }}</p>
          <p class="text-sm text-gray-500 mb-2">Quantity: {{ product.quantity }}</p>
          <p class="text-sm text-gray-500 mb-2">Weight: {{ product.weight }} kg</p>
          <p class="text-sm text-gray-500 mb-2">Location: {{ product.location }}</p>
        </div>
        <div class="text-center sm:text-right mt-4 sm:mt-0"></div>
      </div>

      <!-- Merchant Information -->
      <div v-if="merchant" class="mt-6 bg-gray-100 p-4 rounded-lg">
        <h2 class="text-xl font-semibold text-gray-800">Seller Information</h2>
        <p class="text-gray-700"><strong>Store Name:</strong> {{ merchant.storeName }}</p>
        <p class="text-gray-700"><strong>Mobile Number:</strong> {{ merchant.mobileNo }}</p>
        <p class="text-gray-700"><strong>Email:</strong> {{ merchant.email }}</p>
      </div>
  <!-- Rating/Comment Section -->
  <div class="mt-6">
    <h2 class="text-xl font-semibold text-gray-800">Ratings and Comments</h2>
    
    <!-- Existing Reviews -->
    <div v-if="reviews.length" class="bg-gray-100 p-4 rounded-lg mt-4">
      <div v-for="review in reviews" :key="review._id" class="mb-6">
        <p class="text-gray-700"><strong>{{ review.user_id.email }}:</strong></p>
        <p class="text-sm text-gray-600">Rating: {{ review.rating }}/5</p>
        <p class="text-sm text-gray-600">{{ review.comment }}</p>
        <p class="text-xs text-gray-400">{{ new Date(review.createdAt).toLocaleString() }}</p>
        <!-- Option to Delete or Edit Review (only for the user who posted it) -->
        <div v-if="isUserReview(review)" class="mt-2">
          <button @click="editReview(review)" class="text-blue-500">Edit</button>
          <button @click="deleteReview(review._id)" class="text-red-500 ml-4">Delete</button>
        </div>
      </div>
    </div>
    <div v-else class="text-gray-700 mb-4">No comments or ratings available yet.</div>

    <!-- Leave a Comment or Rating -->
    <div class="mt-6 bg-gray-100 p-4 rounded-lg">
      <h3 class="text-lg font-semibold text-gray-800">Leave a Comment or Rating</h3>
      <form @submit.prevent="submitReview">
        <div class="mb-4">
          <label for="rating" class="block text-sm font-medium text-gray-700">Rating (1-5)</label>
          <input
            v-model.number="newReview.rating"
            type="number"
            min="1"
            max="5"
            id="rating"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div class="mb-4">
          <label for="comment" class="block text-sm font-medium text-gray-700">Comment</label>
          <textarea
            v-model="newReview.comment"
            id="comment"
            rows="3"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          ></textarea>
        </div>
        <button
          type="submit"
          class="px-4 py-2 bg-orange-400 text-white rounded-lg hover:bg-blue-600"
        >
          Submit Review
        </button>
      </form>
    </div>
  </div>
</div>

    <!-- Recommended Products Section -->
    <div v-if="recommendedProducts.length" class="mt-10">
      <h2 class="text-2xl font-semibold text-gray-800 mb-4">Recommended Products</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="recommendedProduct in recommendedProducts"
          :key="recommendedProduct._id"
          class="bg-white p-4 rounded-lg shadow-md flex flex-col"
        >
          <img
            :src="recommendedProduct.image"
            alt="Recommended Product Image"
            class="w-full h-40 object-cover rounded-md mb-4"
          />
          <h3 class="text-lg font-semibold text-gray-800">{{ recommendedProduct.name }}</h3>
          <p class="text-sm text-gray-600 mb-2">Price: ${{ recommendedProduct.price.toFixed(2) }}</p>
          <button
            class="mt-auto bg-orange-400 text-white px-3 py-2 rounded-lg hover:bg-green-600"
            @click="goToProductDetails(recommendedProduct._id)"
          >
            View Details
          </button>
        </div>
      </div>
    </div>

    <!-- Loading and Error States -->
    <div v-if="loading" class="text-center mt-4">Loading...</div>
    <div v-if="!loading && !product" class="text-center text-lg text-red-500 mt-4">Product not found.</div>
  </div>
  <NavBar />
</template>

<script>
import HeaderBar from '@/components/Header/header.vue';
import NavBar from '@/components/Navbar/Navbar.vue';

export default {
  components: {
    HeaderBar,
    NavBar,
  },
  data() {
    return {
      product: null,
      merchant: null,
      recommendedProducts: [],
      reviews: [], // For storing product reviews
      newReview: {
        rating: null,
        comment: '',
      },
      loading: true,
    };
  },
  created() {
    this.fetchProductDetails(this.$route.params.id);
    this.fetchRecommendedProducts();
    this.fetchReviews(this.$route.params.id); // Fetch reviews for the product
  },
  watch: {
    '$route.params.id': {
      immediate: true,
      handler(newId) {
        this.fetchProductDetails(newId);
        this.fetchRecommendedProducts();
        this.fetchReviews(newId); // Refetch reviews when product changes
      },
    },
  },
  methods: {
    async fetchProductDetails(id) {
      this.loading = true;
      try {
        const response = await fetch(`https://ecommerce-backend-sage-eight.vercel.app/api/product/${id}`);
        const data = await response.json();
        this.product = data;

        if (data.merchant_id) {
          await this.fetchMerchantDetails(data.merchant_id);
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        this.loading = false;
      }
    },
    async fetchReviews(productId) {
      try {
        const response = await fetch(`https://ecommerce-backend-sage-eight.vercel.app/api/reviews/${productId}`);
        const data = await response.json();
        this.reviews = data;
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    },
    async submitReview() {
      try {
        const response = await fetch('https://ecommerce-backend-sage-eight.vercel.app/api/reviews', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Include authorization token for the logged-in user
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
          body: JSON.stringify({
            product_id: this.product._id,
            rating: this.newReview.rating,
            comment: this.newReview.comment,
          }),
        });

        if (!response.ok) throw new Error('Failed to submit review');
        const review = await response.json();
        this.reviews.push(review);
        this.newReview.rating = null;
        this.newReview.comment = '';
      } catch (error) {
        console.error('Error submitting review:', error);
      }
    },
    isUserReview(review) {
      // Check if the review belongs to the logged-in user
      const userId = localStorage.getItem('userId'); // Assuming user id is stored in localStorage
      return review.user_id._id === userId;
    },
    async deleteReview(reviewId) {
      try {
        await fetch(`https://ecommerce-backend-sage-eight.vercel.app/api/reviews/${reviewId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        this.reviews = this.reviews.filter(review => review._id !== reviewId);
      } catch (error) {
        console.error('Error deleting review:', error);
      }
    },
    async fetchRecommendedProducts() {
  try {
    const response = await fetch('https://ecommerce-backend-sage-eight.vercel.app/api/product/');
    const data = await response.json();
    // Filter out the current product from recommended products
    this.recommendedProducts = data.allProduct
      .filter((item) => item._id !== this.$route.params.id)
      .slice(0, 4); // Display 4 recommended products
  } catch (error) {
    console.error('Error fetching recommended products:', error);
  }
},
    goToProductDetails(productId) {
      this.$router.push({ name: 'ProductDetails', params: { id: productId } });
    },
  },
};
</script>

<style scoped>
@media (max-width: 640px) {
  .product-info {
    flex-direction: column;
  }
}
</style>

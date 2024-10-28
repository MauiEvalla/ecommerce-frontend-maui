<template>
  <div class="max-w-2xl mx-auto mt-10 mb-20 p-8 shadow-lg rounded-lg" :class="{'bg-[#FAFAFA]': true}">
    <h1 class="text-3xl font-extrabold text-center text-gray-800 mb-8">Add New Product</h1>
    <form @submit.prevent="submitProduct" class="space-y-6">
      <!-- Product Name -->
      <div>
        <label class="block text-gray-600 font-semibold mb-1" for="name">Product Name</label>
        <input
          v-model="name"
          type="text"
          id="name"
          placeholder="Enter product name"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          required
        />
      </div>

      <!-- Product Price -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label class="block text-gray-600 font-semibold mb-1" for="price">Price</label>
          <input
          v-model="formattedPrice"
          type="text"
          id="price"
          placeholder="0.00"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          @focus="addDecimal"
          @blur="formatPrice"
          required
        />
        
        </div>

        <!-- Product Description -->
        <div>
          <label class="block text-gray-600 font-semibold mb-1" for="name">Description</label>
          <input
            v-model="description"
            type="textbox"
            id="description"
            placeholder="Enter product description"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            required
          />
        </div>

        <!-- Product Quantity -->
        <div>
          <label class="block text-gray-600 font-semibold mb-1" for="quantity">Quantity</label>
          <input
            v-model="quantity"
            type="number"
            id="quantity"
            placeholder="Enter product quantity"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            required
          />
        </div>
      </div>

      <!-- Product Location -->
      <div>
        <label class="block text-gray-600 font-semibold mb-1" for="location">Location</label>
        <input
          v-model="location"
          type="text"
          id="location"
          placeholder="Enter product location"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
        />
      </div>

      <!-- Product Weight -->
      <div>
        <label class="block text-gray-600 font-semibold mb-1" for="weight">Weight (kg)</label>
        <input
          v-model.number="weight"
          type="number"
          step="0.01"
          id="weight"
          placeholder="Enter product weight"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          required
        />
      </div>

      <!-- Category Dropdown -->
      <div>
        <label class="block text-gray-600 font-semibold mb-1" for="category">Category</label>
        <select v-model="category" id="category" class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" required>
          <option v-for="cat in categories" :key="cat._id" :value="cat._id">
            {{ cat.categoryName }}
          </option>
        </select>
      </div>

      <!-- Product Image Upload -->
      <div>
        <label class="block text-gray-600 font-semibold mb-1" for="imageFile">Upload Image</label>
        <input
          type="file"
          id="imageFile"
          @change="handleImageUpload"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
        />
      </div>

      <!-- Submit Button -->
      <div class="text-center">
        <button type="submit" class="w-full sm:w-auto bg-orange-400 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-600 transition-all duration-200">
          Add Product
        </button>
      </div>
    </form>
  </div>
  <AdminNavbar />
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import AdminNavbar from '@/components/Navbar/AdminNavbar.vue';

export default {
  components: {
    AdminNavbar,
  },
  data() {
    return {
      name: '',
      price: '',
      description: '',
      quantity: '',
      location: '',
      weight: '',
      category: '', // Store the selected category ID
      categories: [], // List of categories to populate the dropdown
      imageFile: null, // For storing the uploaded file
      image: '', // For storing the Cloudinary image URL
      merchant_id: '6639ff906c580f20fc7db649', // Default merchant ID
      inStock: true, // Default value for inStock
    };
  },
  computed: {
  formattedPrice: {
    get() {
      return this.price;
    },
    set(value) {
      this.price = value;
    },
  },
},
  methods: {
    async fetchCategories() {
      try {
        const response = await axios.get('https://ecommerce-backend-sage-eight.vercel.app/api/category/');
        this.categories = response.data.allCategories;
      } catch (error) {
        console.error('Error fetching categories:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch categories.',
        });
      }
    },
    handleImageUpload(event) {
      this.imageFile = event.target.files[0];
    },
    addDecimal() {
    // This ensures that the input doesn't start empty
    if (this.price === '' || this.price === '0.00') {
      this.price = ''; // Clear when focusing to allow the user to type freely
    }
  },
  formatPrice() {
    // This method will be triggered when the user stops typing (on blur)
    if (this.price === '' || isNaN(parseFloat(this.price))) {
      this.price = '0.00'; // If empty or invalid, reset to 0.00
    } else {
      this.price = parseFloat(this.price).toFixed(2); // Format properly
    }
  },
    async uploadImageToCloudinary() {
      const formData = new FormData();
      formData.append('file', this.imageFile);
      formData.append('upload_preset', 'axi8zrvx');
      formData.append('folder', 'item-ecommerce');

      try {
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/dmebtqdqc/image/upload`,
          formData
        );
        return response.data.secure_url;
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to upload image to Cloudinary.',
        });
        throw error;
      }
    },
    async submitProduct() {
      try {
        const imageUrl = await this.uploadImageToCloudinary();

        const product = {
          name: this.name,
          price: this.price,
          description: this.description,
          quantity: this.quantity,
          location: this.location,
          weight: this.weight,
          image: imageUrl,
          categoryId: this.category,
          merchant_id: this.merchant_id,
          inStock: this.inStock,
        };

        const response = await fetch('https://ecommerce-backend-sage-eight.vercel.app/api/product/addProduct', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(product),
        });

        const data = await response.json();
        if (response.ok) {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: data.message || 'Product successfully added!',
          });
          this.resetForm();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: data.message || 'Failed to add product',
          });
        }
      } catch (error) {
        console.error('Error adding product:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred while adding the product.',
        });
      }
    },
    resetForm() {
      this.name = '';
      this.price = '';
      this.description = '';
      this.quantity = '';
      this.location = '';
      this.weight = '';
      this.category = '';
      this.imageFile = null;
      this.image = '';
    },
  },
  mounted() {
    this.fetchCategories();
  },
};
</script>

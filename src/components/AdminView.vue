<template>
    <div class="max-w-7xl  mx-auto p-4" :class="{'bg-[#FAFAFA]': true}">
      <h1 class="text-3xl font-bold text-center mb-6">Admin View</h1>
  
      <div v-if="loading" class="text-center text-lg font-semibold text-gray-600">Loading...</div>
  
      <div v-if="!loading && products.length === 0" class="text-center text-lg font-semibold text-gray-600">
        No products available.
      </div>
  
      <div v-if="!loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"> 
        <div v-for="product in products" :key="product._id" class="bg-white p-6 rounded-lg shadow-md flex flex-col">
          <img v-if="product.image" :src="product.image" alt="Product Image" class="w-full h-48 object-cover rounded-md mb-4" />
          <div class="flex-grow">
            <h2 class="text-xl font-semibold mb-2">{{ product.name }}</h2>
            <p class="text-lg text-gray-700 mb-2">Price: ${{ product.price }}</p>
            <p class="text-gray-600 mb-2">{{ product.description }}</p>
            <p class="text-gray-600">Quantity: {{ product.quantity }}</p>
          </div>
          <div class="mt-4 flex justify-between">
            <button class="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600" @click="openEditModal(product)">
              Edit
            </button>
            <button class="bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-600" @click="deleteProduct(product._id)">
              Delete
            </button>
          </div>
        </div>
      </div>
  
      <!-- Edit Modal -->
      <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div class="bg-white p-6 rounded-lg w-full max-w-lg">
          <h2 class="text-xl font-bold mb-4">Edit Product</h2>
          <form @submit.prevent="editProduct" class="space-y-4">
            <label class="block">
              Name:
              <input type="text" v-model="selectedProduct.name" class="w-full border rounded py-2 px-3 mt-1"/>
            </label>
            <label class="block">
              Price:
              <input type="number" v-model="selectedProduct.price" class="w-full border rounded py-2 px-3 mt-1"/>
            </label>
            <label class="block">
              Description:
              <textarea v-model="selectedProduct.description" class="w-full border rounded py-2 px-3 mt-1"></textarea>
            </label>
            <label class="block">
              Quantity:
              <input type="number" v-model="selectedProduct.quantity" class="w-full border rounded py-2 px-3 mt-1"/>
            </label>
            <div class="flex justify-end space-x-4">
              <button type="submit" class="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
                Save
              </button>
              <button type="button" class="bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-600" @click="closeEditModal">
                Close
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <AdminNavbar />
  </template>
  
  <script>
  import Swal from 'sweetalert2';
  import AdminNavbar from '@/components/Navbar/AdminNavbar.vue';

  
  export default {
    components:{
      AdminNavbar,
    },
    data() {
      return {
        products: [],
        loading: true,
        showEditModal: false,
        selectedProduct: null,  // The product being edited
      };
    },
    async created() {
      await this.fetchProducts();
    },
    methods: {
      async fetchProducts() { //FETCH ALL PRODUCTS
        try {
          const response = await fetch('https://ecommerce-backend-sage-eight.vercel.app/api/product');
          const data = await response.json();
          this.products = data.allProduct;
        } catch (error) {
          console.error('Error fetching products:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'An error occurred while fetching products',
          });
        } finally {
          this.loading = false;
        }
      },
      async deleteProduct(id) { //DELETE PRODUCT
        try {
          const response = await fetch(`https://ecommerce-backend-sage-eight.vercel.app/api/product/delete/${id}`, {
            method: 'DELETE',
          });
          const data = await response.json();
          if (data.message === "Product Deleted") { //IF DATA REPLIES BACK WITH DELETED
            this.products = this.products.filter(product => product._id !== id);
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Product deleted successfully',
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to delete product',
            });
          }
        } catch (error) {
          console.error('Error deleting product:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'An error occurred while deleting the product',
          });
        }
      },
      openEditModal(product) { //EDIT PRODUCT MODAL
        this.selectedProduct = { ...product };  // Clone the product to prevent immediate changes
        this.showEditModal = true;
      },
      closeEditModal() { //EDIT PRODUCT MODAL
        this.showEditModal = false;
        this.selectedProduct = null;
      },
      async editProduct() {  //EDIT PRODUCT
        try {
          const response = await fetch(`https://ecommerce-backend-sage-eight.vercel.app/api/product/update/${this.selectedProduct._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.selectedProduct),
          });
          const updatedProduct = await response.json();
          this.products = this.products.map(product =>
            product._id === updatedProduct._id ? updatedProduct : product
          );
          this.closeEditModal();
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Product updated successfully',
          });
        } catch (error) {
          console.error('Error updating product:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'An error occurred while updating the product',
          });
        }
      },
    },
  };
  </script>
  
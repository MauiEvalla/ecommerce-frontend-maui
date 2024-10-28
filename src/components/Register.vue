<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
      <h1 class="text-2xl font-semibold mb-6 text-center text-gray-800">Register</h1>
      <form @submit.prevent="registerUser">
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700">Email:</label>
          <input 
            v-model="user.email" 
            type="email" 
            id="email" 
            required 
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div class="mb-4">
          <label for="password" class="block text-sm font-medium text-gray-700">Password:</label>
          <input 
            v-model="user.password" 
            type="password" 
            id="password" 
            required 
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div class="mb-4">
          <label for="firstName" class="block text-sm font-medium text-gray-700">First Name:</label>
          <input 
            v-model="user.firstName" 
            type="text" 
            id="firstName" 
            required 
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div class="mb-4">
          <label for="middleName" class="block text-sm font-medium text-gray-700">Middle Name:</label>
          <input 
            v-model="user.middleName" 
            type="text" 
            id="middleName" 
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div class="mb-4">
          <label for="lastName" class="block text-sm font-medium text-gray-700">Last Name:</label>
          <input 
            v-model="user.lastName" 
            type="text" 
            id="lastName" 
            required 
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div class="mb-4">
          <label for="mobileNo" class="block text-sm font-medium text-gray-700">Mobile No:</label>
          <input 
            v-model="user.mobileNo" 
            type="text" 
            id="mobileNo" 
            required 
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div class="mb-6">
          <label for="role" class="block text-sm font-medium text-gray-700">Role:</label>
          <select 
            v-model="user.role" 
            id="role" 
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="user">User</option>
            <option value="merchant">Merchant</option>
          </select>
        </div>

        <button 
          type="submit" 
          class="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Register
        </button>
      </form>

      <div v-if="errorMessage" class="mt-4 text-red-500 text-sm">
        {{ errorMessage }}
      </div>

      <div v-if="successMessage" class="mt-4 text-green-500 text-sm">
        {{ successMessage }}
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      user: {
        email: "",
        password: "",
        firstName: "",
        middleName: "",
        lastName: "",
        mobileNo: "",
        role: "user", // Default role
      },
      errorMessage: "",
      successMessage: "",
    };
  },
  methods: {
    async registerUser() {
      try {
        const response = await axios.post("https://ecommerce-backend-sage-eight.vercel.app/api/user/register", this.user);
        this.successMessage = response.data.message;
        this.errorMessage = ""; // Clear any previous errors
      } catch (error) {
        this.errorMessage = error.response?.data?.message || "An error occurred";
        this.successMessage = ""; // Clear success message on error
      }
    },
  },
};
</script>

<style scoped>
</style>

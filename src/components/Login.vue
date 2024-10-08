<template>
    <div class="min-h-screen flex flex-col justify-center items-center">
      <div class="w-full max-w-xs">
        <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" @submit.prevent="handleLogin">
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
              Email
            </label>
            <input
              v-model="email"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="text"
              placeholder="Email"
            />
          </div>
          <div class="mb-6">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
              Password
            </label>
            <input
              v-model="password"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Password"
            />
          </div>
          <div class="flex items-center justify-between">
            <button
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Login
            </button>
          </div>
          <p v-if="errorMessage" class="text-red-500 text-xs italic">{{ errorMessage }}</p>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        email: "",
        password: "",
        errorMessage: "",
      };
    },
    methods: {
      async handleLogin() {
        try {
          const response = await axios.post("http://localhost:8000/api/user/login", {
            email: this.email,
            password: this.password,
          });
          const token = response.data.token;
          // Save the token to local storage or cookies
          localStorage.setItem("authToken", token);
          // Redirect to another page after login
          this.$router.push("/dashboard");
        } catch (error) {
          this.errorMessage = error.response.data.message || "Login failed";
        }
      },
    },
  };
  </script>
  
  <style scoped>
  /* Add any styles you want */
  </style>
  
<template>
  <div class="min-h-screen py-6 px-1 sm:flex sm:justify-center sm:items-center">
    <div class="grid mt-26 sm:mt-0 items-center gap-4 max-w-md w-full">
      <div class="flex flex-col justify-center mt-28">
        <span
          class="text-amber-700 self-center text-3xl font-extrabold whitespace-nowrap dark:text-white"
          style="font-family: poppins"
        >
          Loyalty Linx
        </span>

        <form @submit.prevent="handleLogin" class="flex flex-col mt-12 w-80 mx-auto">
          <label for="email" class="block mb-1 text-sm font-small text-gray-700">
            Email
          </label>
          <input
            v-model="email"
            type="email"
            id="email"
            class="w-full p-1 border border-gray-100 rounded-sm bg-white"
            placeholder="Email"
          />

          <label for="password" class="block mt-4 mb-1 text-sm font-small text-gray-700">
            Password
          </label>
          <input
            v-model="password"
            type="password"
            id="password"
            class="w-full p-1 border border-gray-100 rounded-sm bg-white"
            placeholder="Password"
          />

          <p v-if="errorMessage" class="text-red-500 mt-4 text-xs">
            {{ errorMessage }}
          </p>
          <br />

          <button
            type="submit"
            class="bg-amber-500 text-white py-2 px-4 rounded-md cursor-pointer hover:bg-amber-700 mt-4 w-full"
          >
            Login
          </button>

          <div class="flex items-center mt-8 justify-center">
            <label class="block text-sm font-medium text-gray-700 text-center">
              Don't have an account?
            </label>
            <a class="text-sm text-amber-500 hover:text-amber-700 ml-1" href="/register">
              Register here
            </a>
          </div>
        </form>
      </div>
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
    const response = await axios.post("https://ecommerce-backend-sage-eight.vercel.app/api/user/login", {
      email: this.email,
      password: this.password,
    });
    const token = response.data.token;
    // Save the token to local storage
    localStorage.setItem("authToken", token);
    // Redirect to the ProductList page
    this.$router.push("/home");
  } catch (error) {
    this.errorMessage = error.response?.data?.message || "Login failed";
  }
},
  },
};
</script>

<style scoped>
/* Add any custom styles if needed */
</style>

  
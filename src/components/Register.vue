<template>
    <div class="register-container">
      <h1>Register</h1>
      <form @submit.prevent="registerUser">
        <div>
          <label for="email">Email:</label>
          <input v-model="user.email" type="email" id="email" required />
        </div>
  
        <div>
          <label for="password">Password:</label>
          <input v-model="user.password" type="password" id="password" required />
        </div>
  
        <div>
          <label for="firstName">First Name:</label>
          <input v-model="user.firstName" type="text" id="firstName" required />
        </div>
  
        <div>
          <label for="middleName">Middle Name:</label>
          <input v-model="user.middleName" type="text" id="middleName" />
        </div>
  
        <div>
          <label for="lastName">Last Name:</label>
          <input v-model="user.lastName" type="text" id="lastName" required />
        </div>
  
        <div>
          <label for="mobileNo">Mobile No:</label>
          <input v-model="user.mobileNo" type="text" id="mobileNo" required />
        </div>
  
        <div>
          <label for="role">Role:</label>
          <select v-model="user.role" id="role">
            <option value="user">User</option>
            <option value="merchant">Merchant</option>
          </select>
        </div>
  
        <button type="submit">Register</button>
      </form>
  
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
  
      <div v-if="successMessage" class="success-message">
        {{ successMessage }}
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
          const response = await axios.post("http://localhost:8000/api/user/register", this.user);
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
  .register-container {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .error-message {
    color: red;
  }
  
  .success-message {
    color: green;
  }
  </style>
  
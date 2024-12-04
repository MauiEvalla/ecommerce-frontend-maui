<template>
    <div class="settings-page">
      <h1 class="text-xl font-bold mb-4">Account Settings</h1>
      <form @submit.prevent="updateUserInfo">
        <div class="mb-4">
          <label for="firstName" class="block font-semibold">First Name</label>
          <input v-model="user.firstName" type="text" id="firstName" class="input-field" required />
        </div>
  
        <div class="mb-4">
          <label for="middleName" class="block font-semibold">Middle Name</label>
          <input v-model="user.middleName" type="text" id="middleName" class="input-field" />
        </div>
  
        <div class="mb-4">
          <label for="lastName" class="block font-semibold">Last Name</label>
          <input v-model="user.lastName" type="text" id="lastName" class="input-field" required />
        </div>
  
        <div class="mb-4">
          <label for="email" class="block font-semibold">Email</label>
          <input v-model="user.email" type="email" id="email" class="input-field" required />
        </div>
  
        <div class="mb-4">
          <label for="mobileNo" class="block font-semibold">Mobile Number</label>
          <input v-model="user.mobileNo" type="text" id="mobileNo" class="input-field" required />
        </div>
  
        <div class="mb-4">
          <label for="birthdate" class="block font-semibold">Birthdate</label>
          <input v-model="user.birthdate" type="date" id="birthdate" class="input-field" />
        </div>
  
        <div class="mb-4">
          <label for="gender" class="block font-semibold">Gender</label>
          <select v-model="user.gender" id="gender" class="input-field">
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
  
        <div class="mb-4">
          <label for="profilePic" class="block font-semibold">Profile Picture</label>
          <input type="file" @change="onFileChange" id="profilePic" class="input-field" />
          <img v-if="previewImage" :src="previewImage" alt="Preview" class="w-20 h-20 mt-2" />
        </div>
  
        <div class="mb-4">
          <label for="address" class="block font-semibold">Address</label>
          <input v-model="user.fullAddress.address" type="text" id="address" class="input-field" />
        </div>
  
        <div class="mb-4">
          <label for="city" class="block font-semibold">City</label>
          <input v-model="user.fullAddress.city" type="text" id="city" class="input-field" />
        </div>
  
        <div class="mb-4">
          <label for="province" class="block font-semibold">Province</label>
          <input v-model="user.fullAddress.province" type="text" id="province" class="input-field" />
        </div>
  
        <div class="mb-4">
          <label for="country" class="block font-semibold">Country</label>
          <input v-model="user.fullAddress.country" type="text" id="country" class="input-field" />
        </div>
  
        <div class="mb-4">
          <label for="postalCode" class="block font-semibold">Postal Code</label>
          <input v-model="user.fullAddress.postalCode" type="text" id="postalCode" class="input-field" />
        </div>
  
        <button type="submit" class="btn-save">Save Changes</button>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        user: {
          firstName: '',
          middleName: '',
          lastName: '',
          email: '',
          mobileNo: '',
          birthdate: '',
          gender: '',
          fullAddress: {
            address: '',
            city: '',
            province: '',
            country: 'Philippines',
            postalCode: '',
          },
        },
        profilePicFile: null,
        previewImage: null,
      };
    },
    methods: {
      onFileChange(event) {
        const file = event.target.files[0];
        this.profilePicFile = file;
  
        // Preview image
        this.previewImage = URL.createObjectURL(file);
      },
      async updateUserInfo() {
        try {
          const formData = new FormData();
          formData.append('firstName', this.user.firstName);
          formData.append('middleName', this.user.middleName);
          formData.append('lastName', this.user.lastName);
          formData.append('email', this.user.email);
          formData.append('mobileNo', this.user.mobileNo);
          formData.append('birthdate', this.user.birthdate);
          formData.append('gender', this.user.gender);
  
          // Address fields
          formData.append('fullAddress[address]', this.user.fullAddress.address);
          formData.append('fullAddress[city]', this.user.fullAddress.city);
          formData.append('fullAddress[province]', this.user.fullAddress.province);
          formData.append('fullAddress[country]', this.user.fullAddress.country);
          formData.append('fullAddress[postalCode]', this.user.fullAddress.postalCode);
  
          if (this.profilePicFile) {
            formData.append('profilePic', this.profilePicFile);
          }
  
          // Assuming `userId` is available in a global state or through a prop.
          const userId = this.$route.params.id;
  
          await axios.put(`/users/${userId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
  
          alert('User information updated successfully');
        } catch (error) {
          console.error('Error updating user:', error);
          alert('Failed to update user information');
        }
      },
    },
    mounted() {
      this.fetchUserData();
    },
    async fetchUserData() {
      const userId = this.$route.params.id;
      try {
        const response = await axios.get(`/users/${userId}`);
        this.user = response.data.user;
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    },
  };
  </script>
  
  <style scoped>
  .input-field {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  .btn-save {
    background-color: #4caf50;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  .btn-save:hover {
    background-color: #45a049;
  }
  </style>
  
import { createRouter, createWebHistory } from 'vue-router';
import ProductList from '../components/ProductList.vue';
import AddProduct from '../components/AddProduct.vue';
import AdminView from '../components/AdminView.vue';
import ProductDetails from '../components/ProductDetails.vue';
import Cart from '../components/Cart.vue'; 
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';
import AccountDashboard from '../components/User/AccountDashboard.vue';
import MyOrders from '../components/User/MyOrders.vue';
import MyWishlist from '../components/User/MyWishlist.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: ProductList
  },
  {
    path: '/AddProduct',
    name: 'AddProduct',
    component: AddProduct
  },
  {
    path: '/AdminView',
    name: 'AdminView',
    component: AdminView
  },
  {
    path: '/product/:id',
    name: 'ProductDetails',
    component: ProductDetails,
    props: true,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    props: true,
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    props: true,
  },
  {
    path: '/Cart',
    name: 'Cart',
    component: Cart,
    props: true,
  },
    // New routes for Account Dashboard
    { path: '/account', 
      name: 'AccountDashboard',
       component: AccountDashboard 
    },
    { path: '/account/orders',
       name: 'MyOrders', 
       component: MyOrders
    },
    { path: '/account/wishlist', 
      name: 'MyWishlist', 
      component: MyWishlist
    },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;

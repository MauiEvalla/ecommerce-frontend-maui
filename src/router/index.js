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
    redirect: '/login', // Redirect root to login page
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
  {
    path: '/home',
    name: 'Home',
    component: ProductList, // Set ProductList as the Home component after login
    meta: { requiresAuth: true }, // Protect the home route
  },
  {
    path: '/AddProduct',
    name: 'AddProduct',
    component: AddProduct,
    meta: { requiresAuth: true }, // Protect this route
  },
  {
    path: '/AdminView',
    name: 'AdminView',
    component: AdminView,
    meta: { requiresAuth: true }, // Protect this route
  },
  {
    path: '/product/:id',
    name: 'ProductDetails',
    component: ProductDetails,
    props: true,
    meta: { requiresAuth: true }, // Protect this route
  },
  {
    path: '/Cart',
    name: 'Cart',
    component: Cart,
    props: true,
    meta: { requiresAuth: true }, // Protect this route
  },
  {
    path: '/account',
    name: 'AccountDashboard',
    component: AccountDashboard,
    meta: { requiresAuth: true }, // Protect this route
  },
  {
    path: '/account/orders',
    name: 'MyOrders',
    component: MyOrders,
    meta: { requiresAuth: true }, // Protect this route
  },
  {
    path: '/account/wishlist',
    name: 'MyWishlist',
    component: MyWishlist,
    meta: { requiresAuth: true }, // Protect this route
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard for Authentication
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('authToken'); // Check if token exists

  // Redirect to login if route requires auth and user is not authenticated
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'Login' });
  } 
  // Redirect to home if already authenticated and trying to access login/register
  else if ((to.name === 'Login' || to.name === 'Register') && isAuthenticated) {
    next({ name: 'Home' });
  } 
  else {
    next(); // Proceed to route as normal
  }
});

export default router;

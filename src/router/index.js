import { createRouter, createWebHistory } from "vue-router";
import axios from "axios";

// Import components
import ProductList from "../components/ProductList.vue";
import AddProduct from "../components/AddProduct.vue";
import AdminView from "../components/AdminView.vue";
import ProductDetails from "../components/ProductDetails.vue";
import Cart from "../components/Cart.vue";
import Login from "../components/Login.vue";
import Register from "../components/Register.vue";
import AccountDashboard from "../components/User/AccountDashboard.vue";
import MyOrders from "../components/User/MyOrders.vue";
import MyWishlist from "../components/User/MyWishlist.vue";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/home", name: "Home", component: ProductList },
  { path: "/login", name: "Login", component: Login },
  { path: "/register", name: "Register", component: Register },
  { path: "/AddProduct", name: "AddProduct", component: AddProduct, meta: { requiresAuth: true } },
  { path: "/AdminView", name: "AdminView", component: AdminView, meta: { requiresAuth: true } },
  { path: "/product/:id", name: "ProductDetails", component: ProductDetails, props: true, meta: { requiresAuth: true } },
  { path: "/Cart", name: "Cart", component: Cart, props: true, meta: { requiresAuth: true } },
  { path: "/account", name: "AccountDashboard", component: AccountDashboard, meta: { requiresAuth: true } },
  { path: "/account/orders", name: "MyOrders", component: MyOrders, meta: { requiresAuth: true } },
  { path: "/account/wishlist", name: "MyWishlist", component: MyWishlist, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Authentication Guard
// Navigation Guard for Authentication
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem("authToken");
  console.log("isAuthenticated:", isAuthenticated);

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: "Login" });
  } else if (
    (to.name === "Login" || to.name === "Register") &&
    isAuthenticated
  ) {
    next({ name: "Home" });
  } else {
    next();
  }
});

export default router;
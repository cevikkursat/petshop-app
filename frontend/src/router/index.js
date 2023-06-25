import { createRouter, createWebHistory } from "vue-router";
import BirdProductsView from "../views/Site/BirdProductsView.vue";
import CatProductsView from "../views/Site/CatProductsView.vue";
import DogProductsView from "../views/Site/DogProductsView.vue";
import FishProductsView from "../views/Site/FishProductsView.vue";
import HomeView from "../views/Site/HomeView.vue";
import PredictView from "../views/Predict/PredictView.vue";
import RegisterLoginView from "../views/Site/RegisterLoginView.vue";
import SellerPageView from "../views/Seller/SellerPageView.vue";
import CreateProductView from "../views/Seller/CreateProductView.vue";
import ListProductsView from "../views/Seller/ListProductsView.vue";
import SalesView from "../views/Seller/SalesView.vue";
import CartView from "../views/Site/CartView.vue";
import ProductView from "../views/Site/ProductView.vue";
import AccountView from "../views/User/AccountView.vue";
import AccountSettingsView from "../views/User/AccountSettingsView.vue";
import AccountAdressView from "../views/User/AccountAdressView.vue";
import SearchView from "../views/Site/SearchView.vue";
import OrdersView from "../views/User/OrdersView.vue";
import PaymentView from "../views/User/PaymentView.vue";
import SuccessView from "../views/User/SuccessView.vue";
import AdminView from "../views/Admin/AdminView.vue";
import AdminSettingsView from "../views/Admin/AdminSettingsView.vue";
import AdminUserView from "../views/Admin/AdminUserView.vue";
import AdminProductView from "../views/Admin/AdminProductView.vue";
import AdminOrderView from "../views/Admin/AdminOrderView.vue";
import ResetPasswordView from "../views/Site/ResetPasswordView.vue";
import NotFoundView from "../views/Site/NotFoundView.vue";

import * as jwt from "jose";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomeView,
    },
    {
      path: "/bird-products",
      name: "Bird",
      component: BirdProductsView,
    },
    {
      path: "/cat-products",
      name: "Cat",
      component: CatProductsView,
    },
    {
      path: "/dog-products",
      name: "Dog",
      component: DogProductsView,
    },
    {
      path: "/fish-products",
      name: "Fish",
      component: FishProductsView,
    },
    {
      path: "/predict",
      name: "Predict",
      component: PredictView,
    },
    {
      path: "/register-login",
      name: "Register-Login",
      component: RegisterLoginView,
    },
    {
      path: "/seller-page",
      name: "Seller-Page",
      component: SellerPageView,
    },
    {
      path: "/create-product-view",
      name: "Create-Product-View",
      component: CreateProductView,
    },
    {
      path: "/list-products-view",
      name: "List-Products-View",
      component: ListProductsView,
    },
    {
      path: "/sales-view",
      name: "Sales-View",
      component: SalesView,
    },
    {
      path: "/cart",
      name: "Cart",
      component: CartView,
    },
    {
      path: "/account",
      name: "Account",
      component: AccountView,
    },
    {
      path: "/account-settings",
      name: "Account-Settings",
      component: AccountSettingsView,
    },
    {
      path: "/account-address",
      name: "Account-Address",
      component: AccountAdressView,
    },
    {
      path: "/orders",
      name: "Orders",
      component: OrdersView,
    },
    {
      path: "/payment",
      name: "Payment",
      component: PaymentView,
    },
    {
      path: "/admin",
      name: "Admin",
      component: AdminView,
    },
    {
      path: "/admin-settings",
      name: "Admin-Settings",
      component: AdminSettingsView,
    },
    {
      path: "/admin-user",
      name: "Admin-User",
      component: AdminUserView,
    },
    {
      path: "/admin-product",
      name: "Admin-Product",
      component: AdminProductView,
    },
    {
      path: "/admin-order",
      name: "Admin-Order",
      component: AdminOrderView,
    },
    {
      path: "/reset-password",
      name: "Reset-Password",
      component: ResetPasswordView,
    },
    {
      path: "/payment-success/:id",
      name: "Payment-Success",
      component: SuccessView,
    },
    {
      path: "/auth/:id",
      name: "Auth",
      component: SuccessView,
    },
    {
      path: "/reset/:id",
      name: "Reset",
      component: SuccessView,
    },
    {
      path: "/product/:id",
      name: "Product",
      component: ProductView,
    },
    {
      path: "/search/:id",
      name: "Search",
      component: SearchView,
    },
    {
      path: "/:pathMatch(.*)*",
      name: "notFound",
      component: NotFoundView,
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  if (
    to.name != "Home" &&
    to.name != "Product" &&
    to.name != "Search" &&
    to.name != "Auth" &&
    to.name != "Reset" &&
    to.name != "Reset-Password" &&
    to.name != "Register-Login" &&
    to.name != "Cart" &&
    to.name != "Predict" &&
    to.name != "Bird" &&
    to.name != "Cat" &&
    to.name != "Dog" &&
    to.name != "Fish" &&
    to.name != "notFound"
  ) {
    const secret = new TextEncoder().encode(import.meta.env.VITE_JWT_SECRET);
    const token = getCookie("jwt");
    try {
      const { payload } = await jwt.jwtVerify(token, secret, {});
      if (payload) {
        if (to.name == "Seller-Page" || to.name == "Create-Product-View" || to.name == "List-Products-View" || to.name == "Sales-View") {
          if (payload.data.role == "seller") next();
          else next({ name: "Home" });
        } else if (
          to.name == "Admin" ||
          to.name == "Admin-Settings" ||
          to.name == "Admin-User" ||
          to.name == "Admin-Product" ||
          to.name == "Admin-Order"
        ) {
          if (payload.data.role == "admin") next();
          else next({ name: "Home" });
        } else if (
          to.name == "Account" ||
          to.name == "Account-Address" ||
          to.name == "Account-Settings" ||
          to.name == "Orders" ||
          to.name == "Payment" ||
          to.name == "Payment-Success"
        ) {
          if (to.name == "Payment" && from.name != "Cart") next({ name: "Cart" });
          else if (to.name == "Payment-Success" && from.name != "Payment") next({ name: "Cart" });
          else next();
        }
      }
    } catch (error) {
      next({ name: "Register-Login" });
    }
  } else {
    if (to.name == "Auth" || to.name == "Reset") {
      const secret = new TextEncoder().encode(import.meta.env.VITE_JWT_SECRET);
      const token = to.params.id.replaceAll("__", ".");
      try {
        const { payload } = await jwt.jwtVerify(token, secret, {});
        if (payload) {
          next();
        }
      } catch (error) {
        next({ name: "Home" });
      }
    } else if (to.name == "Reset-Password" || to.name == "Register-Login") {
      const secret = new TextEncoder().encode(import.meta.env.VITE_JWT_SECRET);
      const token = getCookie("jwt");
      try {
        const { payload } = await jwt.jwtVerify(token, secret, {});
        if (payload) {
          next({ name: "Home" });
        }
      } catch (error) {
        next();
      }
    } else next();
  }
});

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

export default router;

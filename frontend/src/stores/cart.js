import { defineStore } from "pinia";

export const useCart = defineStore("cart", {
  state: () => {
    return { cart: [] };
  },
  getters: {
    getCartLength() {
      return this.cart.length;
    },
    getCart() {
      return this.cart;
    },
  },
  actions: {
    getSepetteVarmi(data) {
      return this.cart.includes(data);
    },
    setDeleteCart(data) {
      for (let i = 0; i < this.cart.length; i++) {
        if (this.cart[i] === data) {
          let left = this.cart.slice(0, i);
          let right = this.cart.slice(i + 1, this.cart.length);
          this.cart = [...left, ...right];
          localStorage.setItem("myCart", this.cart.toString());
          break;
        }
      }
    },
    setDeleteALLCart() {
      this.cart = [];
      localStorage.setItem("myCart", this.cart.toString());
    },
    setCart(data) {
      this.cart.push(data);
      localStorage.setItem("myCart", this.cart.toString());
    },
    setlocalCart(data) {
      this.cart = data;
    },
  },
});

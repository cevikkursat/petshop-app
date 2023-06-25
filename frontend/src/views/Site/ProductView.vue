<template>
  <NavBar />
  <Product />
</template>

<script>
import Product from "../../components/Product/Product.vue";
import NavBar from "../../components/Site/NavBar.vue";
export default {
  components: { Product, NavBar },
};
</script>

<style scoped></style>

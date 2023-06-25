<template>
  <NavBar />
  <Orders />
</template>

<script>
import NavBar from "../../components/Site/NavBar.vue";
import Orders from "../../components/User/Orders.vue";
export default {
  components: { NavBar, Orders },
};
</script>

<style scoped></style>

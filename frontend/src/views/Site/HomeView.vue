<template>
  <NavBar />
  <main class="container-md">
    <ImageCarousel></ImageCarousel>
    <ProductCarousel productss="kopek" header="Köpek Ürünleri" />
    <ProductCarousel productss="kedi" header="Kedi Ürünleri" />
    <ProductCarousel productss="kus" header="Kuş Ürünleri" />
    <ProductCarousel productss="balik" header="Balık Ürünleri" />
  </main>
  <ScrollTop class="custom-scrolltop" />
</template>

<script>
import NavBar from "../../components/Site/NavBar.vue";
import ProductCarousel from "../../components/Product/ProductCarousel.vue";
import ImageCarousel from "../../components/Site/ImageCarousel.vue";
import ScrollTop from "primevue/scrolltop";

export default {
  components: { NavBar, ProductCarousel, ImageCarousel, ScrollTop },
};
</script>

<style scoped>
::v-deep(.custom-scrolltop) {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: dimgray;
}

::v-deep(.custom-scrolltop:hover) {
  background-color: black;
}

::v-deep(.custom-scrolltop .p-scrolltop-icon) {
  font-size: 2rem;
  color: white;
}
</style>

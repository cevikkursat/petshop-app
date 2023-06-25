<template>
  <div class="row my-5 mx-2 d-flex justify-content-center">
    <Toast />
    <div class="col-auto d-flex align-items-center" style="width: 960px">
      <v-carousel cycle hide-delimiters show-arrows="hover" style="height: 500px; border: 2px solid black; border-radius: 10px">
        <v-carousel-item v-for="(i, index) in carouselItems" :key="index">
          <img :src="`http://localhost:5000/images/adminImage/${i}`" :alt="i" style="width: 100%; aspect-ratio: 16/9; object-fit: contain" />
        </v-carousel-item>
      </v-carousel>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Toast from "primevue/toast";
export default {
  components: { Toast },
  data() {
    return {
      carouselItems: ["empty.jpg"],
    };
  },
  async beforeCreate() {
    await axios({
      method: "get",
      url: "http://localhost:5000/api/user/getcarousel",
    })
      .then((res) => {
        if (res.data.status === true) {
          this.carouselItems = res.data.carouselItems;
        } else {
          this.$toast.add({
            severity: "error",
            summary: "Hata",
            detail: res.data.message,
            life: 3000,
          });
        }
      })
      .catch((err) => {
        this.$toast.add({
          severity: "error",
          summary: "Hata",
          detail: err.toString(),
          life: 3000,
        });
      });
  },
};
</script>

<style scoped></style>

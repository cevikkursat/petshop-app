<template>
  <div class="row my-5 mx-2 d-flex justify-content-center">
    <Toast />
    <v-sheet v-if="products.length > 0" elevation="12" rounded="lg" class="p-4">
      <div class="d-flex justify-content-between align-items-center">
        <h4>{{ title }}</h4>
        <div class="text-end">
          <v-btn icon="mdi-arrow-left" size="small" class="me-2" @click="gosterilenSayfa = Math.abs((gosterilenSayfa - 1) % sayfaSayisi)"></v-btn>
          <v-btn icon="mdi-arrow-right" size="small" @click="gosterilenSayfa = Math.abs((gosterilenSayfa + 1) % sayfaSayisi)"></v-btn>
        </div>
      </div>
      <v-divider class="my-2"></v-divider>
      <v-carousel v-model="gosterilenSayfa" hide-delimiters :show-arrows="false" style="height: fit-content">
        <v-carousel-item v-for="(i, index) in sayfaSayisi" :key="index">
          <div class="row mx-2">
            <div
              class="col-12 col-sm-6 col-md-6 col-lg-4 col-xxl-3 p-1"
              v-for="item in products.slice(gosterilenSayfa * gosterilenUrunSayisi, gosterilenUrunSayisi * gosterilenSayfa + gosterilenUrunSayisi)"
              :key="item._id"
            >
              <ProductCard class="p-1 m-2">
                <template #badge v-if="item.productStatus === 'outofstock'">Stok Yok</template>
                <template #badge v-else-if="item.productDiscount">İndirim</template>
                <template #img>
                  <img
                    :src="`http://localhost:5000/images/productImage/${item.productImage[0]}`"
                    :alt="item.productName"
                    class="mb-3 img-thumbnail"
                    style="width: 200px; aspect-ratio: 1; object-fit: contain"
                  />
                </template>
                <template #firmName>{{ item.firmName }}</template>
                <template #price v-if="item.productDiscount">
                  {{ new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(item.productDiscountMoney) }}
                </template>
                <template #countedPrice>
                  {{ new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(item.productMoney) }}
                </template>
                <template #productName>{{ item.productName }}</template>
                <template #rating>
                  <v-rating v-model="item.rating" size="small" density="compact" readonly color="yellow-darken-3" half-increments></v-rating>
                  <span class="text-muted small ms-1 pt-1">{{ Math.round(item.rating * 10) / 10 }}</span>
                </template>
                <template #addCart>
                  <v-btn
                    v-if="item.productStatus === 'outofstock'"
                    disabled
                    prepend-icon="mdi-cart-plus"
                    variant="tonal"
                    @click="store.setCart(item._id)"
                  >
                    Sepete Ekle
                  </v-btn>
                  <v-btn v-else prepend-icon="mdi-cart-plus" variant="tonal" @click="store.setCart(item._id)"> Sepete Ekle </v-btn>
                </template>
                <template #productView>
                  <RouterLink :to="'/product/' + item._id">
                    <v-btn icon="mdi-eye " class="btn-action p-2">
                      <i class="mdi mdi-eye"></i>
                      <v-tooltip activator="parent" location="start">Ürünü Gör</v-tooltip>
                    </v-btn>
                  </RouterLink>
                </template>
              </ProductCard>
            </div>
          </div>
        </v-carousel-item>
      </v-carousel>
    </v-sheet>
  </div>
</template>

<script>
import Toast from "primevue/toast";
import ProductCard from "./ProductCard.vue";
import axios from "axios";
import { useCart } from "../../stores/cart.js";

export default {
  components: { ProductCard, Toast },
  props: ["productss", "header"],
  setup() {
    const store = useCart();
    return { store };
  },
  data() {
    return {
      title: this.header,
      products: [],
      urunSayisi: 0,
      gosterilenSayfa: 0,
      gosterilenUrunSayisi: 0,
      sayfaSayisi: 0,
    };
  },
  created() {
    if (this.productss === "kopek") this.urnleriGetir("köpek");
    else if (this.productss === "kedi") this.urnleriGetir("kedi");
    else if (this.productss === "kus") this.urnleriGetir("kuş");
    else if (this.productss === "balik") this.urnleriGetir("balık");
    window.addEventListener("resize", this.screenSize);
  },
  destroyed() {
    window.removeEventListener("resize", this.screenSize);
  },
  methods: {
    async urnleriGetir(tur) {
      await axios({
        method: "post",
        url: "http://localhost:5000/api/user/getProducts",
        data: {
          tur: tur,
          startsPoint: 0,
          count: 15,
        },
      })
        .then((res) => {
          if (res.data.status === true) {
            this.products = res.data.products;
            this.urunSayisi = this.products.length;
            this.screenSize();
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
    screenSize() {
      if (window.innerWidth > 1399) {
        this.sayfaSayisi = this.urunSayisi % 4 === 0 ? Math.floor(this.urunSayisi / 4) : Math.floor(this.urunSayisi / 4) + 1;
        this.gosterilenUrunSayisi = 4;
      } else if (window.innerWidth > 991) {
        this.sayfaSayisi = this.urunSayisi % 3 === 0 ? Math.floor(this.urunSayisi / 3) : Math.floor(this.urunSayisi / 3) + 1;
        this.gosterilenUrunSayisi = 3;
      } else if (window.innerWidth > 767) {
        this.sayfaSayisi = this.urunSayisi % 2 === 0 ? Math.floor(this.urunSayisi / 2) : Math.floor(this.urunSayisi / 2) + 1;
        this.gosterilenUrunSayisi = 2;
      } else if (window.innerWidth > 575) {
        this.sayfaSayisi = this.urunSayisi % 2 === 0 ? Math.floor(this.urunSayisi / 2) : Math.floor(this.urunSayisi / 2) + 1;
        this.gosterilenUrunSayisi = 2;
      } else {
        this.sayfaSayisi = this.urunSayisi;
        this.gosterilenUrunSayisi = 1;
      }
    },
  },
};
</script>

<style scoped>
.btn-action {
  background-color: rgb(151, 147, 147);
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px -1px rgba(145, 158, 171, 0.2), 0 4px 5px 0 rgba(145, 158, 171, 0.14), 0 1px 10px 0 rgba(145, 158, 171, 0.12);
  color: rgb(255, 255, 255);
  font-size: 14px;
  transition: all 0.3s ease 0s;
  width: min-content !important;
  height: min-content !important;
}
</style>

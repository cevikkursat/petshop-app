<template>
  <section class="container-xxl d-flex">
    <Toast />
    <div class="card my-5 col-12">
      <DataView v-if="products.length > 0" :value="products" :layout="layout">
        <template #header>
          <div class="d-flex justify-content-between">
            <div></div>
            <div>
              <DataViewLayoutOptions v-model="layout" />
            </div>
          </div>
        </template>

        <template #list="slotProps">
          <div class="col-12">
            <ProductCardLeft class="m-1 p-1">
              <template #badge v-if="slotProps.data.productStatus === 'outofstock'">Stok Yok</template>
              <template #badge v-else-if="slotProps.data.productDiscount">İndirim</template>
              <template #img>
                <img
                  :src="`http://localhost:5000/images/productImage/${slotProps.data.productImage[0]}`"
                  :alt="slotProps.data.productName"
                  class="rounded-3 img-thumbnail"
                  style="width: 200px; aspect-ratio: 1; object-fit: contain"
                />
              </template>
              <template #firmName>{{ slotProps.data.firmName }}</template>
              <template #price v-if="slotProps.data.productDiscount"
                >{{ new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(slotProps.data.productDiscountMoney) }}
              </template>
              <template #countedPrice
                >{{ new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(slotProps.data.productMoney) }}
              </template>
              <template #productName>{{ slotProps.data.productName }}</template>
              <template #rating>
                <v-rating v-model="slotProps.data.rating" size="small" density="compact" readonly color="yellow-darken-3" half-increments></v-rating>
                <span class="text-muted small ms-1 pt-1">{{ slotProps.data.rating }}</span>
              </template>
              <template #btns>
                <v-btn
                  v-if="slotProps.data.productStatus === 'outofstock'"
                  disabled
                  icon="mdi-cart-plus"
                  class="btn-action p-2 mb-1"
                  @click="store.setCart(slotProps.data._id)"
                >
                  <i class="mdi mdi-cart-plus"></i>
                  <v-tooltip activator="parent" location="start">Sepete Ekle</v-tooltip>
                </v-btn>
                <v-btn v-else icon="mdi-cart-plus" class="btn-action p-2 mb-1" @click="store.setCart(slotProps.data._id)">
                  <i class="mdi mdi-cart-plus"></i>
                  <v-tooltip activator="parent" location="start">Sepete Ekle</v-tooltip>
                </v-btn>
                <RouterLink :to="'/product/' + slotProps.data._id">
                  <v-btn icon="mdi-eye " class="btn-action p-2">
                    <i class="mdi mdi-eye"></i>
                    <v-tooltip activator="parent" location="start">Ürünü Gör</v-tooltip>
                  </v-btn>
                </RouterLink>
              </template>
            </ProductCardLeft>
          </div>
        </template>

        <template #grid="slotProps">
          <div class="d-inline-flex col-6 col-sm-4 col-md-3">
            <ProductCard class="p-1 m-2">
              <template #badge v-if="slotProps.data.productStatus === 'outofstock'">Stok Yok</template>
              <template #badge v-else-if="slotProps.data.productDiscount">İndirim</template>
              <template #img>
                <img
                  :src="`http://localhost:5000/images/productImage/${slotProps.data.productImage[0]}`"
                  :alt="slotProps.data.productName"
                  class="mb-3 img-thumbnail"
                  style="width: 200px; aspect-ratio: 1; object-fit: contain"
                />
              </template>
              <template #firmName>{{ slotProps.data.firmName }}</template>
              <template #price v-if="slotProps.data.productDiscount"
                >{{ new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(slotProps.data.productDiscountMoney) }}
              </template>
              <template #countedPrice
                >{{ new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(slotProps.data.productMoney) }}
              </template>
              <template #productName>{{ slotProps.data.productName }}</template>
              <template #rating>
                <v-rating v-model="slotProps.data.rating" size="small" density="compact" readonly color="yellow-darken-3" half-increments></v-rating>
                <span class="text-muted small ms-1 pt-1">{{ slotProps.data.rating }}</span>
              </template>
              <template #addCart>
                <v-btn
                  v-if="slotProps.data.productStatus === 'outofstock'"
                  disabled
                  prepend-icon="mdi-cart-plus"
                  variant="tonal"
                  @click="store.setCart(slotProps.data._id)"
                >
                  Sepete Ekle
                </v-btn>
                <v-btn v-else prepend-icon="mdi-cart-plus" variant="tonal" @click="store.setCart(slotProps.data._id)"> Sepete Ekle </v-btn>
              </template>
              <template #productView>
                <RouterLink :to="'/product/' + slotProps.data._id">
                  <v-btn icon="mdi-eye " class="btn-action p-2">
                    <i class="mdi mdi-eye"></i>
                    <v-tooltip activator="parent" location="start">Ürünü Gör</v-tooltip>
                  </v-btn>
                </RouterLink>
              </template>
            </ProductCard>
          </div>
        </template>
      </DataView>
      <div v-else class="card text-center fw-bold">
        <div class="card-body text-center fs-5 fw-semibold">Aradığınız Ürün Bulunamadı!</div>
      </div>
    </div>
  </section>
</template>

<script>
import Toast from "primevue/toast";
import axios from "axios";
import ProductCard from "./ProductCard.vue";
import ProductCardLeft from "./ProductCardLeft.vue";
import DataView from "primevue/dataview";
import DataViewLayoutOptions from "primevue/dataviewlayoutoptions";

export default {
  components: { ProductCard, ProductCardLeft, Toast, DataView, DataViewLayoutOptions },
  data() {
    return {
      products: [],
      layout: "grid",
      totalProducts: 0,
      pageNumber: 1,
      productsPerPage: 10,
      mainFilter: null,
    };
  },
  async mounted() {
    this.mainFilter = this.getCookie("searchFilter");
    if (!this.mainFilter) this.mainFilter = window.location.pathname.split("/")[2];
    this.urnleriGetir();
  },
  methods: {
    getCookie(cname) {
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
    },
    async urnleriGetir() {
      await axios({
        method: "post",
        url: "http://localhost:5000/api/user/serachproduct",
        data: {
          mainFilter: this.mainFilter,
          startsPoint: (this.pageNumber - 1) * this.productsPerPage,
          count: this.productsPerPage,
        },
      })
        .then((res) => {
          if (res.data.status === true) {
            this.products = res.data.products;
            this.totalProducts = res.data.totalProducts;
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

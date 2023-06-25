<template>
  <section class="container my-5">
    <Toast />
    <div class="card" v-if="product.length === 0">
      <div class="card-body fs-5 fw-semibold text-center">Ürün bulunamadı!</div>
    </div>
    <div class="card" v-else>
      <div class="card-body">
        <div class="row">
          <div class="col-12 col-lg-6">
            <Galleria
              :value="product.productImage"
              :numVisible="5"
              containerStyle="max-width: 640px"
              :showThumbnails="false"
              :showIndicators="true"
              :changeItemOnIndicatorHover="true"
              :showIndicatorsOnItem="true"
              indicatorsPosition="bottom"
            >
              <template #item="slotProps">
                <img
                  :src="`http://localhost:5000/images/productImage/${slotProps.item}`"
                  :alt="slotProps.item"
                  class="img-thumbnail"
                  style="width: 100%; aspect-ratio: 1; object-fit: contain"
                />
              </template>
            </Galleria>
          </div>
          <div class="col-12 col-lg-6 mt-3 mt-md-0">
            <h3>
              {{ product.productName }}
            </h3>
            <h6 class="text-muted">
              {{ product.firmName }}
            </h6>
            <div class="d-flex justify-content-between align-items-center mt-5">
              <div>
                <span class="fs-4 fw-bold">
                  {{ new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(product.productMoney) }}
                </span>
                <span v-if="product.productDiscount" class="text-decoration-line-through text-muted ms-1">
                  {{ new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(product.productDiscountMoney) }}
                </span>
              </div>
              <div class="d-flex align-items-center">
                <v-rating v-model="product.rating" density="compact" readonly color="yellow-darken-3" half-increments></v-rating>
                <span class="text-muted ms-2">{{ Math.round(product.rating * 10) / 10 }}</span>
              </div>
            </div>
            <div class="mt-5">
              <div class="fw-bold mb-3">Kategoriler:</div>
              <v-chip class="ms-3" variant="outlined" v-for="i in product.category"> {{ i }} </v-chip>
            </div>
            <div class="mt-5 d-flex" style="" :style="product.productStatus === 'outofstock' ? 'pointer-events: none; opacity: 0.4' : ''">
              <div>
                <div class="input-group mb-3">
                  <button
                    class="btn btn-outline-danger"
                    :class="adet === 1 ? 'disabled' : ''"
                    type="button"
                    @click="
                      {
                        adet = adet - 1;
                      }
                    "
                  >
                    <i class="mdi mdi-minus" />
                  </button>
                  <span class="input-group-text" id="inputGroup-sizing-sm">{{ adet }}</span>
                  <button
                    class="btn btn-outline-success"
                    type="button"
                    :class="adet === 10 ? 'disabled' : ''"
                    @click="
                      {
                        adet = adet + 1;
                      }
                    "
                  >
                    <i class="mdi mdi-plus" />
                  </button>
                </div>
              </div>
              <v-btn v-if="store.getSepetteVarmi(product._id)" class="ms-3" prepend-icon="mdi-cart-minus" variant="tonal" @click="sepettenCikar">
                Sepetten Çıkar
              </v-btn>
              <v-btn v-else class="ms-3" prepend-icon="mdi-cart-plus" variant="tonal" @click="sepeteEkle"> Sepete Ekle </v-btn>
            </div>
          </div>
        </div>
        <div class="row mt-5">
          <TabView class="tabview-custom">
            <TabPanel>
              <template #header>
                <div class="d-flex align-items-center">
                  <i class="mdi mdi-view-headline me-1"></i>
                  <span>Açıklama</span>
                </div>
              </template>
              <div v-html="product.productDesc"></div>
            </TabPanel>
            <TabPanel>
              <template #header>
                <div class="d-flex align-items-center">
                  <i class="mdi mdi-message-plus me-1"></i>
                  <span>Yorumlar</span>
                </div>
              </template>
              <section>
                <span class="card p-2 fs-5 fw-semibold" v-if="comments.length === 0">Yorum bulunmuyor!</span>
                <DataTable v-else :value="comments" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 40rem">
                  <Column :header="`Toplam ${comments.length} yorum bulunuyor.`">
                    <template #body="slotProps">
                      <div class="card">
                        <div class="card-header">
                          <div class="d-flex justify-content-between align-items-center">
                            <span class="fw-bolder fs-5">{{ slotProps.data.commentTitle }}</span>
                            <span class="text-end">
                              {{ slotProps.data.userUsername }}
                              <div class="d-flex align-items-center justify-content-end">
                                <v-rating
                                  v-model="slotProps.data.rating"
                                  density="compact"
                                  readonly
                                  color="yellow-darken-3"
                                  half-increments
                                ></v-rating>
                                {{ Math.round(slotProps.data.rating * 10) / 10 }}
                              </div>
                            </span>
                          </div>
                        </div>
                        <div class="card-body">
                          <div v-html="slotProps.data.commentText"></div>
                        </div>
                        <div class="card-footer d-flex justify-content-between">
                          <span> <span class="fw-bold">Yorum Yapılma Tarihi:</span> {{ getTime(slotProps.data.commentDate) }} </span>
                          <span> <span class="fw-bold">Satın Alma Tarihi:</span> {{ getTime(slotProps.data.commentOrderDate) }} </span>
                        </div>
                      </div>
                    </template>
                  </Column>
                </DataTable>
              </section>
            </TabPanel>
          </TabView>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Toast from "primevue/toast";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import axios from "axios";
import Galleria from "primevue/galleria";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import { useCart } from "../../stores/cart.js";
export default {
  components: { Galleria, TabView, TabPanel, DataTable, Column, Toast },
  setup() {
    const store = useCart();
    return { store };
  },
  data() {
    return {
      productID: null,
      product: [],
      comments: [],
      seller: "",
      adet: 1,
    };
  },
  mounted() {
    this.productID = document.location.pathname.split("/")[2];
    this.urunGetir();
  },
  methods: {
    getTime(time) {
      const times = new Date(time);
      return times.toLocaleString("tr-TR");
    },
    sepeteEkle() {
      for (let i = 0; i < this.adet; i++) {
        this.store.setCart(this.product._id);
      }
    },
    sepettenCikar() {
      this.store.setDeleteCart(this.product._id);
    },
    async urunGetir() {
      await axios({
        method: "post",
        url: "http://localhost:5000/api/user/getProduct",
        data: {
          id: this.productID,
        },
      })
        .then((res) => {
          if (res.data.status === true) {
            this.product = res.data.product;
            this.seller = res.data.seller;
            this.comments = res.data.productComments;
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

<style scoped></style>

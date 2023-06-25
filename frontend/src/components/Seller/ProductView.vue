<template>
  <section class="container my-5">
    {{ product[0] }}
    <div class="card">
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
                <v-rating v-model="product.rating" density="compact" readonly></v-rating>
                <span class="text-muted ms-2">{{ product.rating }}</span>
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
              <v-btn class="ms-3" prepend-icon="mdi-cart-plus" variant="tonal" @click=""> Sepete Ekle </v-btn>
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
              <div v-html="product.productDesc" class="resim"></div>
            </TabPanel>
          </TabView>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Galleria from "primevue/galleria";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
export default {
  components: { Galleria, TabView, TabPanel },
  props: ["productss"],
  data() {
    return {
      product: [],
      adet: 1,
    };
  },
  mounted() {
    this.product = this.productss[0];
  },
};
</script>

<style scoped></style>

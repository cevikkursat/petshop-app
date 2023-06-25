<template>
  <section class="m-2">
    <Toast />
    <div class="w-100">
      <div class="card p-2" v-if="products.length === 0">Ürün bulunamadı!</div>
      <v-sheet v-else elevation="12" rounded="lg" class="p-4 w-100 h-100">
        <h3>Ürün Listesi</h3>
        <div class="card p-2">
          <DataTable v-model:filters="filters" :value="products" paginator :rows="10">
            <template #header>
              <div class="w25">
                <v-text-field prepend-icon="mdi-magnify" v-model="filters['global'].value" label="Aranacak Kelime" variant="outlined"></v-text-field>
              </div>
            </template>
            <template #empty> Kullanıcı bulunmuyor. </template>
            <Column sortable header="Resim">
              <template #body="slotProps">
                <img
                  :src="`http://localhost:5000/images/productImage/${slotProps.data.product.productImage[0]}`"
                  :alt="slotProps.data.product.productImage[0]"
                  class="resim"
                />
              </template>
            </Column>
            <Column field="seller.username" sortable header="Satıcı"></Column>
            <Column field="product.productName" sortable header="Ürün Adı"></Column>
            <Column field="product.firmName" sortable header="Marka"></Column>
            <Column field="product.productMoney" sortable header="Ürün Fiyatı">
              <template #body="slotProps">
                {{ new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(slotProps.data.product.productMoney) }}
              </template>
            </Column>
            <Column field="product.productDiscountMoney" sortable header="İndirimsiz Fiyat">
              <template #body="slotProps">
                {{ new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(slotProps.data.product.productDiscountMoney) }}
              </template>
            </Column>
            <Column field="product.productDiscount" sortable header="İndirim">
              <template #body="slotProps">
                <Tag v-if="slotProps.data.product.productDiscount" value="Aktif" severity="success" />
                <Tag v-else value="İnaktif" />
              </template>
            </Column>
            <Column field="product.category" sortable header="Kategoriler">
              <template #body="slotProps">
                <v-chip v-for="(item, i) in slotProps.data.product.category" :key="i" class="m-1">
                  {{ item }}
                </v-chip>
              </template>
            </Column>
            <Column field="product.stock" sortable header="Stok">
              <template #body="slotProps"> {{ slotProps.data.product.stock }} Adet </template>
            </Column>
            <Column field="product.productStatus" sortable header="Stok Durumu">
              <template #body="slotProps">
                <Tag v-if="slotProps.data.product.productStatus == 'instock'" value="Stok Var" severity="success" />
                <Tag v-else-if="slotProps.data.product.productStatus == 'outofstock'" value="Stok Yok" severity="warning" />
              </template>
            </Column>
            <Column field="product.rating" sortable header="Rating">
              <template #body="slotProps">
                <Rating :modelValue="slotProps.data.product.rating" readonly :cancel="false" />
              </template>
            </Column>
            <Column field="product.ratingCount" sortable header="Rating Sayısı"></Column>
            <Column field="product.productStatus" sortable header="Ürün Durumu">
              <template #body="slotProps">
                <Tag v-if="slotProps.data.product.productStatus" value="Aktif" severity="success" />
                <Tag v-else value="İnaktif" severity="danger" />
              </template>
            </Column>
            <Column field="product.isActive" sortable header="Aktiflik">
              <template #body="slotProps">
                <Tag v-if="slotProps.data.product.isActive" value="Aktif" severity="success" />
                <Tag v-else value="İnaktif" severity="danger" />
              </template>
            </Column>
            <Column header="İşlemler">
              <template #body="slotProps">
                <v-tooltip :text="slotProps.data.product.isActive ? 'Ürünü İnaktif Et' : 'Ürünü Aktif Et'" location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      :icon="slotProps.data.product.isActive ? 'mdi-eye-off' : 'mdi-eye'"
                      density="compact"
                      class="m-1"
                      @click="urunAktifInaktif(slotProps.data.product._id, slotProps.data.product.isActive)"
                    >
                    </v-btn>
                  </template>
                </v-tooltip>
              </template>
            </Column>
          </DataTable>
        </div>
      </v-sheet>
    </div>
  </section>
</template>

<script>
import { FilterMatchMode } from "primevue/api";
import DataTable from "primevue/datatable";
import Rating from "primevue/rating";
import Tag from "primevue/tag";
import Column from "primevue/column";
import axios from "axios";
import Toast from "primevue/toast";
export default {
  components: { Toast, DataTable, Column, Tag, Rating },
  data() {
    return {
      filters: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      },
      visible: false,
      products: [],
    };
  },
  async mounted() {
    this.urunleriGetir();
  },
  methods: {
    async urunAktifInaktif(id, isActive) {
      await axios({
        method: "post",
        url: "http://localhost:5000/api/admin/activeInactive",
        data: {
          productID: id,
          isActive: !isActive,
          jwt: this.getCookie("jwt"),
        },
      })
        .then((res) => {
          if (res.data.status) {
            this.$toast.add({
              severity: "success",
              summary: "İşlem Başarılı",
              detail: res.data.message,
              life: 3000,
            });
            let ids = [];
            for (let i = 0; i < this.products.length; i++) {
              const element = this.products[i].product._id;
              ids.push(element);
            }
            const index = ids.indexOf(id);
            this.products[index].product.isActive = !isActive;
          } else {
            this.$toast.add({
              severity: "error",
              summary: "İşlem Başarısız",
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
    async urunleriGetir() {
      await axios({
        method: "post",
        url: "http://localhost:5000/api/admin/getproducts",
        data: {
          jwt: this.getCookie("jwt"),
        },
      })
        .then((res) => {
          if (res.data.status === true) {
            this.products = res.data.products;
            this.totalproducts = res.data.totalproducts;
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
.resim {
  border: 2px solid black;
  border-radius: 10px;
  background-color: aqua;
  aspect-ratio: 1;
  width: 50px;
  background: url("../assets/empty.jpg");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
</style>

<template>
  <section class="p-2 d-flex justify-content-center">
    <Toast />
    <div class="w-100">
      <v-sheet elevation="12" rounded="lg" class="p-4 w-100 h-100">
        <h3>Ürün Listesi</h3>
        <div class="container-fluid">
          <div class="card mb-2 p-2">
            <div class="d-flex justify-content-between">
              <select v-model="filtername" class="form-select" style="max-width: max-content; max-height: 50px">
                <option value="productName">Ürün Adı</option>
                <option value="firmName">Marka</option>
                <option value="category">Kategori</option>
                <option value="productStatus">Durum</option>
                <option value="isActive">Aktiflik</option>
              </select>
              <select v-if="filtername === 'productStatus'" v-model="filterStatus" class="form-select" style="max-width: max-content">
                <option value="null">Durum Seçiniz</option>
                <option value="instock">Stok Var</option>
                <option value="outofstock">Stok Yok</option>
              </select>
              <select
                v-else-if="filtername === 'isActive'"
                v-model="filterIsActive"
                class="form-select"
                placeholder="Aktiflik Seçiniz"
                style="max-width: max-content"
              >
                <option value="null">Aktiflik Seçiniz</option>
                <option value="true">Aktif</option>
                <option value="false">İnaktif</option>
              </select>
              <input v-model="filter" class="form-control w-50" type="text" placeholder="Aranacak Kelime" aria-label="default input example" v-else />
              <div>
                <v-btn
                  class="me-2"
                  style="text-transform: capitalize"
                  @click="
                    {
                      filtered = true;
                      urnleriGetir(filtered);
                    }
                  "
                  >Filtreyi Uygula</v-btn
                >
                <v-btn
                  style="text-transform: capitalize"
                  @click="
                    {
                      filtered = false;
                      urnleriGetir(filtered);
                    }
                  "
                  >Filtresiz Getir</v-btn
                >
              </div>
            </div>
          </div>
          <div class="card p-2" v-if="products.length === 0">Ürün bulunamadı</div>
          <div class="card p-2" v-else>
            <DataTable :value="products" removableSort class="border p-0 m-0">
              <Column header="Resim">
                <template #body="slotProps">
                  <img
                    :src="`http://localhost:5000/images/productImage/${slotProps.data.productImage[0]}`"
                    :alt="slotProps.data.productImage[0]"
                    class="resim"
                  />
                </template>
              </Column>
              <Column field="productName" sortable header="Ürün Adı"></Column>
              <Column field="firmName" sortable header="Marka"></Column>
              <Column header="İndirim">
                <template #body="slotProps">
                  <Tag v-if="slotProps.data.productDiscount" value="Aktif" severity="success" />
                  <Tag v-else value="İnaktif" />
                </template>
              </Column>
              <Column field="productDiscountMoney" sortable header="İndirimsiz Fiyat">
                <template #body="slotProps">
                  {{ new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(slotProps.data.productDiscountMoney) }}
                </template>
              </Column>
              <Column field="productMoney" sortable header="Fiyat">
                <template #body="slotProps">
                  {{ new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(slotProps.data.productMoney) }}
                </template>
              </Column>
              <Column field="stock" header="Stok" sortable>
                <template #body="slotProps"> {{ slotProps.data.stock }} Adet </template>
              </Column>
              <Column field="rating" header="Rating" sortable>
                <template #body="slotProps">
                  <Rating :modelValue="slotProps.data.rating" readonly :cancel="false" />
                </template>
              </Column>
              <Column field="category" header="Kategoriler" sortable>
                <template #body="slotProps">
                  <v-chip v-for="(item, i) in slotProps.data.category" :key="i" class="m-1">
                    {{ item }}
                  </v-chip>
                </template>
              </Column>
              <Column header="Status">
                <template #body="slotProps">
                  <Tag v-if="slotProps.data.productStatus === 'instock'" :value="slotProps.data.productStatus" severity="success" />
                  <Tag v-else :value="slotProps.data.productStatus" severity="danger" />
                </template>
              </Column>
              <Column header="Aktiflik">
                <template #body="slotProps">
                  <Tag v-if="slotProps.data.isActive" value="Aktif" severity="success" />
                  <Tag v-else value="İnaktif" severity="danger" />
                </template>
              </Column>
              <Column header="İşlemler">
                <template #body="slotProps">
                  <v-tooltip :text="slotProps.data.isActive ? 'Ürünü İnaktif Et' : 'Ürünü Aktif Et'" location="top">
                    <template v-slot:activator="{ props }">
                      <v-btn
                        v-bind="props"
                        :icon="slotProps.data.isActive ? 'mdi-eye-off' : 'mdi-eye'"
                        density="compact"
                        class="m-1"
                        @click="urunAktifInaktif(slotProps.data._id, slotProps.data.isActive)"
                      >
                      </v-btn>
                    </template>
                  </v-tooltip>
                  <v-tooltip text="İndirim Ayarları" location="top">
                    <template v-slot:activator="{ props }">
                      <v-btn v-bind="props" icon="mdi-sale" density="compact" class="m-1" @click="openDialog('discount', slotProps.data._id)">
                      </v-btn>
                    </template>
                  </v-tooltip>
                  <v-tooltip text="Stok Ayarları" location="top">
                    <template v-slot:activator="{ props }">
                      <v-btn v-bind="props" icon="mdi-stocking" density="compact" class="m-1" @click="openDialog('stock', slotProps.data._id)">
                      </v-btn>
                    </template>
                  </v-tooltip>
                  <v-tooltip text="Ürün Sayfasına Gözat" location="top">
                    <template v-slot:activator="{ props }">
                      <v-btn
                        v-bind="props"
                        icon="mdi-information-outline"
                        density="compact"
                        class="m-1"
                        @click="openDialog('product', slotProps.data._id)"
                      >
                      </v-btn>
                    </template>
                  </v-tooltip>
                </template>
              </Column>
              <template #footer>
                <div class="d-flex align-items-center">
                  <div class="me-5">Toplam {{ totalProducts }} ürün bulunuyor.</div>
                  <select
                    v-model="productsPerPage"
                    class="form-select"
                    style="max-width: 70px"
                    @change="
                      {
                        pageNumber = 1;
                        urnleriGetir(filtered);
                      }
                    "
                  >
                    <option selected :value="10">10</option>
                    <option :value="20">20</option>
                    <option :value="30">30</option>
                  </select>
                </div>
                <v-pagination
                  v-model="pageNumber"
                  :length="Math.ceil(totalProducts / productsPerPage)"
                  rounded="circle"
                  @update:modelValue="urnleriGetir(filtered)"
                ></v-pagination>
              </template>
            </DataTable>
          </div>
        </div>
      </v-sheet>
    </div>
    <Dialog
      v-model:visible="visibleDiscount"
      header="İndirim Ayarları"
      :style="{ width: '50vw' }"
      :breakpoints="{ '960px': '75vw', '641px': '100vw' }"
      position="top"
      modal
    >
      <v-switch
        label="Ürün İndirimini Aktifleştir"
        v-model="selectedProductDiscount"
        @click="selectedProductDiscount = !selectedProductDiscount"
        inset
      ></v-switch>
      <div v-if="selectedProductDiscount">
        <v-text-field
          v-model="selectedProductDiscountNonDiscountedMoney"
          clearable
          variant="outlined"
          label="Ürün Fiyatı"
          prefix="₺"
          type="number"
        ></v-text-field>
        <v-text-field
          v-model="selectedProductDiscountMoney"
          clearable
          variant="outlined"
          label="Ürün İndirimli Fiyatı"
          prefix="₺"
          type="number"
        ></v-text-field>
      </div>
      <div v-else>
        <v-text-field
          v-model="selectedProductDiscountNonDiscountedMoney"
          clearable
          variant="outlined"
          label="Ürün Fiyatı"
          prefix="₺"
          type="number"
        ></v-text-field>
      </div>
      <template #footer>
        <v-btn class="m-1" @click="urunFiyat(selectedProduct[0]._id)"> Kaydet </v-btn>
      </template>
    </Dialog>
    <Dialog
      v-model:visible="visibleStock"
      header="Stok Ayarları"
      :style="{ width: '50vw' }"
      :breakpoints="{ '960px': '75vw', '641px': '100vw' }"
      position="top"
      modal
    >
      <v-text-field
        class="mt-5"
        v-model="selectedProductStock"
        clearable
        variant="outlined"
        label="Ürün Fiyatı"
        prefix="Adet"
        type="number"
      ></v-text-field>
      <template #footer>
        <v-btn class="m-1" @click="urunStok(selectedProduct[0]._id)"> Kaydet </v-btn>
      </template>
    </Dialog>
    <Dialog v-model:visible="visibleProduct" header="Ürün Sayfası" :style="{ width: '90vw' }" modal maximizable>
      <ProductView :productss="selectedProduct" sellerss="Ben"> </ProductView>
    </Dialog>
  </section>
</template>

<script>
import DataTable from "primevue/datatable";
import Rating from "primevue/rating";
import Tag from "primevue/tag";
import Column from "primevue/column";
import axios from "axios";
import Toast from "primevue/toast";
import Dialog from "primevue/dialog";
import ProductView from "./ProductView.vue";
import * as jwt from "jose";
export default {
  components: { Toast, DataTable, Column, Rating, Tag, Dialog, ProductView },
  data() {
    return {
      visibleDiscount: false,
      visibleStock: false,
      visibleProduct: false,
      filtername: "productName",
      filter: null,
      filterIsActive: null,
      filterStatus: null,
      totalProducts: 0,
      pageNumber: 1,
      productsPerPage: 10,
      products: [],
      filtered: false,
      selectedProduct: null,
      selectedProductDiscount: null,
      selectedProductDiscountMoney: null,
      selectedProductDiscountNonDiscountedMoney: null,
      selectedProductStock: null,
      seller: null,
    };
  },
  async mounted() {
    const secret = new TextEncoder().encode(import.meta.env.VITE_JWT_SECRET);
    const token = this.getCookie("jwt");
    try {
      const { payload } = await jwt.jwtVerify(token, secret, {});
      if (payload) {
        this.seller = payload.data.username;
      }
    } catch (error) {
      this.$toast.add({
        severity: "error",
        summary: "Hatalı",
        detail: error.toString(),
        life: 3000,
      });
    }
    this.urnleriGetir();
  },
  methods: {
    openDialog(data, id) {
      this.selectedProduct = this.products.filter((x) => x._id === id);
      this.selectedProductDiscount = this.selectedProduct[0].productDiscount;
      this.selectedProductDiscountMoney = this.selectedProduct[0].productDiscountMoney;
      this.selectedProductDiscountNonDiscountedMoney = this.selectedProduct[0].productMoney;
      this.selectedProductStock = this.selectedProduct[0].stock;
      if (data === "discount") {
        this.visibleDiscount = true;
      } else if (data === "stock") {
        this.visibleStock = true;
      } else {
        this.visibleProduct = true;
      }
    },
    async urunAktifInaktif(id, isActive) {
      await axios({
        method: "post",
        url: "http://localhost:5000/api/seller/activeInactive",
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
              const element = this.products[i]._id;
              ids.push(element);
            }
            const index = ids.indexOf(id);
            this.products[index].isActive = !isActive;
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
    async urunFiyat(id) {
      if (this.selectedProductDiscountNonDiscountedMoney > this.selectedProductDiscountMoney || !this.selectedProductDiscount) {
        await axios({
          method: "post",
          url: "http://localhost:5000/api/seller/discount",
          data: {
            productID: id,
            productDiscount: this.selectedProductDiscount,
            productDiscountMoney: this.selectedProductDiscount ? this.selectedProductDiscountNonDiscountedMoney : "0",
            productMoney: this.selectedProductDiscount ? this.selectedProductDiscountMoney : this.selectedProductDiscountNonDiscountedMoney,
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
                const element = this.products[i]._id;
                ids.push(element);
              }
              const index = ids.indexOf(id);
              this.products[index].productDiscountMoney = this.selectedProductDiscount ? this.selectedProductDiscountNonDiscountedMoney : 0;
              this.products[index].productDiscount = this.selectedProductDiscount;
              this.products[index].productMoney = this.selectedProductDiscount
                ? this.selectedProductDiscountMoney
                : this.selectedProductDiscountNonDiscountedMoney;
              this.selectedProduct = null;
              this.selectedProductDiscount = null;
              this.selectedProductDiscountMoney = null;
              this.selectedProductDiscountNonDiscountedMoney = null;
              this.visibleDiscount = false;
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
      } else {
        this.$toast.add({
          severity: "error",
          summary: "İşlem Başarısız",
          detail: "Yeni Fiyat Daha Düşük Olmak Zorunda!",
          life: 3000,
        });
      }
    },
    async urunStok(id) {
      await axios({
        method: "post",
        url: "http://localhost:5000/api/seller/stock",
        data: {
          productID: id,
          stock: this.selectedProductStock,
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
              const element = this.products[i]._id;
              ids.push(element);
            }
            const index = ids.indexOf(id);
            this.products[index].stock = this.selectedProductStock;
            if (this.selectedProductStock == 0) this.products[index].productStatus = "outofstock";
            else this.products[index].productStatus = "instock";
            this.selectedProductStock = null;
            this.visibleStock = false;
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
    async urnleriGetir(filtered) {
      if (!filtered) {
        await axios({
          method: "post",
          url: "http://localhost:5000/api/seller/getlistproducts",
          data: {
            seller: this.seller,
            startsPoint: (this.pageNumber - 1) * this.productsPerPage,
            count: this.productsPerPage,
            filtered: filtered,
            jwt: this.getCookie("jwt"),
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
      } else {
        let filt;
        if (this.filtername === "productStatus") filt = this.filterStatus;
        else if (this.filtername === "isActive") filt = this.filterIsActive;
        else filt = this.filter;
        await axios({
          method: "post",
          url: "http://localhost:5000/api/seller/getlistproducts",
          data: {
            seller: this.seller,
            filtername: this.filtername,
            filter: filt,
            filtered: filtered,
            startsPoint: (this.pageNumber - 1) * this.productsPerPage,
            count: this.productsPerPage,
            jwt: this.getCookie("jwt"),
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
      }
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
  },
};
</script>

<style scoped>
.resim {
  border: 2px solid black;
  border-radius: 10px;
  background-color: aqua;
  aspect-ratio: 1;
  width: 100px;
  background: url("../assets/empty.jpg");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
</style>

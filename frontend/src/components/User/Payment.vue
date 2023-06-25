<template>
  <section class="container">
    <Toast />
    <div class="card w-100 mt-5">
      <div class="card-body d-flex justify-content-between">
        <h3 class="card-title">Satış</h3>
        <v-btn style="text-transform: capitalize" @click="$router.push(lastPath)" :loading="loading">Geri Dön</v-btn>
      </div>
    </div>
    <div class="card w-100 mt-5">
      <div class="card-body">
        <h3 class="card-title">Ürünler</h3>
        <DataTable class="border" :value="products" scrollable scrollHeight="700px" tableStyle="min-width: 50rem">
          <Column header="Ürün Resmi">
            <template #body="slotProps">
              <img
                :src="`http://localhost:5000/images/productImage/${slotProps.data.productImage[0]}`"
                :alt="slotProps.data.productImage[0]"
                class="resim"
              />
            </template>
          </Column>
          <Column field="productName" header="Ürün Adı"></Column>
          <Column field="firmName" header="Ürün Markası"></Column>
          <Column field="productMoney" header="Fiyat">
            <template #body="slotProps">
              {{ new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(slotProps.data.productMoney) }}
            </template>
          </Column>
          <Column header="Adet">
            <template #body="slotProps">
              <span>{{ cart[slotProps.data._id] }}</span>
            </template>
          </Column>
          <Column header="Toplam Fiyat">
            <template #body="slotProps">
              {{
                new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(slotProps.data.productMoney * cart[slotProps.data._id])
              }}
            </template>
          </Column>
          <template #footer>
            <div class="d-flex justify-content-evenly align-items-center">
              <span>Sepette toplam {{ store.getCartLength }} ürün var.</span>
              <span class="fw-bolder me-5">
                Sepet Toplam Tutarı: {{ new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(total) }}
              </span>
            </div>
          </template>
        </DataTable>
      </div>
    </div>
    <div class="card w-100 mt-5">
      <div class="card-body">
        <h3 class="card-title">Bilgiler</h3>
        <div class="d-flex">
          <select v-if="address.length > 0" v-model="selectedAddress" class="form-select">
            <option :value="0" selected>Adres Seçiniz</option>
            <option :value="item._id" v-for="item in address" :key="item._id">{{ item.name }}</option>
          </select>
          <RouterLink style="color: black" to="/account-address">
            <v-btn class="ms-2" prepend-icon="mdi-plus" variant="outlined" style="text-transform: capitalize" :loading="loading"> Adres Ekle </v-btn>
          </RouterLink>
        </div>
        <p class="ps-3 pt-4">{{ selectedAddress !== 0 ? getAddress(selectedAddress).address : "" }}</p>
      </div>
    </div>
    <div class="card w-100 mt-5">
      <div class="card-body d-flex justify-content-center">
        <v-btn style="text-transform: capitalize" :loading="loading" @click="satis" size="x-large">
          Satın Alımı Onayla
          <template v-slot:loader>
            <v-progress-linear indeterminate></v-progress-linear>
          </template>
        </v-btn>
      </div>
    </div>
  </section>
</template>

<script>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Toast from "primevue/toast";
import axios from "axios";
import * as jwt from "jose";
import { useCart } from "../../stores/cart.js";
export default {
  components: { DataTable, Column, Toast },
  setup() {
    const store = useCart();
    return { store };
  },
  data() {
    return {
      loading: false,
      products: [],
      cart: {},
      total: 0,
      user: null,
      username: null,
      lastPath: null,
      address: [],
      selectedAddress: 0,
    };
  },
  created() {
    this.lastPath = this.$router.options.history.state.back;
  },
  async mounted() {
    const secret = new TextEncoder().encode(import.meta.env.VITE_JWT_SECRET);
    const token = this.getCookie("jwt");
    try {
      const { payload } = await jwt.jwtVerify(token, secret, {});
      if (payload) {
        this.username = payload.data.username;
      }
    } catch (error) {
      this.$toast.add({
        severity: "error",
        summary: "Hata",
        detail: error.toString(),
        life: 3000,
      });
    }
    if (localStorage.getItem("myCart")) {
      const item = localStorage.getItem("myCart");
      const items = item.split(",");
      this.store.setlocalCart(items);
    }
    for (let i = 0; i < this.store.getCartLength; i++) {
      const element = this.store.getCart[i];
      if (!this.cart[element]) this.cart[element] = 1;
      else this.cart[element] = this.cart[element] + 1;
    }
    this.urnleriGetir();
    this.userGetir();
  },
  methods: {
    async satis() {
      this.loading = true;
      if (this.selectedAddress === 0) {
        this.$toast.add({
          severity: "error",
          summary: "Hata",
          detail: "Adres Seçiniz!",
          life: 3000,
        });
        this.loading = false;
      } else {
        await axios({
          method: "post",
          url: "http://localhost:5000/api/user/buy",
          data: {
            cart: this.cart,
            addressID: this.selectedAddress,
            jwt: this.getCookie("jwt"),
          },
        })
          .then((res) => {
            if (res.data.status === true) {
              this.$toast.add({
                severity: "success",
                summary: "Başarılı",
                detail: res.data.message,
                life: 3000,
              });
              setTimeout(() => {
                this.store.setDeleteALLCart();
                this.$router.push("/payment-success/" + res.data.orderCode);
              }, 2000);
            } else {
              this.$toast.add({
                severity: "error",
                summary: "Hata",
                detail: res.data.message,
                life: 3000,
              });
              setTimeout(() => {
                this.$router.push("/cart");
              }, 2000);
            }
          })
          .catch((err) => {
            this.loading = false;
            this.$toast.add({
              severity: "error",
              summary: "Hata",
              detail: err.toString(),
              life: 3000,
            });
          });
      }
    },
    getAddress(addressID) {
      for (let i = 0; i < this.address.length; i++) {
        const element = this.address[i];
        if (element._id === addressID) return this.address[i];
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
    async urnleriGetir() {
      await axios({
        method: "post",
        url: "http://localhost:5000/api/user/getCartProducts",
        data: {
          cart: Object.keys(this.cart),
        },
      })
        .then((res) => {
          if (res.data.status === true) {
            this.products = res.data.products;
            this.totalPriceCount();
            if (this.products.length > 0) this.isEmpty = false;
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
    async userGetir() {
      await axios({
        method: "post",
        url: "http://localhost:5000/api/user/getuser",
        data: {
          username: this.username,
          jwt: this.getCookie("jwt"),
        },
      })
        .then((res) => {
          if (res.data.status === true) {
            this.user = res.data.user;
            this.address = res.data.user.address;
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
    totalPriceCount() {
      this.total = 0;
      for (let i = 0; i < this.products.length; i++) {
        const element = this.products[i];
        this.total = this.total + element.productMoney * this.cart[element._id];
      }
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

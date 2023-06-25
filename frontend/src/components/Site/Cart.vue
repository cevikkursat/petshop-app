<template>
  <section class="mt-5 container">
    <Toast />
    <div class="card p-2">
      <DataTable v-if="store.getCartLength > 0" class="border" :value="products" scrollable scrollHeight="700px" tableStyle="min-width: 50rem">
        <template #header>
          <div class="d-flex justify-content-between align-items-center">
            <span class="text-xl text-900 font-bold">Sepetim</span>
            <v-btn
              v-if="!isEmpty"
              style="text-transform: capitalize"
              @click="
                {
                  store.setDeleteALLCart();
                  cart = {};
                  isEmpty = true;
                  deleteProductAll();
                  totalPriceCount();
                }
              "
              >Sepeti Boşalt</v-btn
            >
          </div>
        </template>
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
            <div class="input-group input-group-sm mb-3">
              <button
                class="btn btn-outline-danger"
                type="button"
                @click="
                  {
                    store.setDeleteCart(slotProps.data._id);
                    if (store.getCartLength === 0) isEmpty = true;
                    cart[slotProps.data._id]--;
                    if (cart[slotProps.data._id] === 0) deleteProduct(slotProps.data._id);
                    totalPriceCount();
                  }
                "
              >
                <i class="mdi mdi-delete" v-if="cart[slotProps.data._id] === 1" />
                <i class="mdi mdi-minus" v-if="cart[slotProps.data._id] > 1" />
              </button>
              <span class="input-group-text" id="inputGroup-sizing-sm">{{ cart[slotProps.data._id] }}</span>
              <button
                class="btn btn-outline-success"
                type="button"
                @click="
                  {
                    store.setCart(slotProps.data._id);
                    cart[slotProps.data._id]++;
                    totalPriceCount();
                  }
                "
              >
                <i class="mdi mdi-plus" />
              </button>
            </div>
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
            <span class="fw-bolder me-5"
              >Sepet Toplam Tutarı: {{ new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(total) }}</span
            >
          </div>
        </template>
      </DataTable>
      <div class="d-flex justify-content-end pt-2" v-if="!isEmpty">
        <v-btn class="p-2" variant="outlined" v-if="!login" style="text-transform: capitalize" @click="$router.push('/register-login')">
          Üye Ol / Giriş Yap
          <v-tooltip activator="parent" location="top">Ödeme Adımına Geçmek İçin </v-tooltip>
        </v-btn>
        <RouterLink style="color: black" to="/payment" v-else>
          <v-btn class="p-2" variant="outlined" style="text-transform: capitalize">Ödemeye Geç</v-btn>
        </RouterLink>
      </div>
      <div v-else class="d-flex justify-content-center align-items-center">
        <b>Sepet Boş</b>
      </div>
    </div>
  </section>
</template>

<script>
import DataTable from "primevue/datatable";
import Toast from "primevue/toast";
import Column from "primevue/column";
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
      isEmpty: true,
      products: [],
      cart: {},
      total: 0,
      login: false,
    };
  },
  async mounted() {
    for (let i = 0; i < this.store.getCartLength; i++) {
      const element = this.store.getCart[i];
      if (!this.cart[element]) this.cart[element] = 1;
      else this.cart[element] = this.cart[element] + 1;
    }
    this.urnleriGetir();
    const secret = new TextEncoder().encode(import.meta.env.VITE_JWT_SECRET);
    const token = this.getCookie("jwt");
    try {
      const { payload } = await jwt.jwtVerify(token, secret, {});
      if (payload) {
        this.login = true;
      }
    } catch (error) {}
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
    deleteProductAll() {
      this.products = [];
    },
    deleteProduct(data) {
      for (let i = 0; i < this.products.length; i++) {
        const element = this.products[i];
        if (element._id === data) {
          let left = this.products.slice(0, i);
          let right = this.products.slice(i + 1, this.products.length);
          this.products = [...left, ...right];
        }
      }
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

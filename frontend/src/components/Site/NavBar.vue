<template>
  <header>
    <Toast />
    <div class="utility-nav d-none d-md-block">
      <div class="container">
        <div class="row">
          <div class="col-12 col-md-6">
            <p class="small"><i class="bx bx-envelope"></i> cevikkursat.com | <i class="bx bx-phone"></i> +905538854103</p>
          </div>
          <div class="col-12 col-md-6 text-right">
            <p class="small">200 Lira üstü alışverişlerde kargo <b>ücretsiz!</b></p>
          </div>
        </div>
      </div>
    </div>

    <nav class="nav justify-content-center">
      <div class="container-md row w-100 d-flex justify-content-center justify-content-md-between align-items-center">
        <a class="col-4 col-md-3 order-first text-center" href="#">
          <img src="../../assets/petshopicon.png" alt="LOGO" width="100" />
        </a>
        <div class="col-12 col-md-6 order-md-first">
          <v-card-text>
            <v-text-field
              v-model="arama"
              :loading="loading"
              density="compact"
              variant="solo"
              label="Search templates"
              append-inner-icon="mdi-magnify"
              single-line
              hide-details
              @click:append-inner="aramaYap"
              @keyup.enter="aramaYap"
            ></v-text-field>
          </v-card-text>
        </div>
        <div class="col-8 col-md-3 order-first order-md-last d-flex justify-content-center align-items-center">
          <v-btn class="p-2" variant="outlined" v-if="!login" style="text-transform: capitalize" @click="$router.push('/register-login')">
            Üye Ol / Giriş Yap
          </v-btn>
          <div class="p-2" v-else>
            <v-menu min-width="200px" rounded>
              <template v-slot:activator="{ props }">
                <v-btn icon v-bind="props">
                  <v-avatar color="gray" size="large"><v-icon size="x-large" icon="mdi mdi-account"></v-icon> </v-avatar>
                </v-btn>
              </template>
              <v-card>
                <v-card-text>
                  <div class="mx-auto text-center">
                    <h4>{{ user.username }}</h4>
                    <v-divider class="my-2"></v-divider>
                    <RouterLink class="link" to="/account">
                      <v-btn rounded variant="text" style="text-transform: capitalize"> Hesabı Yönet </v-btn>
                    </RouterLink>
                    <v-divider class="my-2"></v-divider>
                    <RouterLink class="link" to="/orders">
                      <v-btn rounded variant="text" style="text-transform: capitalize"> Siparişlerim </v-btn>
                    </RouterLink>
                    <v-divider class="my-2" v-if="user.role === 'admin'"></v-divider>
                    <RouterLink class="link" v-if="user.role === 'admin'" to="/admin">
                      <v-btn rounded variant="text" style="text-transform: capitalize"> Admin Paneline Git </v-btn>
                    </RouterLink>
                    <v-divider class="my-2" v-if="user.role === 'seller'"></v-divider>
                    <RouterLink class="link" v-if="user.role === 'seller'" to="/seller-page">
                      <v-btn rounded variant="text" style="text-transform: capitalize"> Satıcı Paneline Git </v-btn>
                    </RouterLink>
                    <v-divider class="my-2"></v-divider>
                    <v-btn rounded variant="text" @click="cikis" style="text-transform: capitalize"> Çıkış Yap </v-btn>
                  </div>
                </v-card-text>
              </v-card>
            </v-menu>
          </div>
          <RouterLink class="ms-5 btn border-0 cartbtn" to="/cart" exact-active-class="active">
            <v-badge :content="store.getCartLength" v-if="store.getCartLength > 0">
              <v-icon size="x-large" icon="mdi mdi-cart"></v-icon>
            </v-badge>
            <v-icon icon="mdi mdi-cart" size="x-large" v-else></v-icon>
          </RouterLink>
        </div>
      </div>
    </nav>

    <nav class="navs navbar justify-content-center">
      <ul class="nav nav-tabs">
        <li class="nav-item">
          <RouterLink class="nav-link" to="/" exact-active-class="active">
            <span class="d-none d-md-flex">Ana Sayfa</span>
            <span class="d-block d-md-none text-center">
              <v-icon icon="mdi-home"></v-icon>
              <v-tooltip activator="parent" location="bottom">Ana Sayfa</v-tooltip>
            </span>
          </RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink class="nav-link" to="/dog-products" exact-active-class="active">
            <span class="d-none d-md-flex">Köpek Ürünleri</span>
            <span class="d-block d-md-none text-center">
              <v-icon icon="mdi-dog"></v-icon>
              <v-tooltip activator="parent" location="bottom">Köpek Ürünleri</v-tooltip>
            </span>
          </RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink class="nav-link" to="/cat-products" exact-active-class="active">
            <span class="d-none d-md-flex">Kedi Ürünleri</span>
            <span class="d-block d-md-none text-center">
              <v-icon icon="mdi-cat"></v-icon>
              <v-tooltip activator="parent" location="bottom">Kedi Ürünleri</v-tooltip>
            </span>
          </RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink class="nav-link" to="/bird-products" exact-active-class="active">
            <span class="d-none d-md-flex">Kuş Ürünleri</span>
            <span class="d-block d-md-none text-center">
              <v-icon icon="mdi-bird"></v-icon>
              <v-tooltip activator="parent" location="bottom">Kuş Ürünleri</v-tooltip>
            </span>
          </RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink class="nav-link" to="/fish-products" exact-active-class="active">
            <span class="d-none d-md-flex">Balık Ürünleri</span>
            <span class="d-flex d-md-none">
              <v-icon icon="mdi-fish"></v-icon>
              <v-tooltip activator="parent" location="bottom">Balık Ürünleri</v-tooltip>
            </span>
          </RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink class="nav-link" to="/predict" exact-active-class="active">
            <span class="d-none d-md-flex">Ürün Bulma Yardım Aracı</span>
            <span class="d-block d-md-none text-center">
              <v-icon icon="mdi-head-question"></v-icon>
              <v-tooltip activator="parent" location="bottom">Ürün Bulma Yardım Aracı</v-tooltip>
            </span>
          </RouterLink>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script>
import { RouterLink } from "vue-router";
import * as jwt from "jose";
import { useCart } from "../../stores/cart.js";
import Toast from "primevue/toast";

export default {
  components: { Toast },
  setup() {
    const store = useCart();
    return { store };
  },
  data: () => ({
    arama: null,
    user: {},
    dialog: false,
    loaded: false,
    loading: false,
    value: 0,
    login: false,
  }),
  async mounted() {
    if (localStorage.getItem("myCart")) {
      const item = localStorage.getItem("myCart");
      const items = item.split(",");
      this.store.setlocalCart(items);
    }

    const secret = new TextEncoder().encode(import.meta.env.VITE_JWT_SECRET);
    const token = this.getCookie("jwt");
    try {
      const { payload } = await jwt.jwtVerify(token, secret, {});
      if (payload) {
        this.login = true;
        this.user = payload.data;
      }
    } catch (error) {}
  },
  methods: {
    aramaYap() {
      if (this.arama) {
        const d = new Date();
        d.setTime(d.getTime() + 1 * 1000 * 60);
        const expires = "expires=" + d.toUTCString();
        document.cookie = "searchFilter=" + this.arama + ";" + expires + ";path=/search";
        window.location.pathname = "/search/" + this.karakterFormat(this.arama).replace(" ", "_");
      }
    },
    karakterFormat(text) {
      const turkceChars = ["ç", "ğ", "ı", "ö", "ş", "ü", "Ç", "Ğ", "İ", "Ö", "Ş", "Ü"];
      const ingilizceChars = ["c", "g", "i", "o", "s", "u", "C", "G", "I", "O", "S", "U"];

      for (let i = 0; i < turkceChars.length; i++) {
        let turkceChar = new RegExp(turkceChars[i], "g");
        text = text.replace(turkceChar, ingilizceChars[i]);
      }

      return text;
    },
    cikis() {
      document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      location.reload();
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
    onClick() {
      this.loading = true;

      setTimeout(() => {
        this.loading = false;
        this.loaded = true;
      }, 2000);
    },
  },
};
</script>

<style scoped>
.link {
  text-decoration: none;
  color: black;
}
.cartbtn:hover {
  color: #6c757d;
}
.nav-tabs {
  margin: 0;
  border-bottom: none;
}
.nav-tabs .nav-link.active {
  border-color: black;
  border-bottom: none;
}
.nav-tabs .nav-link.active:hover {
  border-color: #6c757d;
}
.nav-tabs .nav-link {
  color: black;
  border-bottom: none;
}
.nav-tabs .nav-link:hover {
  border-color: #6c757d;
}
.navs {
  border-bottom: 1px solid black;
  padding-bottom: 0;
}
.form-control {
  border-color: #6c757d;
  color: black;
}
.form-control:focus {
  border-color: inherit;
  -webkit-box-shadow: none;
  box-shadow: none;
}
</style>

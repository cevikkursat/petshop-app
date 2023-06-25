<template>
  <section class="p-2 d-flex justify-content-center">
    <Toast />
    <div class="w-100">
      <v-sheet elevation="12" rounded="lg" class="p-4 w-100 h-100">
        <h3>Adreslerim</h3>
        <v-divider class="mb-4"></v-divider>
        <div v-if="address.length === 0" class="card p-2 mt-2 text-center">Adres Bulunmuyor!</div>
        <div v-else class="container" style="max-height: 600px; overflow-y: auto">
          <v-sheet
            v-for="(item, key) in address"
            :key="key"
            elevation="12"
            max-width="1000"
            rounded="lg"
            width="100%"
            class="p-3 mb-3"
            :class="key === 0 ? 'mt-3' : ''"
          >
            <div class="d-flex justify-content-between">
              <h4>{{ item.name }}</h4>
              <v-tooltip text="İndirim Ayarları" location="top">
                <template v-slot:activator="{ props }">
                  <v-btn v-bind="props" variant="outlined" density="compact" style="color: red" icon="mdi-delete" @click="adresiCikar(key)"></v-btn>
                </template>
              </v-tooltip>
            </div>
            <v-divider class="mb-4"></v-divider>
            <p>{{ item.address }}</p>
          </v-sheet>
        </div>
        <v-divider class="mb-4"></v-divider>
        <div class="text-end">
          <v-btn variant="outlined" style="text-transform: capitalize" @click="visible = true"> <i class="mdi mdi-plus"></i> Adres Ekle </v-btn>
        </div>
      </v-sheet>
    </div>
    <Dialog v-model:visible="visible" header="Adres Kaydetme" :style="{ width: '50vw' }" :breakpoints="{ '960px': '75vw', '641px': '100vw' }" modal>
      <div>
        <v-text-field class="mt-5" v-model="adresBaslik" label="Adres Başlığı" variant="outlined"></v-text-field>
        <v-textarea v-model="adres" label="Adres" variant="outlined"></v-textarea>
      </div>
      <template #footer>
        <v-btn style="text-transform: capitalize" variant="outlined" class="m-1" @click="visible = false"> İptal </v-btn>
        <v-btn
          style="text-transform: capitalize"
          variant="outlined"
          class="m-1"
          @click="
            {
              adresiEkle();
            }
          "
        >
          Adresi Ekle
        </v-btn>
      </template>
    </Dialog>
  </section>
</template>

<script>
import axios from "axios";
import Toast from "primevue/toast";
import Dialog from "primevue/dialog";
import * as jwt from "jose";
export default {
  components: { Toast, Dialog },
  data() {
    return {
      adresBaslik: null,
      adres: null,
      visible: false,
      username: null,
      address: [],
    };
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
        summary: "Hatalı",
        detail: error.toString(),
        life: 3000,
      });
    }
    this.getAddress();
  },
  methods: {
    adresiEkle() {
      if (!this.adresBaslik || !this.adres) {
        this.$toast.add({
          severity: "error",
          summary: "Hata",
          detail: "Alanlar Boş Bırakılamaz",
          life: 3000,
        });
      } else {
        const adres = { name: this.adresBaslik, address: this.adres };
        this.address.push(adres);
        this.setAddress();
      }
    },
    adresiCikar(index) {
      let left = this.address.slice(0, index);
      let right = this.address.slice(index + 1, this.address.length);
      this.address = [...left, ...right];
      this.setAddress();
    },
    async getAddress() {
      await axios({
        method: "post",
        url: "http://localhost:5000/api/user/getaddress",
        data: { username: this.username, jwt: this.getCookie("jwt") },
      })
        .then((res) => {
          if (res.data.status === true) {
            this.address = res.data.address;
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
    async setAddress() {
      await axios({
        method: "post",
        url: "http://localhost:5000/api/user/setaddress",
        data: { username: this.username, address: this.address, jwt: this.getCookie("jwt") },
      })
        .then((res) => {
          if (res.data.status === true) {
            this.$toast.add({
              severity: "success",
              summary: "İşlem Başarılı",
              detail: res.data.message,
              life: 3000,
            });
            this.visible = false;
            this.adres = null;
            this.adresBaslik = null;
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
    getDate(date) {
      const d = new Date(date);
      return d.toLocaleString();
    },
  },
};
</script>

<style scoped></style>

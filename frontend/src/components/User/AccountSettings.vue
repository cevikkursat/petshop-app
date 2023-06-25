<template>
  <section class="p-2 d-flex justify-content-center">
    <Toast />
    <div class="w-100">
      <v-sheet elevation="12" rounded="lg" class="p-4 w-100 h-100">
        <h3>Hesap Bilgilerim</h3>
        <v-divider class="mb-4"></v-divider>
        <div class="container">
          <div class="w-50">
            <div class="fw-bolder fs-5">Şifre Değiştir</div>
            <v-divider class="mb-4"></v-divider>
            <v-text-field
              :append-inner-icon="icon"
              type="password"
              id="password"
              @click:appendInner="pswShowHide(`password`)"
              v-model="password"
              label="Şifre"
              variant="outlined"
              required
            ></v-text-field>
            <v-text-field
              :append-inner-icon="iconTekrar"
              type="password"
              id="passwordTekrar"
              @click:appendInner="pswShowHide(`passwordTekrar`)"
              v-model="passwordTekrar"
              label="Şifre Tekrar"
              variant="outlined"
              required
            ></v-text-field>
            <div class="text-end">
              <v-btn variant="outlined" style="text-transform: capitalize" @click="changePass"> Şifreyi Değiştir </v-btn>
            </div>
          </div>
          <div class="w-50">
            <div class="fw-bolder fs-5">Hesabı Kapat</div>
            <v-divider class="mb-4"></v-divider>
            <v-btn variant="outlined" style="text-transform: capitalize; color: red" @click="visible = true"> Hesabı Kapat </v-btn>
          </div>
        </div>
        <v-divider class="mb-4"></v-divider>
      </v-sheet>
    </div>
    <Dialog
      v-model:visible="visible"
      header="Hesap Kapatma Bildirimi"
      :style="{ width: '50vw' }"
      :breakpoints="{ '960px': '75vw', '641px': '100vw' }"
      modal
    >
      <div v-if="role === 'seller'">Hesabı Kapatabilmeniz İçin ürün listelemiyor olmanız ve satışlarınız beklemede olamaması gerekmektedir!</div>
      <div v-else>Hesabı kapatmak istediğinizden emin misiniz?</div>
      <template #footer>
        <v-btn style="text-transform: capitalize" variant="outlined" class="m-1" @click="visible = false"> İptal </v-btn>
        <v-btn
          style="text-transform: capitalize; color: red"
          variant="outlined"
          class="m-1"
          @click="
            {
              closeAcc();
              visible = false;
            }
          "
        >
          Hesabı Kapat
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
      visible: false,
      role: null,
      username: null,
      password: null,
      passwordTekrar: null,
      icon: "mdi mdi-eye",
      iconTekrar: "mdi mdi-eye",
    };
  },
  async mounted() {
    const secret = new TextEncoder().encode(import.meta.env.VITE_JWT_SECRET);
    const token = this.getCookie("jwt");
    try {
      const { payload } = await jwt.jwtVerify(token, secret, {});
      if (payload) {
        this.username = payload.data.username;
        this.role = payload.data.role;
      }
    } catch (error) {
      this.$toast.add({
        severity: "error",
        summary: "Hatalı",
        detail: error.toString(),
        life: 3000,
      });
    }
  },
  methods: {
    pswShowHide(id) {
      const passwordField = document.querySelector("#" + id);
      if (passwordField.type == "text") {
        passwordField.type = "password";
        if (id == "password") this.icon = "mdi mdi-eye";
        else if (id == "passwordTekrar") this.iconTekrar = "mdi mdi-eye";
      } else {
        passwordField.type = "text";
        if (id == "password") this.icon = "mdi mdi-eye-off";
        else if (id == "passwordTekrar") this.iconTekrar = "mdi mdi-eye-off";
      }
    },
    async changePass() {
      if (this.password && this.passwordTekrar)
        if (this.password === this.passwordTekrar)
          await axios({
            method: "post",
            url: "http://localhost:5000/api/user/changepass",
            data: { username: this.username, password: this.password, jwt: this.getCookie("jwt") },
          })
            .then((res) => {
              if (res.data.status === true) {
                this.user = res.data.user;
                this.$toast.add({
                  severity: "success",
                  summary: "İşlem Başarılı",
                  detail: res.data.message,
                  life: 3000,
                });
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
              this.isLoaded = false;
              console.log(err);
            });
        else {
          this.$toast.add({
            severity: "error",
            summary: "Hata",
            detail: "Şifreler Uyuşmuyor",
            life: 3000,
          });
        }
      else {
        this.$toast.add({
          severity: "error",
          summary: "Hata",
          detail: "Şifre boş olamaz",
          life: 3000,
        });
      }
    },
    async closeAcc() {
      await axios({
        method: "post",
        url: "http://localhost:5000/api/user/closeacc",
        data: { username: this.username, jwt: this.getCookie("jwt") },
      })
        .then((res) => {
          if (res.data.status === true) {
            this.$toast.add({
              severity: "success",
              summary: "İşlem Başarılı",
              detail: res.data.message,
              life: 3000,
            });
            document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            setTimeout(() => {
              window.location.pathname = "/";
            }, 1000);
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
  },
};
</script>

<style scoped>
.list-group-item:hover {
  background-color: rgba(128, 128, 128, 0.226);
}
</style>

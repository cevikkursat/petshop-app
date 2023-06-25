<template>
  <section class="p-2 d-flex justify-content-center">
    <Toast />
    <div class="w-100">
      <v-sheet elevation="12" rounded="lg" class="p-4 w-100 h-100">
        <h3>Hesap Bilgilerim</h3>
        <v-divider class="mb-4"></v-divider>
        <div class="container">
          <ul class="list-group">
            <li class="list-group-item">
              <span class="fw-bolder fs-5">Kullanıcı Adı: </span>
              <span class="fs-5">{{ user.username }}</span>
            </li>
            <li class="list-group-item">
              <span class="fw-bolder fs-5">Adı Soyadı: </span>
              <span class="fs-5">{{ user.fName + " " + user.lName }}</span>
            </li>
            <li class="list-group-item">
              <span class="fw-bolder fs-5">Telefon Numarası: </span>
              <span class="fs-5">{{ user.phone }}</span>
            </li>
            <li class="list-group-item">
              <span class="fw-bolder fs-5">Mail: </span>
              <span class="fs-5">{{ user.email }}</span>
            </li>
            <li class="list-group-item">
              <span class="fw-bolder fs-5">Hesap Oluşturulma Tarihi: </span>
              <span class="fs-5">{{ getDate(Date.parse(user.createdAt)) }}</span>
            </li>
            <li class="list-group-item">
              <span class="fw-bolder fs-5">Hesap Tipi: </span>
              <span class="fs-5">{{ user.role === "seller" ? "Satıcı" : user.role === "admin" ? "Admin" : "Kullanıcı" }}</span>
            </li>
          </ul>
        </div>
        <v-divider class="mb-4"></v-divider>
      </v-sheet>
    </div>
  </section>
</template>

<script>
import axios from "axios";
import Toast from "primevue/toast";
import * as jwt from "jose";
export default {
  components: { Toast },
  data() {
    return {
      username: null,
      user: [],
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
    this.userGetir();
  },
  methods: {
    async userGetir() {
      await axios({
        method: "post",
        url: "http://localhost:5000/api/user/getuser",
        data: { username: this.username, jwt: this.getCookie("jwt") },
      })
        .then((res) => {
          if (res.data.status === true) {
            this.user = res.data.user;
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

<style scoped>
.list-group-item:hover {
  background-color: rgba(128, 128, 128, 0.226);
}
</style>

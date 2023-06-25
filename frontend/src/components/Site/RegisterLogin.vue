<template>
  <div class="container d-flex justify-content-center align-items-center mt-5" :style="'height: ' + heightpx + 'px'">
    <Toast />
    <v-sheet elevation="12" rounded="lg" max-width="500" class="pa-4 mt-5 text-center mx-auto col-12 col-md-6">
      <div class="row d-flex justify-content-center align-items-center">
        <div class="col-5">
          <v-btn
            class="text-none signinbtn"
            :class="active ? `active` : ``"
            rounded
            @click="
              active = true;
              clear();
            "
          >
            Giriş yap
          </v-btn>
        </div>
        <div class="col-5">
          <v-btn class="text-none signupbtn" :class="!active ? `active` : ``" rounded @click="active = false"> Üye Ol </v-btn>
        </div>
        <div class="col-2">
          <v-btn icon @click="$router.push(lastPath)"> <i class="mdi mdi-home"></i> </v-btn>
        </div>
      </div>
      <img width="100" src="../../assets/petshopicon.png" alt="icon" />

      <div class="signin" v-if="active">
        <h2 class="text-h5 mb-6">Giriş Yap</h2>
        <div class="row">
          <v-form v-model="valid" @submit.prevent>
            <v-text-field v-model="username" :rules="usernameRules" label="Username" variant="outlined" required></v-text-field>
            <v-text-field
              :append-inner-icon="icon"
              type="password"
              id="password"
              @click:appendInner="pswShowHide(`password`)"
              v-model="password"
              :rules="passwordRules"
              label="Şifre"
              variant="outlined"
              required
            ></v-text-field>
            <RouterLink class="nav-link d-flex justify-content-end p-0 m-0" to="/reset-password">
              <v-btn class="" style="text-transform: capitalize" variant="plain"> Şifre Sıfırlama! </v-btn>
            </RouterLink>
            <v-btn style="text-transform: capitalize" type="submit" block class="mt-3" @click="girisYap" :loading="loadingGirisYap">Giriş Yap</v-btn>
          </v-form>
        </div>
      </div>
      <div class="signup" v-else>
        <h2 class="text-h5 mb-6">Üye Ol</h2>
        <div class="row">
          <v-form v-model="valid" @submit.prevent>
            <v-text-field v-model="usernameUyeOl" :rules="usernameRules" label="Username" variant="outlined" required></v-text-field>
            <v-text-field v-model="fname" :rules="fnameRules" label="Ad" variant="outlined" required></v-text-field>
            <v-text-field v-model="lname" :rules="lnameRules" label="Soyad" variant="outlined" required></v-text-field>
            <v-text-field v-model="email" :rules="emailRules" label="Email" variant="outlined" required></v-text-field>
            <v-text-field v-model="phone" :rules="phoneRules" label="Telefon" variant="outlined" required></v-text-field>
            <v-text-field
              :append-inner-icon="iconUyeOl"
              type="password"
              id="passwordUyeOl"
              @click:appendInner="pswShowHide(`passwordUyeOl`)"
              v-model="passwordUyeOl"
              :rules="passwordRules"
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
              :rules="passwordRules"
              label="Şifre Tekrar"
              variant="outlined"
              required
            ></v-text-field>
            <v-btn style="text-transform: capitalize" type="submit" block class="mt-2" @click="uyeOl" :loading="loadingUyeOl">Üye Ol</v-btn>
          </v-form>
        </div>
      </div>
    </v-sheet>
  </div>
</template>

<script>
import { RouterLink } from "vue-router";
import Toast from "primevue/toast";
import axios from "axios";
export default {
  components: { Toast },
  data: () => ({
    lastPath: null,
    heightpx: 0,
    valid: false,
    active: true,
    loadingGirisYap: false,
    loadingUyeOl: false,
    icon: "mdi mdi-eye",
    iconUyeOl: "mdi mdi-eye",
    iconTekrar: "mdi mdi-eye",
    username: "",
    usernameUyeOl: "",
    usernameRules: [
      (value) => {
        if (value) return true;

        return "Username gerekli!";
      },
      (value) => {
        if (value.length >= 5) return true;

        return "5 karakterden fazla olmalı!";
      },
    ],
    fname: "",
    fnameRules: [
      (value) => {
        if (value) return true;

        return "Ad gerekli!";
      },
      (value) => {
        if (value.length >= 2) return true;

        return "2 karakterden fazla olmalı!";
      },
    ],
    lname: "",
    lnameRules: [
      (value) => {
        if (value) return true;

        return "Soyad gerekli!";
      },
      (value) => {
        if (value.length >= 2) return true;

        return "2 karakterden fazla olmalı!";
      },
    ],
    email: "",
    emailRules: [
      (value) => {
        if (value) return true;

        return "Email gerekli!";
      },
      (value) => {
        if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i.test(value)) return true;

        return "Geçerli bir email giriniz!";
      },
    ],
    phone: "",
    phoneRules: [
      (value) => {
        if (value) return true;

        return "Telefon gerekli!";
      },
      (value) => {
        if (value?.length > 9 && /[0-9-]+/.test(value)) return true;

        return "Geçerli bir telefon numarası giriniz!";
      },
    ],
    password: "",
    passwordUyeOl: "",
    passwordTekrar: "",
    passwordRules: [
      (value) => {
        if (value) return true;

        return "Password gerekli!";
      },
    ],
  }),
  created() {
    this.lastPath = this.$router.options.history.state.back;
    if (this.lastPath) {
      if (this.lastPath !== "/" && this.lastPath !== "/cart") this.lastPath = "/";
    } else this.lastPath = "/";
  },
  mounted() {
    this.heightpx = window.innerHeight;
  },
  methods: {
    pswShowHide(id) {
      const passwordField = document.querySelector("#" + id);
      if (passwordField.type == "text") {
        passwordField.type = "password";
        if (id == "password") this.icon = "mdi mdi-eye";
        else if (id == "passwordUyeOl") this.iconUyeOl = "mdi mdi-eye";
        else if (id == "passwordTekrar") this.iconTekrar = "mdi mdi-eye";
      } else {
        passwordField.type = "text";
        if (id == "password") this.icon = "mdi mdi-eye-off";
        else if (id == "passwordUyeOl") this.iconUyeOl = "mdi mdi-eye-off";
        else if (id == "passwordTekrar") this.iconTekrar = "mdi mdi-eye-off";
      }
    },
    clear() {
      this.password = "";
      this.passwordTekrar = "";
      this.passwordUyeOl = "";
      this.username = "";
      this.usernameUyeOl = "";
      this.lname = "";
      this.fname = "";
      this.email = "";
      this.phone = "";
    },
    async girisYap() {
      if (this.valid) {
        this.loadingGirisYap = !this.loadingGirisYap;
        await axios({
          method: "post",
          url: "http://localhost:5000/api/user/login",
          data: {
            username: this.username,
            password: this.password,
          },
        })
          .then((res) => {
            this.loadingGirisYap = false;
            if (res.data.status === true) {
              const d = new Date();
              d.setTime(d.getTime() + 1 * 1000 * 60 * 60);
              const expires = "expires=" + d.toUTCString();
              document.cookie = "jwt=" + res.data.token + ";" + expires + ";path=/";
              this.$router.push(this.lastPath);
            } else {
              this.username = null;
              this.password = null;
              this.$toast.add({
                severity: "error",
                summary: "Hata",
                detail: res.data.message,
                life: 3000,
              });
            }
          })
          .catch((err) => {
            this.loadingGirisYap = false;
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
          summary: "Hata",
          detail: "Hatalı Giriş!",
          life: 3000,
        });
      }
    },
    async uyeOl() {
      if (this.valid) {
        if (this.passwordUyeOl === this.passwordTekrar) {
          this.loadingUyeOl = !this.loadingUyeOl;
          await axios({
            method: "post",
            url: "http://localhost:5000/api/user/register",
            data: {
              username: this.usernameUyeOl,
              fName: this.fname,
              lName: this.lname,
              phone: this.phone,
              email: this.email,
              password: this.passwordUyeOl,
            },
          })
            .then((res) => {
              this.loadingUyeOl = false;
              if (res.data.status === true) {
                this.clear();
                this.active = true;
                this.$toast.add({
                  severity: "success",
                  summary: "Başarılı",
                  detail: "Üye Başarılı Bir şekilde Oluşturuldu",
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
              this.loadingUyeOl = false;
              this.$toast.add({
                severity: "error",
                summary: "Hata",
                detail: err.toString(),
                life: 3000,
              });
            });
        } else {
          this.$toast.add({
            severity: "success",
            summary: "Başarılı",
            detail: "Girilen Şifreler Uyuşmuyor!",
            life: 3000,
          });
        }
      } else {
        this.$toast.add({
          severity: "error",
          summary: "Hata",
          detail: "Hatalı Giriş!",
          life: 3000,
        });
      }
    },
  },
};
</script>

<style scoped>
.active {
  background-color: aqua !important;
}
.signinbtn {
  width: 100%;
  background-color: azure;
}
.signupbtn {
  width: 100%;
  background-color: azure;
}
</style>

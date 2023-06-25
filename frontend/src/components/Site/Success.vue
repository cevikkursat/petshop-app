<template>
  <v-sheet elevation="12" max-width="1000" rounded="lg" width="100%" class="m-5 p-4 text-center mx-auto">
    <v-icon class="mb-5" :color="color" :icon="icon" size="112"></v-icon>

    <h2 class="text-h5 mb-6">{{ title }}</h2>

    <p v-html="this.text" class="mb-4 text-medium-emphasis text-body-2"></p>

    <v-divider class="mb-4"></v-divider>

    <div class="text-end">
      <v-btn class="text-none" color="success" rounded variant="flat" @click="onClick(successType)">
        {{ btnText }}
      </v-btn>
    </div>
  </v-sheet>
</template>

<script>
import * as jwt from "jose";
import axios from "axios";
export default {
  data() {
    return {
      color: "success",
      icon: "mdi-check-circle",
      title: null,
      text: null,
      btnText: null,
      successType: null,
      link: "",
    };
  },
  async mounted() {
    this.successType = document.location.pathname.split("/")[1];
    if (this.successType === "payment-success") {
      this.text = `Satın alma işlemi başarılı bir şekilde gerçekleşti! <h5><b>Sipariş Numarası: ${document.location.pathname.split("/")[2]}</b></h5>`;
      this.title = "Satın alma işlemi başarılı!";
      this.btnText = "Siparişlerime Git";
    } else if (this.successType === "auth") {
      const secret = new TextEncoder().encode(import.meta.env.VITE_JWT_SECRET);
      const token = document.location.pathname.split("/")[2].replaceAll("__", ".");
      try {
        const { payload } = await jwt.jwtVerify(token, secret, {});
        if (payload) {
          await axios({
            method: "post",
            url: "http://localhost:5000/api/user/activate",
            data: {
              username: payload.data.username,
              jwt: token,
            },
          })
            .then((res) => {
              if (res.data.status === true) {
                this.text = res.data.message;
                this.title = "Hesap Doğrulama İşlemi Başarılı!";
                this.btnText = "Giriş Yap";
                this.link = "/register-login";
              } else {
                this.icon = "mdi-close-circle";
                this.color = "danger";
                this.text = `Hesap doğrulanırken bir hatayla karşılaşıldı ${res.data.message}`;
                this.title = "Hesap Doğrulama İşlemi Başarısız!";
                this.btnText = "Ana Sayfaya Git";
                this.link = "/";
              }
            })
            .catch((err) => {
              this.icon = "mdi-close-circle";
              this.color = "danger";
              this.text = `Hesap doğrulanırken bir hatayla karşılaşıldı ${err.toString()}`;
              this.title = "Hesap Doğrulama İşlemi Başarısız!";
              this.btnText = "Ana Sayfaya Git";
              this.link = "/";
            });
        }
      } catch (error) {
        this.icon = "mdi-close-circle";
        this.color = "danger";
        this.text = `Hesap doğrulanırken bir hatayla karşılaşıldı ${error.toString()}`;
        this.title = "Hesap Doğrulama İşlemi Başarısız!";
        this.btnText = "Ana Sayfaya Git";
        this.link = "/";
      }
    } else if (this.successType === "reset") {
      const secret = new TextEncoder().encode(import.meta.env.VITE_JWT_SECRET);
      const token = document.location.pathname.split("/")[2].replaceAll("__", ".");
      try {
        const { payload } = await jwt.jwtVerify(token, secret, {});
        if (payload) {
          await axios({
            method: "post",
            url: "http://localhost:5000/api/user/resetpassword",
            data: {
              username: payload.data.username,
              jwt: token,
            },
          })
            .then((res) => {
              if (res.data.status === true) {
                this.text = res.data.message;
                this.title = "Hesap Şifre Sıfırlama İşlemi Başarılı!";
                this.btnText = "Giriş Yap";
                this.link = "/register-login";
              } else {
                this.icon = "mdi-close-circle";
                this.color = "danger";
                this.text = `Hesap şifresi sıfırlanırken bir hatayla karşılaşıldı ${res.data.message}`;
                this.title = "Hesap Şifre Sıfırlama İşlemi Başarısız!";
                this.btnText = "Ana Sayfaya Git";
                this.link = "/";
              }
            })
            .catch((err) => {
              this.icon = "mdi-close-circle";
              this.color = "danger";
              this.text = `Hesap şifresi sıfırlanırken bir hatayla karşılaşıldı ${err.toString()}`;
              this.title = "Hesap Şifre Sıfırlama İşlemi Başarısız!";
              this.btnText = "Ana Sayfaya Git";
              this.link = "/";
            });
        }
      } catch (error) {
        this.icon = "mdi-close-circle";
        this.color = "danger";
        this.text = `Hesap şifresi sıfırlanırken bir hatayla karşılaşıldı ${error.toString()}`;
        this.title = "Hesap Şifre Sıfırlama İşlemi Başarısız!";
        this.btnText = "Ana Sayfaya Git";
        this.link = "/";
      }
    }
  },
  methods: {
    onClick(neresi) {
      if (neresi === "payment-success") this.$router.push("/orders");
      else this.$router.push(this.link);
    },
  },
};
</script>

<style scoped></style>

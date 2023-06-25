<template>
  <div class="container mt-5">
    <Toast />
    <v-sheet elevation="12" max-width="800" rounded="lg" width="100%" class="p-4 text-center mx-auto">
      <img width="100" src="../../assets/petshopicon.png" alt="icon" />

      <h2 class="mb-5">Şifre Sıfırlama!</h2>

      <p>
        Şifre Sıfırlanacak Hesabın Mail Adresini giriniz.
        <v-text-field class="mt-2" v-model="email" :rules="emailRules" label="Email" variant="outlined" required></v-text-field>
      </p>

      <v-divider class="mb-5"></v-divider>

      <div class="text-end">
        <v-btn class="text-none" color="success" rounded variant="flat" @click="block ? reset() : null"> Şifre Sıfırlama Linki Gönder </v-btn>
      </div>
    </v-sheet>
  </div>
</template>

<script>
import Toast from "primevue/toast";
import axios from "axios";
export default {
  components: { Toast },
  data: () => ({
    block: true,
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
  }),

  methods: {
    async reset() {
      this.block = false;
      await axios({
        method: "post",
        url: "http://localhost:5000/api/user/resetpass",
        data: {
          email: this.email,
        },
      })
        .then((res) => {
          if (res.data.status === true) {
            this.$toast.add({
              severity: "success",
              summary: "Link Gönderildi!",
              detail: res.data.message,
              life: 3000,
            });
            setTimeout(() => {
              this.$router.push("/");
            }, 3000);
          } else {
            this.email = null;
            this.block = true;
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

<style scoped></style>

<template>
  <section class="p-2 d-flex justify-content-center">
    <Toast />
    <div class="w-100">
      <v-sheet elevation="12" rounded="lg" class="p-4 w-100 h-100">
        <h3>Ana Sayfa Resimlerini Seç</h3>
        <v-divider class="mb-4"></v-divider>
        <div class="container">
          <form class="w-100" method="post">
            <v-text-field name="date" v-model="date" class="d-none"></v-text-field>
            <div>
              <div class="d-flex">
                <v-file-input
                  name="photos"
                  id="inputImage"
                  v-model="carouselImage"
                  chips
                  multiple
                  :rules="IMGrules"
                  variant="outlined"
                  accept="image/png, image/jpeg"
                  placeholder="Resim Seçin"
                  prepend-icon="mdi-camera"
                  label="Ana Sayfa Resimlerini Seçin"
                  :show-size="1000"
                  @click:clear="IMGclear"
                ></v-file-input>
                <div class="btn d-flex align-items-center" @click="resimleriYukle">
                  <i class="mdi mdi-tray-arrow-up fs-4"></i>
                  <span class="ms-1" style="white-space: nowrap"> Resimleri Yükle </span>
                </div>
              </div>
              <div :class="isLoaded ? '' : 'd-none'" style="overflow: auto; white-space: nowrap">
                <div v-for="(item, i) in carouselImage" :id="`placeholder${i}`" class="resim d-inline-block me-1"></div>
              </div>
            </div>
          </form>
        </div>
        <v-divider class="mb-4"></v-divider>
        <div class="text-end">
          <v-btn class="text-none" color="success" rounded variant="flat" @click="carouselUrunleriniKaydet"> Carousel Resimlerini Kaydet </v-btn>
        </div>
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
      date: null,
      isLoaded: false,
      admin: null,
      iserror: false,
      errorMessage: "",
      carouselImage: [],
      carouselImageNames: [],
      stock: null,
      IMGrules: [
        (value) => {
          if (!value) return "Resim Seçiniz!";
          else {
            for (let i = 0; i < value.length; i++) {
              if (value[i].size > 2000000) {
                this.iserror = true;
                this.errorMessage = "Her Resmin Boyutu 2 MB den daha az olmalıdır!";
                return "Her Resmin Boyutu 2 MB den daha az olmalıdır!";
              }
            }
          }
          this.iserror = false;
          return true;
        },
        (value) => {
          if (!value) return "Resim Seçiniz!";
          else {
            if (value.length > 10) {
              this.iserror = true;
              this.errorMessage = "En fazla 10 adet resim seçilmelidir.";
              return "En fazla 10 adet resim seçilmelidir.";
            }
          }
          this.iserror = false;
          return true;
        },
      ],
    };
  },
  async mounted() {
    const secret = new TextEncoder().encode(import.meta.env.VITE_JWT_SECRET);
    const token = this.getCookie("jwt");
    try {
      const { payload } = await jwt.jwtVerify(token, secret, {});
      if (payload) {
        this.admin = payload.data.username;
      }
    } catch (error) {
      this.$toast.add({
        severity: "error",
        summary: "Hatalı",
        detail: error.toString(),
        life: 3000,
      });
    }
    this.date = Date.now();
  },
  methods: {
    IMGclear() {
      this.isLoaded = false;
      this.carouselImageNames = [];
    },
    async resimleriYukle() {
      if (!this.iserror && this.carouselImage.length > 0) {
        const form = document.querySelector("form");
        const formData = new FormData(form);
        await axios({
          method: "post",
          url: "http://localhost:5000/api/admin/uploadimage",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          data: formData,
        })
          .then((res) => {
            if (res.data.status === true) {
              this.$toast.add({
                severity: "success",
                summary: "İşlem Başarılı",
                detail: "Resimler Yüklendi",
                life: 3000,
              });
              this.isLoaded = true;
              for (let i = 0; i < this.carouselImage.length; i++) {
                const placeholder = document.getElementById(`placeholder${i}`);
                try {
                  placeholder.style.backgroundImage = `url(http://localhost:5000/images/adminImage/${this.date}--${this.carouselImage[i].name})`;
                  this.carouselImageNames.push(`${this.date}--${this.carouselImage[i].name}`);
                } catch (error) {
                  placeholder.style.backgroundImage = "url(../assets/empty.jpg)";
                }
              }
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
          detail: this.errorMessage,
          life: 3000,
        });
      }
    },
    async carouselUrunleriniKaydet() {
      if (!this.iserror) {
        if (this.carouselImageNames.length > 0 && this.isLoaded) {
          await axios({
            method: "post",
            url: "http://localhost:5000/api/admin/carouselupdate",
            data: {
              carouselImage: this.carouselImageNames,
              jwt: this.getCookie("jwt"),
            },
          })
            .then((res) => {
              if (res.data.status === true) {
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
            detail: "Ürün oluşturmak için resimleri yüklemeniz gerekmektedir!",
            life: 3000,
          });
        }
      } else {
        this.$toast.add({
          severity: "error",
          summary: "Hata",
          detail: this.errorMessage,
          life: 3000,
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
  border: 3px solid black;
  border-radius: 10px;
  background-color: aqua;
  aspect-ratio: 1;
  width: 250px;
  background: url("../assets/empty.jpg");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.btn:active {
  border-color: transparent !important;
}
</style>

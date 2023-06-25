<template>
  <section class="p-2 d-flex justify-content-center">
    <Toast />
    <div class="w-100">
      <v-sheet elevation="12" rounded="lg" class="p-4 w-100 h-100">
        <h3>Ürün Oluşturucu</h3>
        <v-divider class="mb-4"></v-divider>
        <div class="container">
          <form class="w-100" method="post">
            <v-text-field name="productName" v-model="productName" clearable variant="outlined" label="Ürün Adı"></v-text-field>
            <v-text-field name="seller" v-model="seller" class="d-none" clearable variant="outlined" label="Ürün Adı"></v-text-field>
            <v-text-field name="firmName" v-model="firmName" clearable variant="outlined" label="Ürün Markası"></v-text-field>
            <v-text-field v-model="stock" clearable variant="outlined" label="Ürün Stoğu" type="number"></v-text-field>
            <v-text-field v-model="productMoney" clearable variant="outlined" label="Ürün Fiyatı" prefix="₺" type="number"></v-text-field>
            <Editor name="productDesc" v-model="productDesc" editorStyle="height: 320px" />
            <div class="my-5">
              <div class="d-flex">
                <v-select
                  v-if="categories.length === 0"
                  v-model="category"
                  class="col me-2"
                  label="Zorunlu Kategori"
                  :items="defaultCategories"
                  variant="outlined"
                  @update:modelValue="addCategory(1)"
                ></v-select>
                <v-select
                  v-else
                  disabled
                  v-model="category"
                  class="col me-2"
                  label="Zorunlu Kategori"
                  :items="defaultCategories"
                  variant="outlined"
                ></v-select>
                <section v-if="categories[0] === 'köpek'" class="col me-2">
                  <v-select
                    v-if="categories.length === 0"
                    disabled
                    v-model="category2"
                    :items="defaultCategories2"
                    label="İsteğe Bağlı Kategori"
                    multiple
                    chips
                    variant="outlined"
                    @update:modelValue="addCategory(2)"
                  ></v-select>
                  <v-select
                    v-else
                    v-model="category2"
                    :items="defaultCategories2"
                    label="İsteğe Bağlı Kategori"
                    multiple
                    chips
                    variant="outlined"
                    @update:modelValue="addCategory(2)"
                  ></v-select>
                </section>
                <section class="col">
                  <v-text-field
                    v-if="categories.length === 0"
                    disabled
                    v-model="category3"
                    variant="solo"
                    label="İsteğe Bağlı Kategori"
                    append-inner-icon="mdi-plus"
                    single-line
                    hide-details
                    @click:append-inner="addCategory(3)"
                  ></v-text-field>
                  <v-text-field
                    v-else
                    v-model="category3"
                    variant="solo"
                    label="İsteğe Bağlı Kategori"
                    append-inner-icon="mdi-plus"
                    single-line
                    hide-details
                    @click:append-inner="addCategory(3)"
                  ></v-text-field>
                </section>
              </div>
              <div>
                <Chip class="ms-1 mb-1" v-for="(item, i) in categories" :key="i">
                  <span>{{ item }}</span>
                  <div class="btn p-0 border-0 ms-1" @click="removeCategory(i)">
                    <i class="mdi mdi-close"></i>
                  </div>
                </Chip>
              </div>
            </div>
            <div>
              <div class="d-flex">
                <v-file-input
                  name="photos"
                  id="inputImage"
                  v-model="productImage"
                  chips
                  multiple
                  :rules="IMGrules"
                  variant="outlined"
                  accept="image/png, image/jpeg"
                  placeholder="Resim Seçin"
                  prepend-icon="mdi-camera"
                  label="Ürün Resimleri Seçin"
                  :show-size="1000"
                  @click:clear="IMGclear"
                ></v-file-input>
                <div class="btn d-flex align-items-center" @click="resimleriYukle">
                  <i class="mdi mdi-tray-arrow-up fs-4"></i>
                  <span class="ms-1" style="white-space: nowrap"> Resimleri Yükle </span>
                </div>
              </div>
              <div :class="isLoaded ? '' : 'd-none'" style="overflow: auto; white-space: nowrap">
                <div v-for="(item, i) in productImage" :id="`placeholder${i}`" class="resim d-inline-block me-1"></div>
              </div>
            </div>
          </form>
        </div>
        <v-divider class="mb-4"></v-divider>
        <div class="text-end">
          <v-btn class="text-none" color="success" rounded variant="flat" @click="urunOlustur"> Ürünü Oluştur </v-btn>
        </div>
      </v-sheet>
    </div>
  </section>
</template>

<script>
import axios from "axios";
import Editor from "primevue/editor";
import Chip from "primevue/chip";
import Toast from "primevue/toast";
import * as jwt from "jose";
export default {
  components: { Editor, Chip, Toast },
  data() {
    return {
      productName: null,
      isLoaded: false,
      seller: null,
      iserror: false,
      errorMessage: "",
      productImage: [],
      productImageNames: [],
      productDesc: null,
      productMoney: null,
      firmName: null,
      category: "",
      category2: [],
      category3: "",
      categories: [],
      defaultCategories: ["kedi", "köpek", "balık", "kuş"],
      defaultCategories2: [
        "airedale terrier",
        "australian terrier",
        "basenji",
        "basset",
        "beagle",
        "bedlington terrier",
        "bernese mountain dog",
        "bloodhound",
        "border collie",
        "boston terrier",
        "chihuahua",
        "chow chow",
        "doberman",
        "english foxhound",
        "french bulldog",
        "german shepherd",
        "golden retriever",
        "keeshond",
        "labrador retriever",
        "leonberg",
        "maltese",
        "pit bull",
        "pomeranian",
        "pug",
        "siberian husky",
        "toy poodle",
        "toy terrier",
        "yorkshire",
      ],
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
            if (value.length > 15) {
              this.iserror = true;
              this.errorMessage = "En fazla 15 adet resim seçilmelidir.";
              return "En fazla 15 adet resim seçilmelidir.";
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
        this.seller = payload.data.username;
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
    IMGclear() {
      this.isLoaded = false;
      this.productImageNames = [];
    },
    async resimleriYukle() {
      if (!this.iserror && this.productImage.length > 0) {
        if (this.productName && this.firmName) {
          const form = document.querySelector("form");
          const formData = new FormData(form);
          await axios({
            method: "post",
            url: "http://localhost:5000/api/seller/uploadimage",
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
                for (let i = 0; i < this.productImage.length; i++) {
                  const placeholder = document.getElementById(`placeholder${i}`);
                  try {
                    placeholder.style.backgroundImage = `url(http://localhost:5000/images/productImage/${this.seller}--${this.productName}--${this.firmName}--${this.productImage[i].name})`;
                    this.productImageNames.push(`${this.seller}--${this.productName}--${this.firmName}--${this.productImage[i].name}`);
                  } catch (error) {
                    placeholder.style.backgroundImage = "url(../../assets/empty.jpg)";
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
            detail: "Resimleri yüklemek için ürün adı ve ürün markası alanları doldurulmalıdır!",
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
    async urunOlustur() {
      if (!this.iserror) {
        if (
          this.seller &&
          this.productName &&
          this.productImageNames.length > 0 &&
          this.productDesc &&
          this.productMoney &&
          this.firmName &&
          this.categories.length > 0 &&
          this.stock &&
          this.isLoaded
        ) {
          await axios({
            method: "post",
            url: "http://localhost:5000/api/seller/createproduct",
            data: {
              seller: this.seller,
              productName: this.productName,
              productImage: this.productImageNames,
              productDesc: this.productDesc,
              productMoney: this.productMoney,
              firmName: this.firmName,
              category: this.categories,
              stock: this.stock,
              jwt: this.getCookie("jwt"),
            },
          })
            .then((res) => {
              if (res.data.status === true) {
                this.seller = null;
                this.productImage = [];
                this.productName = null;
                this.productImageNames = [];
                this.productDesc = null;
                this.productMoney = null;
                this.firmName = null;
                this.categories = [];
                this.stock = null;
                this.$toast.add({
                  severity: "success",
                  summary: "İşlem Başarılı!",
                  detail: res.data.message + " Lütfen ürünü satışa açmak için Ürünlerimi listele sekmesinden ürünün aktifliğini ayarlayınız",
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
            detail: "Ürün oluşturmak için bütün alanları doldurmanız gerekmektedir!",
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
    addCategory(cate) {
      if (cate === 1) {
        this.categories.push(this.category);
        this.category = "";
      } else if (cate === 2) {
        this.categories = this.categories.slice(0, 1);
        this.categories.push(...this.category2);
      } else {
        this.categories.push(this.category3);
        this.category3 = "";
      }
    },
    removeCategory(item) {
      if (item === 0) {
        this.categories = [];
        this.category2 = [];
        this.category3 = "";
      } else {
        let left = this.categories.slice(0, item);
        let right = this.categories.slice(item + 1, this.categories.length);
        this.categories = [...left, ...right];
        let left2 = this.category2.slice(0, item - 1);
        let right2 = this.category2.slice(item, this.category2.length);
        this.category2 = [...left2, ...right2];
      }
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
  background: url("../../assets/empty.jpg");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.btn:active {
  border-color: transparent !important;
}
</style>

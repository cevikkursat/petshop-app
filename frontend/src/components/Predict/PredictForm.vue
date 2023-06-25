<template>
  <main class="container-md my-5 d-flex justify-content-center">
    <Toast />
    <div class="row w-100 h-100 justify-content-center align-items-center" v-if="!tahminSonuc.success">
      <div class="col-11 d-flex justify-content-center mb-5">
        <div id="placeholder" class="w-100" style="max-width: 450px"></div>
      </div>
      <div class="col-11 d-flex justify-content-center mb-5">
        <form class="w-100" action="" method="post" style="max-width: 450px">
          <v-file-input
            name="image"
            id="inputImage"
            v-model="file"
            chips
            :rules="rules"
            variant="outlined"
            accept="image/png, image/jpeg"
            placeholder="Resim Seçin"
            prepend-icon="mdi-camera"
            label="Tahmin Edilecek Resim Seçin"
            :show-size="1000"
            @input="showImg"
            @click:clear="clear"
          ></v-file-input>
          <div class="text-end m-0 p-0">
            <v-btn :loading="loading" @click="tahminEt" style="text-transform: capitalize">
              Tahmin Et
              <v-progress-linear indeterminate></v-progress-linear>
            </v-btn>
          </div>
        </form>
      </div>
      <div class="col-10 d-flex justify-content-center mb-5">
        <v-alert
          border="start"
          border-color="blue accent-4"
          elevation="2"
          title="Tahmin Hakkında"
          text="Tahmin 28 köpek türü üzerinde çalışmaktadır. Herhangi bir resmi de bu 28 tür köpekten biri olarak tahmin edebilir!"
        >
          <pre v-if="goster">
Bu Türler; 
◉ airedale terrier 
◉ australian terrier 
◉ basenji 
◉ basset 
◉ beagle 
◉ bedlington terrier 
◉ bernese mountain dog 
◉ bloodhound 
◉ border collie 
◉ boston terrier 
◉ chihuahua 
◉ chow chow 
◉ doberman 
◉ english foxhound 
◉ french bulldog 
◉ german shepherd 
◉ golden retriever
◉ keeshond 
◉ labrador retriever 
◉ leonberg 
◉ maltese 
◉ pit bull 
◉ pomeranian 
◉ pug 
◉ siberian husky 
◉ toy poodle 
◉ toy terrier 
◉ yorkshire</pre
          >
          <v-btn class="d-block mt-2" variant="tonal" @click="goster = !goster"> {{ goster ? "Türleri Gösterme" : "Türleri Gör" }} </v-btn>
        </v-alert>
      </div>
    </div>
    <div class="w-100 mb-5" v-else>
      <div class="row w-100 m-0">
        <div class="col-12 col-sm-8 order-sm-first fs-3 fw-bolder mt-2 mt-sm-0 p-0">{{ tahminSonuc.breed.name }}</div>
        <div class="col-12 col-sm-4 order-first text-sm-end text-center p-0">
          <v-btn class="me-2" prepend-icon="mdi-plus" @click="aramaYap" style="text-transform: capitalize"> Türe Ait Ürünleri Getir </v-btn>
          <v-btn prepend-icon="mdi-plus" @click="yeniTahmin" style="text-transform: capitalize"> Yeni Tahmin </v-btn>
        </div>
      </div>

      <v-sheet elevation="12" rounded="lg" class="p-3 row g-0 w-100 m-0 my-3 d-flex align-items-center">
        <v-img class="col-12 col-sm-4" aspect-ratio="16/9" :src="tahminSonuc.breed.pic"></v-img>
        <div class="col-12 col-sm-8">{{ tahminSonuc.breed.desc }}</div>
      </v-sheet>

      <v-sheet elevation="12" rounded="lg" class="row w-100 m-0 my-3 p-3 g-0 text-center">
        <div class="row">
          <div
            class="col-12 col-sm-6 col-lg-4"
            v-for="(rate, key) in tahminSonuc.breed.ratings"
            :key="key"
            :style="key === '_id' ? 'display:none' : 'display:block'"
          >
            <div class="fs-5 fw-bolder">{{ key.toString().replaceAll("_", " ") }}</div>
            <v-rating
              readonly
              style="color: silver"
              v-model="tahminSonuc.breed.ratings[key]"
              density="compact"
              empty-icon="mdi-circle-outline"
              full-icon="mdi-circle"
            ></v-rating>
          </div>
        </div>
      </v-sheet>

      <div class="row w-100 m-0 my-3 d-flex justify-content-between justify-content-lg-around">
        <v-sheet elevation="12" rounded="lg" class="p-2 col-12 col-md-3 me-1 mt-2 col-lg-auto g-0 text-center p-3">
          <div class="fs-5 fw-bolder">Tür</div>
          <div>{{ tahminSonuc.breed.Tür }}</div>
        </v-sheet>
        <v-sheet elevation="12" rounded="lg" class="p-2 col-12 col-md-3 me-1 mt-2 col-lg-auto g-0 text-center p-3">
          <div class="fs-5 fw-bolder">Ağırlık</div>
          <div>{{ tahminSonuc.breed.Ağırlık }}</div>
        </v-sheet>
        <v-sheet elevation="12" rounded="lg" class="p-2 col-12 col-md-3 me-1 mt-2 col-lg-auto g-0 text-center p-3">
          <div class="fs-5 fw-bolder">Yükseklik</div>
          <div>{{ tahminSonuc.breed.Yükseklik }}</div>
        </v-sheet>
        <v-sheet elevation="12" rounded="lg" class="p-2 col-12 col-md-3 me-1 mt-2 col-lg-auto g-0 text-center p-3">
          <div class="fs-5 fw-bolder">Aile</div>
          <div>{{ tahminSonuc.breed.Aile }}</div>
        </v-sheet>
        <v-sheet elevation="12" rounded="lg" class="p-2 col-12 col-md-3 me-1 mt-2 col-lg-auto g-0 text-center p-3">
          <div class="fs-5 fw-bolder">Menşei</div>
          <div>{{ tahminSonuc.breed.Menşei }}</div>
        </v-sheet>
        <v-sheet elevation="12" rounded="lg" class="p-2 col-12 col-md-3 me-1 mt-2 col-lg-auto g-0 text-center p-3">
          <div class="fs-5 fw-bolder">Yaşam Süresi</div>
          <div>{{ tahminSonuc.breed.Yaşam_Süresi }}</div>
        </v-sheet>
      </div>

      <v-sheet elevation="12" rounded="lg" class="p-3 row w-100 m-0 my-3">
        <v-tabs v-model="tab">
          <v-tab style="text-transform: capitalize; font-weight: bolder !important; font-size: larger" value="one">
            Kişilik & Karakter Özellikleri
          </v-tab>
          <v-tab style="text-transform: capitalize; font-weight: bolder !important; font-size: larger" value="two">Tarih</v-tab>
        </v-tabs>

        <v-card-text class="fs-6">
          <v-window v-model="tab" style="max-height: 400px; overflow: auto; height: 400px">
            <v-window-item value="one" style="white-space: pre-line"> {{ tahminSonuc.breed.Karakter }} </v-window-item>
            <v-window-item value="two" style="white-space: pre-line"> {{ tahminSonuc.breed.Tarih }} </v-window-item>
          </v-window>
        </v-card-text>
      </v-sheet>

      <v-sheet elevation="12" rounded="lg" class="p-3 row w-100 m-0 my-3">
        <div class="fs-5 fw-bolder">Fiziksel Nitelikler</div>
        <v-expansion-panels variant="inset" class="my-4">
          <v-expansion-panel
            v-for="(text, key) in tahminSonuc.breed.Fiziksel_Nitelikler"
            :style="key === '_id' ? 'display:none' : 'display:block'"
            :key="key"
            :title="key === 'Bacaklar_Ayaklar' ? 'Bacaklar ve Ayaklar' : key"
            :text="text"
          ></v-expansion-panel>
        </v-expansion-panels>
      </v-sheet>

      <v-sheet elevation="12" rounded="lg" class="p-3 row w-100 m-0 my-3">
        <v-tabs v-model="tabTwo">
          <v-tab style="text-transform: capitalize; font-weight: bolder !important; font-size: larger" value="one">Bakım</v-tab>
          <v-tab style="text-transform: capitalize; font-weight: bolder !important; font-size: larger" value="two">Beslenme</v-tab>
          <v-tab style="text-transform: capitalize; font-weight: bolder !important; font-size: larger" value="three">Egzersiz</v-tab>
          <v-tab style="text-transform: capitalize; font-weight: bolder !important; font-size: larger" value="four">Eğitim</v-tab>
          <v-tab style="text-transform: capitalize; font-weight: bolder !important; font-size: larger" value="five">Sağlık</v-tab>
        </v-tabs>

        <v-card-text class="fs-6">
          <v-window v-model="tabTwo" style="max-height: 400px; overflow: auto; height: 400px">
            <v-window-item value="one" style="white-space: pre-line"> {{ tahminSonuc.breed.Bakım.Bakım }} </v-window-item>
            <v-window-item value="two" style="white-space: pre-line"> {{ tahminSonuc.breed.Bakım.Beslenme }} </v-window-item>
            <v-window-item value="three" style="white-space: pre-line"> {{ tahminSonuc.breed.Bakım.Egzersiz }} </v-window-item>
            <v-window-item value="four" style="white-space: pre-line"> {{ tahminSonuc.breed.Bakım.Eğitim }} </v-window-item>
            <v-window-item value="five" style="white-space: pre-line"> {{ tahminSonuc.breed.Bakım.Sağlık }} </v-window-item>
          </v-window>
        </v-card-text>
      </v-sheet>
    </div>
  </main>
</template>

<script>
import axios from "axios";
import Toast from "primevue/toast";
export default {
  components: { Toast },
  data: () => ({
    goster: false,
    tab: null,
    tabTwo: null,
    tahminSonuc: {},
    loading: false,
    file: [],
    selectedCategory: null,
    categories: [
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
    rules: [
      (value) => {
        return !value || !value.length || value[0].size < 2000000 || "Resim Boutu 2 MB den daha az olmalıdır.!";
      },
    ],
  }),
  methods: {
    aramaYap() {
      const d = new Date();
      d.setTime(d.getTime() + 1 * 1000 * 60);
      const expires = "expires=" + d.toUTCString();
      document.cookie = "searchFilter=" + this.selectedCategory + ";" + expires + ";path=/search";
      window.location.pathname = "/search/" + this.karakterFormat(this.selectedCategory).replace(" ", "_");
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
    clear() {
      const placeholder = document.getElementById("placeholder");
      placeholder.style.backgroundImage = `url("http://localhost:5000/images/img/empty.jpg")`;
    },
    showImg() {
      const inputImage = document.getElementById("inputImage");
      const placeholder = document.getElementById("placeholder");
      try {
        const reader = new FileReader();
        let i = reader.readAsDataURL(inputImage.files[0]);

        reader.onload = (e) => {
          placeholder.style.backgroundImage = `url(${e.target.result})`;
        };
      } catch (error) {
        placeholder.style.backgroundImage = `url("http://localhost:5000/images/img/empty.jpg")`;
      }
    },
    yeniTahmin() {
      this.loading = false;
      this.tahminSonuc = {};
      this.file = [];
    },
    async tahminEt() {
      if (this.file.length > 0) {
        this.loading = !this.loading;
        const form = document.querySelector("form");
        const formData = new FormData(form);
        if (this.file[0].size < 2000000) {
          await axios({
            method: "post",
            url: "http://localhost:5000/api/predict/predict",
            data: formData,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
            .then((res) => {
              this.loading = false;
              this.tahminSonuc = res.data;
              this.selectedCategory = this.categories[res.data.message];
            })
            .catch((err) => {
              this.loading = false;
              this.$toast.add({
                severity: "error",
                summary: "Hata",
                detail: err.toString(),
                life: 3000,
              });
            });
        } else {
          this.loading = false;
          this.$toast.add({
            severity: "error",
            summary: "Hata",
            detail: "Dosya boyutu çok büyük!",
            life: 3000,
          });
        }
      } else {
        this.$toast.add({
          severity: "error",
          summary: "Hata",
          detail: "Dosya bulunamadı!",
          life: 3000,
        });
      }
    },
  },
};
</script>

<style scoped>
#placeholder {
  border: 3px solid black;
  border-radius: 10px;
  background-color: aqua;
  min-height: 300px;
  background: url("../../assets/empty.jpg");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.elevation-12:hover {
  box-shadow: 0px 7px 8px -4px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, 0.25)),
    0px 12px 17px 2px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.165)),
    0px 5px 22px 4px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.16)) !important;
}
</style>

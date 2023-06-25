<template>
  <section class="container-xxl">
    <Toast />
    <div class="card mt-5" v-if="products.length === 0">
      <div class="card-body fs-5 fw-semibold text-center">Listelenen ürün bulunamadı!</div>
    </div>
    <section v-else class="d-flex">
      <div class="card my-5 col-2 d-none d-lg-block" style="height: min-content">
        <div class="card-body">
          <div class="pt-2 mb-2" style="border: 1px solid black; border-radius: 10px">
            <h6 class="ms-2">Seçilen Filtreler</h6>
            <Chip class="p-1 mx-2 mb-1 d-flex justify-content-between align-items-center" v-for="(selected, i) in selectedfirmName" :key="i">
              <small class="bg-grey rounded-5 p-1">Marka</small>
              <span>{{ selected }}</span>
              <button class="border border-dark rounded-5 px-1" @click="deleteFirmFilter(i)">
                <i class="mdi mdi-close"></i>
              </button>
            </Chip>
            <Chip class="p-1 mx-2 mb-1 d-flex justify-content-between align-items-center" v-for="(selected, i) in selectedcategories" :key="i">
              <small class="bg-grey rounded-5 p-1">Kategori</small>
              <span>{{ selected }}</span>
              <button class="border border-dark rounded-5 px-1" @click="deleteCateFilter(i)">
                <i class="mdi mdi-close"></i>
              </button>
            </Chip>
            <Chip class="p-1 mx-2 mb-1 d-flex justify-content-between align-items-center" v-if="selectedPrice.length > 0">
              <small class="bg-grey rounded-5 p-1">Fiyat</small>
              <span>{{ selectedPrice[0] }}TL - {{ selectedPrice[1] }}TL</span>
              <button class="border border-dark rounded-5 px-1" @click="deletePriceFilter">
                <i class="mdi mdi-close"></i>
              </button>
            </Chip>
            <Chip class="p-1 mx-2 mb-1 d-flex justify-content-between align-items-center" v-if="selectedRating !== 'hepsi'">
              <small class="bg-grey rounded-5 p-1">Rating</small>
              <span>{{ selectedRating }}</span>
              <button class="border border-dark rounded-5 px-1" @click="deleteRatingFilter">
                <i class="mdi mdi-close"></i>
              </button>
            </Chip>
          </div>
          <div
            class="d-flex justify-content-center mb-2"
            v-if="selectedPrice.length > 0 || selectedRating !== 'hepsi' || selectedcategories.length > 0 || selectedfirmName.length > 0"
          >
            <v-btn
              class="text-center"
              style="text-transform: capitalize"
              v-if="filtered"
              @click="
                {
                  selectedPrice = [];
                  selectedRating = 'hepsi';
                  selectedcategories = [];
                  selectedfirmName = [];
                  filtered = false;
                  urnleriGetir(false);
                }
              "
              >Filtreleri Temizle</v-btn
            >
            <v-btn class="text-center" style="text-transform: capitalize" v-if="!filtered" @click="urnleriGetir(true)">Filtreleri Uygula</v-btn>
          </div>
          <div class="ps-3 pt-3 mb-2" style="border: 1px solid black; border-radius: 10px">
            <h6>Kategori</h6>
            <div style="max-height: 300px; overflow-y: scroll" class="ov me-1 mb-1">
              <div v-for="(category, i) in cate" :key="i" class="d-flex align-items-center mb-1">
                <Checkbox
                  v-model="selectedcategories"
                  :inputId="i.toString()"
                  :name="`category-${category}`"
                  :value="category"
                  @change="filtered = false"
                />
                <label :for="i.toString()" class="ms-2">{{ category }}</label>
              </div>
            </div>
          </div>
          <div class="ps-3 pt-3 mb-2" style="border: 1px solid black; border-radius: 10px">
            <h6>Marka</h6>
            <div style="max-height: 300px; overflow-y: scroll" class="ov me-1 mb-1">
              <div v-for="(firm, i) in firms" :key="i" class="d-flex align-items-center mb-1">
                <Checkbox v-model="selectedfirmName" :inputId="i.toString()" :name="`category-${firm}`" :value="firm" @change="filtered = false" />
                <label :for="i.toString()" class="ms-2">{{ firm }}</label>
              </div>
            </div>
          </div>
          <div class="px-3 pt-3 mb-2" style="border: 1px solid black; border-radius: 10px">
            <h6>Fiyat</h6>
            <div class="d-flex justify-content-between align-items-center">
              <span>Min.</span>
              <input type="range" class="form-range mx-2" :min="min" :max="max" v-model="minPrice" />
              <span>{{ minPrice }}</span>
            </div>
            <div class="d-flex justify-content-between align-items-center">
              <span>Max.</span>
              <input type="range" class="form-range mx-2" :min="min" :max="max" v-model="maxPrice" />
              <span>{{ maxPrice }}</span>
            </div>
            <div class="d-flex justify-content-between align-items-center">
              <v-btn
                variant="tonal"
                class="my-2 w-100"
                style="text-transform: capitalize"
                @click="
                  {
                    getPriceFilter();
                    filtered = false;
                  }
                "
              >
                Filtreyi Uygula
              </v-btn>
            </div>
          </div>
          <div class="px-3 pt-3 mb-2" style="border: 1px solid black; border-radius: 10px">
            <h6>Rating</h6>
            <div class="d-flex justify-content-start align-items-center mb-1">
              <RadioButton v-model="selectedRating" inputId="5" name="rating" value="5" @change="filtered = false" />
              <label for="5" class="ml-2"><i class="mdi mdi-star"></i>5</label>
            </div>
            <div class="d-flex justify-content-start align-items-center mb-1">
              <RadioButton v-model="selectedRating" inputId="4" name="rating" value="4" @change="filtered = false" />
              <label for="4" class="ml-2"><i class="mdi mdi-star"></i>4 ve üzeri</label>
            </div>
            <div class="d-flex justify-content-start align-items-center mb-1">
              <RadioButton v-model="selectedRating" inputId="3" name="rating" value="3" @change="filtered = false" />
              <label for="3" class="ml-2"><i class="mdi mdi-star"></i>3 ve üzeri</label>
            </div>
            <div class="d-flex justify-content-start align-items-center mb-1">
              <RadioButton v-model="selectedRating" inputId="2" name="rating" value="2" @change="filtered = false" />
              <label for="2" class="ml-2"><i class="mdi mdi-star"></i>2 ve üzeri</label>
            </div>
            <div class="d-flex justify-content-start align-items-center mb-1">
              <RadioButton v-model="selectedRating" inputId="1" name="rating" value="1" @change="filtered = false" />
              <label for="1" class="ml-2"><i class="mdi mdi-star"></i>1 ve üzeri</label>
            </div>
            <div class="d-flex justify-content-start align-items-center mb-1">
              <RadioButton v-model="selectedRating" inputId="0" name="rating" value="hepsi" @change="filtered = false" />
              <label for="0" class="ml-2"><i class="mdi mdi-star"></i>Hepsi</label>
            </div>
          </div>
        </div>
      </div>
      <div class="my-5 mx-1 col-12 col-xl-10">
        <DataView :value="products" :layout="layout" class="card">
          <template #header>
            <div class="d-flex justify-content-between">
              <div></div>
              <div>
                <DataViewLayoutOptions v-model="layout" />
              </div>
            </div>
          </template>

          <template #list="slotProps">
            <div class="col-12">
              <ProductCardLeft class="m-1 p-1">
                <template #badge v-if="slotProps.data.productStatus === 'outofstock'">Stok Yok</template>
                <template #badge v-else-if="slotProps.data.productDiscount">İndirim</template>
                <template #img>
                  <img
                    :src="`http://localhost:5000/images/productImage/${slotProps.data.productImage[0]}`"
                    :alt="slotProps.data.productName"
                    class="rounded-3 img-thumbnail"
                    style="width: 200px; aspect-ratio: 1; object-fit: contain"
                  />
                </template>
                <template #firmName>{{ slotProps.data.firmName }}</template>
                <template #price v-if="slotProps.data.productDiscount"
                  >{{ new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(slotProps.data.productDiscountMoney) }}
                </template>
                <template #countedPrice
                  >{{ new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(slotProps.data.productMoney) }}
                </template>
                <template #productName>{{ slotProps.data.productName }}</template>
                <template #rating>
                  <v-rating
                    v-model="slotProps.data.rating"
                    size="small"
                    density="compact"
                    readonly
                    color="yellow-darken-3"
                    half-increments
                  ></v-rating>
                  <span class="text-muted small ms-1 pt-1">{{ Math.round(slotProps.data.rating * 10) / 10 }}</span>
                </template>
                <template #btns>
                  <v-btn
                    v-if="slotProps.data.productStatus === 'outofstock'"
                    disabled
                    icon="mdi-cart-plus"
                    class="btn-action p-2 mb-1"
                    @click="store.setCart(slotProps.data._id)"
                  >
                    <i class="mdi mdi-cart-plus"></i>
                    <v-tooltip activator="parent" location="start">Sepete Ekle</v-tooltip>
                  </v-btn>
                  <v-btn v-else icon="mdi-cart-plus" class="btn-action p-2 mb-1" @click="store.setCart(slotProps.data._id)">
                    <i class="mdi mdi-cart-plus"></i>
                    <v-tooltip activator="parent" location="start">Sepete Ekle</v-tooltip>
                  </v-btn>
                  <RouterLink :to="'/product/' + slotProps.data._id">
                    <v-btn icon="mdi-eye " class="btn-action p-2">
                      <i class="mdi mdi-eye"></i>
                      <v-tooltip activator="parent" location="start">Ürünü Gör</v-tooltip>
                    </v-btn>
                  </RouterLink>
                </template>
              </ProductCardLeft>
            </div>
          </template>

          <template #grid="slotProps">
            <div class="d-inline-flex col-6 col-sm-4 col-md-3">
              <ProductCard class="p-1 m-2">
                <template #badge v-if="slotProps.data.productStatus === 'outofstock'">Stok Yok</template>
                <template #badge v-else-if="slotProps.data.productDiscount">İndirim</template>
                <template #img>
                  <img
                    :src="`http://localhost:5000/images/productImage/${slotProps.data.productImage[0]}`"
                    :alt="slotProps.data.productName"
                    class="mb-3 img-thumbnail"
                    style="width: 200px; aspect-ratio: 1; object-fit: contain"
                  />
                </template>
                <template #firmName>{{ slotProps.data.firmName }}</template>
                <template #price v-if="slotProps.data.productDiscount"
                  >{{ new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(slotProps.data.productDiscountMoney) }}
                </template>
                <template #countedPrice
                  >{{ new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(slotProps.data.productMoney) }}
                </template>
                <template #productName>{{ slotProps.data.productName }}</template>
                <template #rating>
                  <v-rating
                    v-model="slotProps.data.rating"
                    size="small"
                    density="compact"
                    readonly
                    color="yellow-darken-3"
                    half-increments
                  ></v-rating>
                  <span class="text-muted small ms-1 pt-1">{{ Math.round(slotProps.data.rating * 10) / 10 }}</span>
                </template>
                <template #addCart>
                  <v-btn
                    v-if="slotProps.data.productStatus === 'outofstock'"
                    disabled
                    prepend-icon="mdi-cart-plus"
                    variant="tonal"
                    @click="store.setCart(slotProps.data._id)"
                  >
                    Sepete Ekle
                  </v-btn>
                  <v-btn v-else prepend-icon="mdi-cart-plus" variant="tonal" @click="store.setCart(slotProps.data._id)"> Sepete Ekle </v-btn>
                </template>
                <template #productView>
                  <RouterLink :to="'/product/' + slotProps.data._id">
                    <v-btn icon="mdi-eye " class="btn-action p-2">
                      <i class="mdi mdi-eye"></i>
                      <v-tooltip activator="parent" location="start">Ürünü Gör</v-tooltip>
                    </v-btn>
                  </RouterLink>
                </template>
              </ProductCard>
            </div>
          </template>
          <template #footer>
            <div class="d-flex align-items-center">
              <div class="me-5">Toplam {{ totalProducts }} ürün bulunuyor.</div>
              <select
                v-model="productsPerPage"
                class="form-select"
                style="max-width: 70px"
                @change="
                  {
                    pageNumber = 1;
                    urnleriGetir(filtered);
                  }
                "
              >
                <option selected :value="10">10</option>
                <option :value="20">20</option>
                <option :value="30">30</option>
              </select>
            </div>
            <v-pagination
              v-model="pageNumber"
              :length="Math.ceil(totalProducts / productsPerPage)"
              rounded="circle"
              @update:modelValue="urnleriGetir(filtered)"
            ></v-pagination>
          </template>
        </DataView>
      </div>
    </section>
  </section>
</template>

<script>
import Checkbox from "primevue/Checkbox";
import Chip from "primevue/chip";
import Skeleton from "primevue/skeleton";
import RadioButton from "primevue/radiobutton";
import axios from "axios";
import DataView from "primevue/dataview";
import DataViewLayoutOptions from "primevue/dataviewlayoutoptions";
import Toast from "primevue/toast";
import ProductCard from "./ProductCard.vue";
import ProductCardLeft from "./ProductCardLeft.vue";
import { useCart } from "../../stores/cart.js";

export default {
  setup() {
    const store = useCart();
    return { store };
  },
  components: { ProductCard, ProductCardLeft, Checkbox, Chip, RadioButton, Skeleton, Toast, DataView, DataViewLayoutOptions },
  data() {
    return {
      products: [],
      layout: "grid",
      selectedfirmName: [],
      selectedcategories: [],
      selectedRating: "hepsi",
      selectedPrice: [],
      minPrice: 10,
      maxPrice: 1000,
      max: 1000,
      min: 10,
      totalProducts: 0,
      pageNumber: 1,
      productsPerPage: 10,
      tur: null,
      firms: [],
      cate: [],
      filtered: false,
    };
  },
  async mounted() {
    if (window.location.pathname.split("/")[1].split("-")[0] === "dog") this.tur = "köpek";
    else if (window.location.pathname.split("/")[1].split("-")[0] === "cat") this.tur = "kedi";
    else if (window.location.pathname.split("/")[1].split("-")[0] === "fish") this.tur = "balık";
    else if (window.location.pathname.split("/")[1].split("-")[0] === "bird") this.tur = "kuş";
    this.urnleriGetir(false);
  },
  methods: {
    filtreKontrol() {
      this.filtered = false;
      if (
        this.selectedPrice.length <= 0 &&
        this.selectedRating === "hepsi" &&
        this.selectedcategories.length <= 0 &&
        this.selectedfirmName.length <= 0
      ) {
        this.urnleriGetir(false);
      }
    },
    async urnleriGetir(isFilter) {
      if (!isFilter) {
        await axios({
          method: "post",
          url: "http://localhost:5000/api/user/getProducts",
          data: {
            tur: this.tur,
            startsPoint: (this.pageNumber - 1) * this.productsPerPage,
            count: this.productsPerPage,
          },
        })
          .then((res) => {
            if (res.data.status === true) {
              this.products = res.data.products;
              this.totalProducts = res.data.totalProducts;
              this.firms = res.data.firms;
              this.cate = res.data.cate;
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
        await axios({
          method: "post",
          url: "http://localhost:5000/api/user/getProducts",
          data: {
            tur: this.tur,
            startsPoint: (this.pageNumber - 1) * this.productsPerPage,
            selectedfirmName: this.selectedfirmName,
            selectedcategories: this.selectedcategories,
            selectedRating: this.selectedRating,
            selectedPrice: this.selectedPrice,
            filtered: isFilter,
            count: this.productsPerPage,
          },
        })
          .then((res) => {
            if (res.data.status === true) {
              this.products = res.data.products;
              this.totalProducts = res.data.totalProducts;
              this.firms = res.data.firms;
              this.cate = res.data.cate;
              this.filtered = true;
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
    deleteFirmFilter(data) {
      let left = this.selectedfirmName.slice(0, data);
      let right = this.selectedfirmName.slice(data + 1, this.selectedfirmName.length);
      this.selectedfirmName = [...left, ...right];
      this.filtreKontrol();
    },
    deleteCateFilter(data) {
      let left = this.selectedcategories.slice(0, data);
      let right = this.selectedcategories.slice(data + 1, this.selectedcategories.length);
      this.selectedcategories = [...left, ...right];
      this.filtreKontrol();
    },
    getPriceFilter() {
      if (this.maxPrice > this.minPrice) {
        this.selectedPrice = [this.minPrice, this.maxPrice];
      } else console.log("hata");
    },
    deletePriceFilter() {
      this.selectedPrice = [];
      this.filtreKontrol();
    },
    deleteRatingFilter() {
      this.selectedRating = "hepsi";
      this.filtreKontrol();
    },
  },
};
</script>

<style scoped>
.ov::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 100px;
  background-color: #f5f5f5;
}

.ov::-webkit-scrollbar {
  width: 8px;
  background-color: #f5f5f5;
}

.ov::-webkit-scrollbar-thumb {
  border-radius: 100px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #444242;
}

.btn-action {
  background-color: rgb(151, 147, 147);
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px -1px rgba(145, 158, 171, 0.2), 0 4px 5px 0 rgba(145, 158, 171, 0.14), 0 1px 10px 0 rgba(145, 158, 171, 0.12);
  color: rgb(255, 255, 255);
  font-size: 14px;
  transition: all 0.3s ease 0s;
  width: min-content !important;
  height: min-content !important;
}
</style>

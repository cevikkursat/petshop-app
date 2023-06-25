<template>
  <section class="mt-5 container">
    <Toast />
    <div class="w-100">
      <v-sheet elevation="12" rounded="lg" class="p-4 w-100 h-100">
        <h3>Sipariş Listesi</h3>
        <div class="container-fluid">
          <div class="card mb-2 p-2">
            <div class="d-flex justify-content-between">
              <select v-model="filter" class="form-select" style="max-width: max-content; max-height: 50px">
                <option value="selected">Bir Durum Seçiniz</option>
                <option value="standing">Hazırlanıyor</option>
                <option value="shipment">Yolda</option>
                <option value="delivered">Teslim Edildi</option>
                <option value="cancel">İptal Edildi</option>
                <option value="return">Geri Döndü</option>
              </select>
              <div>
                <v-btn
                  class="me-2"
                  style="text-transform: capitalize"
                  @click="
                    {
                      pageNumber = 1;
                      filtered = true;
                      satislariGetir();
                    }
                  "
                >
                  Siparişi Durumuna Getir
                </v-btn>
                <v-btn
                  style="text-transform: capitalize"
                  @click="
                    {
                      filtered = false;
                      filter = 'selected';
                      satislariGetir();
                    }
                  "
                >
                  Tüm Siparişleri Getir
                </v-btn>
              </div>
            </div>
          </div>
          <div class="card p-2" v-if="orders.length === 0">Sipariş bulunamadı!</div>
          <div class="card p-2" v-else>
            <DataTable :value="orders" removableSort class="border p-0 m-0">
              <Column header="Resim">
                <template #body="slotProps">
                  <img
                    :src="`http://localhost:5000/images/productImage/${slotProps.data.product.productImage[0]}`"
                    :alt="slotProps.data.product.productImage[0]"
                    class="resim"
                  />
                </template>
              </Column>
              <Column field="user.username" sortable header="Müşteri Adı"></Column>
              <Column field="product.productName" sortable header="Ürün Adı"></Column>
              <Column field="product.firmName" sortable header="Marka"></Column>
              <Column field="order.orderPiece" sortable header="Adet"></Column>
              <Column field="order.orderMoney" sortable header="Fiyat">
                <template #body="slotProps">
                  {{ new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(slotProps.data.order.orderMoney) }}
                </template>
              </Column>
              <Column field="order.orderDate" sortable header="Sipariş Tarihi">
                <template #body="slotProps">
                  {{ getTime(slotProps.data.order.orderDate) }}
                </template>
              </Column>
              <Column field="order.orderAdress" sortable header="Adres"></Column>
              <Column field="order.orderStatus" sortable header="Durum">
                <template #body="slotProps">
                  <Tag v-if="slotProps.data.order.orderStatus == 'standing'" value="Hazırlanıyor" severity="info" />
                  <Tag v-else-if="slotProps.data.order.orderStatus == 'shipment'" value="Gönderildi" severity="warning" />
                  <Tag v-else-if="slotProps.data.order.orderStatus == 'delivered'" value="Teslim Edildi" severity="success" />
                  <Tag v-else-if="slotProps.data.order.orderStatus == 'cancel'" value="İptal Edildi" severity="danger" />
                  <Tag v-else value="Geri Döndü" severity="danger" />
                </template>
              </Column>

              <Column header="İşlemler">
                <template #body="slotProps">
                  <v-tooltip text="Ürün Durumu Değiştir" location="top">
                    <template v-slot:activator="{ props }">
                      <v-btn
                        v-bind="props"
                        icon="mdi-cog"
                        density="compact"
                        class="m-1"
                        @click="sec(slotProps.data.order._id, slotProps.data.order.orderStatus)"
                      >
                      </v-btn>
                    </template>
                  </v-tooltip>
                </template>
              </Column>
              <template #footer>
                <div class="d-flex align-items-center">
                  <div class="me-5">Toplam {{ totalOrders }} ürün bulunuyor.</div>
                  <select
                    v-model="productsPerPage"
                    class="form-select"
                    style="max-width: 70px"
                    @change="
                      {
                        pageNumber = 1;
                        satislariGetir();
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
                  :length="Math.ceil(totalOrders / productsPerPage)"
                  rounded="circle"
                  @update:modelValue="satislariGetir()"
                ></v-pagination>
              </template>
            </DataTable>
          </div>
          <Dialog
            v-model:visible="visible"
            header="Durum Ayarları"
            :style="{ width: '50vw' }"
            :breakpoints="{ '960px': '75vw', '641px': '100vw' }"
            position="top"
            modal
          >
            <select v-model="selectedOrderStatus" class="form-select" aria-label="Default select example">
              <option value="selected">Bir Durum Seçiniz</option>
              <option value="standing">Hazırlanıyor</option>
              <option value="shipment">Yolda</option>
              <option value="delivered">Teslim Edildi</option>
              <option value="cancel">İptal Edildi</option>
              <option value="return">Geri Döndü</option>
            </select>
            <template #footer>
              <v-btn class="m-1" @click="satisDurumuDegistir()"> Sipariş Durumunu Kaydet </v-btn>
            </template>
          </Dialog>
        </div>
      </v-sheet>
    </div>
  </section>
</template>

<script>
import DataTable from "primevue/datatable";
import Tag from "primevue/tag";
import Column from "primevue/column";
import axios from "axios";
import Toast from "primevue/toast";
import Dialog from "primevue/dialog";
import * as jwt from "jose";
export default {
  components: { Toast, DataTable, Column, Tag, Dialog },
  data() {
    return {
      visible: false,
      filtered: false,
      username: null,
      orders: [],
      totalOrders: 0,
      pageNumber: 1,
      productsPerPage: 10,
      filter: "selected",
      selectedOrder: null,
      selectedOrderStatus: "selected",
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
    this.satislariGetir();
  },
  methods: {
    sec(id, status) {
      if (status === "delivered")
        this.$toast.add({
          severity: "error",
          summary: "Hata",
          detail: "Teslim Edilmiş Sipariş Değiştirilemez",
          life: 3000,
        });
      else {
        this.selectedOrder = id;
        this.visible = true;
      }
    },
    getTime(time) {
      const times = new Date(time);
      return times.toLocaleString("tr-TR");
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
    async satislariGetir() {
      await axios({
        method: "post",
        url: "http://localhost:5000/api/seller/getsales",
        data: {
          filtered: this.filtered,
          filter: this.filter,
          startsPoint: (this.pageNumber - 1) * this.productsPerPage,
          count: this.productsPerPage,
          username: this.username,
          jwt: this.getCookie("jwt"),
        },
      })
        .then((res) => {
          if (res.data.status === true) {
            this.orders = res.data.orders;
            this.totalOrders = res.data.totalOrders;
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
    async satisDurumuDegistir() {
      if (this.selectedOrderStatus != "selected") {
        await axios({
          method: "post",
          url: "http://localhost:5000/api/seller/setsalesstatus",
          data: {
            orderID: this.selectedOrder,
            status: this.selectedOrderStatus,
            jwt: this.getCookie("jwt"),
          },
        })
          .then((res) => {
            if (res.data.status === true) {
              this.$toast.add({
                severity: "success",
                summary: "Başarılı",
                detail: res.data.message,
                life: 3000,
              });
              for (let index = 0; index < this.orders.length; index++) {
                const element = this.orders[index];
                if (element.order._id.toString() === this.selectedOrder.toString()) {
                  this.orders[index].order.orderStatus = this.selectedOrderStatus;
                }
                this.visible = false;
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
          detail: "Durum Seçiniz!",
          life: 3000,
        });
      }
    },
  },
};
</script>

<style scoped>
.resim {
  border: 2px solid black;
  border-radius: 10px;
  background-color: aqua;
  aspect-ratio: 1;
  width: 50px;
  background: url("../assets/empty.jpg");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
</style>

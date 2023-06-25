<template>
  <section class="my-5 container">
    <Toast />
    <div v-if="orders.length === 0" class="card p-2 mt-2 text-center">Sipariş Bulunmuyor!</div>
    <DataTable
      v-else
      removableSort
      v-model:expandedRows="expandedRows"
      sortField="orderDate"
      :sortOrder="-1"
      paginator
      :rows="5"
      :rowsPerPageOptions="[5, 10, 20, 50]"
      :value="orders"
      dataKey="orderCode"
      tableStyle="min-width: 60rem"
      class="card"
    >
      <Column expander style="width: 5rem; color: black">
        <template #body="slotProps">
          <v-btn
            :icon="slotProps.data.orderCode === (expandedRows.length > 0 ? expandedRows[0].orderCode : 0) ? 'mdi-chevron-up' : 'mdi-chevron-down'"
            variant="plain"
            @click="selectOrder(slotProps.data.orderCode)"
          >
          </v-btn>
        </template>
      </Column>
      <Column header="Sipariş Numarası" field="orderCode"></Column>
      <Column field="totalMoney" sortable header="Toplam Fiyat">
        <template #body="slotProps">
          {{ new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(slotProps.data.totalMoney) }}
        </template>
      </Column>
      <Column field="totalPiece" header="Toplam Ürün Adeti" sortable></Column>
      <Column field="orderAdress" header="Sipariş Adresi" sortable></Column>
      <Column header="Sipariş Tarihi" field="orderDate" sortable>
        <template #body="slotProps">
          {{ getTime(slotProps.data.orderDate) }}
        </template>
      </Column>
      <template #expansion="slotProps">
        <div class="p-3">
          <h5>Ürünler</h5>
          <DataTable :value="slotProps.data.product">
            <Column header="Ürün Resmi">
              <template #body="slotProps">
                <img
                  :src="`http://localhost:5000/images/productImage/${slotProps.data.productImage[0]}`"
                  :alt="slotProps.data.productImage[0]"
                  class="resim"
                />
              </template>
            </Column>
            <Column field="productName" header="Ürün Adı" sortable></Column>
            <Column field="firmName" header="Marka" sortable></Column>
            <Column field="orderPiece" header="Ürün Adeti" sortable></Column>
            <Column field="orderMoney" header="Ürün Fiyatı" sortable>
              <template #body="slotProps">
                {{ new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(slotProps.data.orderMoney) }}
              </template>
            </Column>
            <Column header="Ürün Durumu" sortable>
              <template #body="slotProps">
                <Tag v-if="slotProps.data.orderStatus == 'standing'" value="Hazırlanıyor" severity="info" />
                <Tag v-else-if="slotProps.data.orderStatus == 'shipment'" value="Gönderildi" severity="warning" />
                <Tag v-else-if="slotProps.data.orderStatus == 'delivered'" value="Teslim Edildi" severity="success" />
                <Tag v-else-if="slotProps.data.orderStatus == 'cancel'" value="İptal Edildi" severity="danger" />
                <Tag v-else value="Geri Döndü" severity="danger" />
              </template>
            </Column>
            <Column headerStyle="width:4rem">
              <template #body="slotProps">
                <v-btn icon="mdi-star" density="compact" class="m-1" @click="openDialog(slotProps.data.productID)"> </v-btn>
              </template>
            </Column>
          </DataTable>
        </div>
      </template>
      <template #footer>
        <div class="d-flex align-items-center">
          <div class="me-5">Toplam {{ orders.length }} sipariş bulunuyor.</div>
        </div>
      </template>
    </DataTable>
    <Dialog
      v-model:visible="visible"
      header="Yorum Yap"
      :style="{ width: '50vw' }"
      :breakpoints="{ '960px': '75vw', '641px': '100vw' }"
      position="top"
      modal
    >
      <template #header>
        <div class="d-flex align-items-center">
          <i class="mdi mdi-message-plus me-1"></i>
          <span>Yorum Yap</span>
        </div>
      </template>
      <section class="mt-3">
        <div class="row">
          <div class="col-12 col-lg-6">
            <v-text-field v-model="commentTitle" label="Yorum Başlığı" variant="outlined"></v-text-field>
          </div>
          <div class="col-12 col-lg-6 mt-3 mt-md-0 d-flex align-items-center">
            Puan:
            <v-rating
              v-model="messageRating"
              hover
              :active-color="messageRating > 3 ? 'yellow-darken-3' : messageRating > 2 ? 'orange-darken-3' : 'red-darken-3'"
              class="px-2"
              density="comfortable"
            >
            </v-rating>

            {{ messageRating }}
          </div>
        </div>
        <div class="row">
          <h5>Yorum</h5>
          <Editor v-model="commentMessage" editorStyle="height: 320px">
            <template v-slot:toolbar>
              <span class="ql-formats">
                <button class="ql-bold"></button>
                <button class="ql-italic"></button>
                <button class="ql-underline"></button>
                <button class="ql-link"></button>
              </span>
            </template>
          </Editor>
        </div>
      </section>
      <template #footer>
        <v-btn class="m-1" @click="comment()"> Yorumu Kaydet </v-btn>
      </template>
    </Dialog>
  </section>
</template>

<script>
import DataTable from "primevue/datatable";
import Editor from "primevue/editor";
import Tag from "primevue/tag";
import Column from "primevue/column";
import axios from "axios";
import Toast from "primevue/toast";
import Dialog from "primevue/dialog";
import * as jwt from "jose";
export default {
  components: { Toast, DataTable, Column, Tag, Dialog, Editor },
  data() {
    return {
      username: null,
      commentMessage: "",
      commentTitle: null,
      messageRating: 5,
      visible: false,
      orders: [],
      expandedRows: [],
      selectedProduct: null,
    };
  },
  async created() {
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
    this.getOrders();
  },
  methods: {
    openDialog(id) {
      this.selectedProduct = id;
      this.visible = true;
    },
    selectOrder(ordercode) {
      if (this.expandedRows.length > 0) {
        if (this.expandedRows[0].orderCode === ordercode) this.expandedRows = [];
        else this.expandedRows = this.orders.filter((p) => p.orderCode === ordercode);
      } else this.expandedRows = this.orders.filter((p) => p.orderCode === ordercode);
    },
    async getOrders() {
      await axios({
        method: "post",
        url: "http://localhost:5000/api/user/getorders",
        data: {
          jwt: this.getCookie("jwt"),
          username: this.username,
        },
      })
        .then((res) => {
          if (res.data.status) {
            this.orders = res.data.orders;
          } else {
            this.$toast.add({
              severity: "error",
              summary: "İşlem Başarısız",
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
    async comment() {
      if (this.commentMessage != "" && this.commentTitle != null) {
        await axios({
          method: "post",
          url: "http://localhost:5000/api/user/comment",
          data: {
            jwt: this.getCookie("jwt"),
            productid: this.selectedProduct,
            username: this.username,
            commentTitle: this.commentTitle,
            commentText: this.commentMessage,
            rating: this.messageRating,
            commentOrder: this.expandedRows[0],
          },
        })
          .then((res) => {
            if (res.data.status) {
              this.visible = false;
              this.commentMessage = "";
              this.commentTitle = null;
              this.messageRating = 5;
              this.$toast.add({
                severity: "success",
                summary: "İşlem Başarılı",
                detail: res.data.message,
                life: 3000,
              });
            } else {
              this.visible = false;
              this.commentMessage = "";
              this.commentTitle = null;
              this.messageRating = 5;
              this.$toast.add({
                severity: "error",
                summary: "İşlem Başarısız",
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
          summary: "İşlem Başarısız",
          detail: "Bütün alanlar doldurulmalıdır!",
          life: 3000,
        });
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
  },
};
</script>

<style scoped>
.resim {
  border: 2px solid black;
  border-radius: 10px;
  background-color: aqua;
  aspect-ratio: 1;
  width: 75px;
  background: url("../assets/empty.jpg");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
</style>

<template>
  <section class="m-2">
    <Toast />
    <div class="w-100">
      <div class="card p-2" v-if="orders.length === 0">Sipariş bulunamadı!</div>
      <v-sheet v-else elevation="12" rounded="lg" class="p-4 w-100 h-100">
        <h3>Sipariş Listesi</h3>
        <div class="card p-2">
          <DataTable v-model:filters="filters" :value="orders" paginator :rows="10">
            <template #header>
              <div class="w25">
                <v-text-field prepend-icon="mdi-magnify" v-model="filters['global'].value" label="Aranacak Kelime" variant="outlined"></v-text-field>
              </div>
            </template>
            <template #empty> Kullanıcı bulunmuyor. </template>
            <Column field="order.orderCode" sortable header="Sipariş Numarası"></Column>
            <Column field="seller.username" sortable header="Satıcı"></Column>
            <Column field="orderer.username" sortable header="Müşteri"></Column>
            <Column field="product.productName" sortable header="Ürün Adı"></Column>
            <Column field="product.firmName" sortable header="Marka"></Column>
            <Column field="order.orderMoney" sortable header="Ürün Fiyatı">
              <template #body="slotProps">
                {{ new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(slotProps.data.order.orderMoney) }}
              </template>
            </Column>
            <Column field="order.orderPiece" sortable header="Ürün Adeti">
              <template #body="slotProps"> {{ slotProps.data.order.orderPiece }} Adet </template>
            </Column>
            <Column field="order.orderDate" sortable header="Sipariş Zamanı">
              <template #body="slotProps">
                {{ getTime(slotProps.data.order.orderDate) }}
              </template>
            </Column>
            <Column field="order.orderAdress" sortable header="Adres"> </Column>
            <Column field="order.orderStatus" sortable header="Sipariş Durumu">
              <template #body="slotProps">
                <Tag v-if="slotProps.data.order.orderStatus == 'standing'" :value="slotProps.data.order.orderStatus" severity="success" />
                <Tag v-else-if="slotProps.data.order.orderStatus == 'shipment'" :value="slotProps.data.order.orderStatus" severity="info" />
                <Tag v-else-if="slotProps.data.order.orderStatus == 'delivered'" :value="slotProps.data.order.orderStatus" severity="success" />
                <Tag v-else-if="slotProps.data.order.orderStatus == 'cancel'" :value="slotProps.data.order.orderStatus" severity="danger" />
                <Tag v-else-if="slotProps.data.order.orderStatus == 'return'" :value="slotProps.data.order.orderStatus" severity="danger" />
                <Tag v-else :value="slotProps.data.order.orderStatus" severity="danger" />
              </template>
            </Column>
          </DataTable>
        </div>
      </v-sheet>
    </div>
  </section>
</template>

<script>
import { FilterMatchMode } from "primevue/api";
import DataTable from "primevue/datatable";
import Tag from "primevue/tag";
import Column from "primevue/column";
import axios from "axios";
import Toast from "primevue/toast";
export default {
  components: { Toast, DataTable, Column, Tag },
  data() {
    return {
      filters: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      },
      visible: false,
      orders: [],
    };
  },
  async mounted() {
    this.siparisleriGetir();
  },
  methods: {
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
    async siparisleriGetir() {
      await axios({
        method: "post",
        url: "http://localhost:5000/api/admin/getorders",
        data: {
          jwt: this.getCookie("jwt"),
        },
      })
        .then((res) => {
          if (res.data.status === true) {
            this.orders = res.data.orders;
            this.totalorders = res.data.totalorders;
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
  },
};
</script>

<style scoped></style>

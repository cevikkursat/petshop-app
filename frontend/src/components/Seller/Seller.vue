<template>
  <section class="container">
    <Toast />
    <div class="card my-5 p-3">
      <h4>Hesap Bilgileri</h4>
      <div class="d-flex align-items-center justify-content-center">
        <Chart type="pie" :data="chartData" :options="chartOptions" class="w-50" />
      </div>
      <div class="d-flex align-items-center justify-content-center">
        <span class="fw-bold fs-3 me-2">Toplam Tamamlanan Sipariş: </span>
        <span class="fs-3"> {{ orderData[2] }}/{{ totalOrder }}</span>
        <span class="fs-3 ms-2"> adet</span>
      </div>
      <div class="d-flex align-items-center justify-content-center">
        <span class="fw-bold fs-3 me-2">Toplam Kazanılan Tutar: </span>
        <span class="fs-3"> {{ new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(total) }}</span>
      </div>
      <div class="d-flex align-items-center justify-content-center">
        <span class="fw-bold fs-3 me-2">Toplam Aktif Kedi Ürünleri: </span>
        <span class="fs-3"> {{ kedi }}</span>
      </div>
      <div class="d-flex align-items-center justify-content-center">
        <span class="fw-bold fs-3 me-2">Toplam Aktif Köpek Ürünleri: </span>
        <span class="fs-3"> {{ kopek }}</span>
      </div>
      <div class="d-flex align-items-center justify-content-center">
        <span class="fw-bold fs-3 me-2">Toplam Aktif Balık Ürünleri: </span>
        <span class="fs-3"> {{ balik }}</span>
      </div>
      <div class="d-flex align-items-center justify-content-center">
        <span class="fw-bold fs-3 me-2">Toplam Aktif Kuş Ürünleri: </span>
        <span class="fs-3"> {{ kus }}</span>
      </div>
    </div>
  </section>
</template>

<script>
import Chart from "primevue/chart";
import Toast from "primevue/toast";
import axios from "axios";
import * as jwt from "jose";
export default {
  components: { Chart, Toast },
  data() {
    return {
      total: 0,
      kedi: 0,
      kopek: 0,
      balik: 0,
      kus: 0,
      totalOrder: 0,
      username: null,
      orderData: [0, 0, 0, 0],
      chartData: null,
      chartOptions: {
        plugins: {
          legend: {
            labels: {
              usePointStyle: true,
            },
          },
        },
      },
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
    this.getinfo();
  },
  methods: {
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
    setChartData() {
      const documentStyle = getComputedStyle(document.body);
      return {
        labels: ["Bekleyen Sipariş", "Yolda Olan Sipariş", "Tamamlanan Sipariş", "İptal Edilen Sipariş"],
        datasets: [
          {
            data: this.orderData,
            backgroundColor: [
              documentStyle.getPropertyValue("--yellow-500"),
              documentStyle.getPropertyValue("--blue-500"),
              documentStyle.getPropertyValue("--green-500"),
              documentStyle.getPropertyValue("--red-500"),
            ],
            hoverBackgroundColor: [
              documentStyle.getPropertyValue("--yellow-400"),
              documentStyle.getPropertyValue("--blue-400"),
              documentStyle.getPropertyValue("--green-400"),
              documentStyle.getPropertyValue("--red-400"),
            ],
          },
        ],
      };
    },
    async getinfo() {
      await axios({
        method: "post",
        url: "http://localhost:5000/api/seller/getsellerinfo",
        data: {
          seller: this.username,
          jwt: this.getCookie("jwt"),
        },
      })
        .then((res) => {
          if (res.data.status === true) {
            this.orderData = [res.data.standing, res.data.shipment, res.data.delivered, res.data.cancel];
            this.chartData = this.setChartData();
            this.total = res.data.totalMoney;
            this.totalOrder = res.data.totalOrder;
            this.kedi = res.data.kedi;
            this.kopek = res.data.kopek;
            this.balik = res.data.balik;
            this.kus = res.data.kus;
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

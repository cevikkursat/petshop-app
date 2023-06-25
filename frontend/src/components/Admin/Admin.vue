<template>
  <section class="container">
    <Toast />
    <div class="card my-5 p-3">
      <h4>Site Bilgileri</h4>
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
        <span class="fw-bold fs-3 me-2">Toplam Aktif Hesaplar: </span>
        <span class="fs-3"> {{ user + seller + admin }}/{{ totalAccount }}</span>
      </div>
      <div class="d-flex align-items-center justify-content-center">
        <span class="fw-bold fs-3 me-2">Toplam Aktif Kullanıcı Hesapları: </span>
        <span class="fs-3"> {{ user }}/{{ totalUser }}</span>
      </div>
      <div class="d-flex align-items-center justify-content-center">
        <span class="fw-bold fs-3 me-2">Toplam Aktif Satıcı Hesaplar: </span>
        <span class="fs-3"> {{ seller }}/{{ totalSeller }}</span>
      </div>
      <div class="d-flex align-items-center justify-content-center">
        <span class="fw-bold fs-3 me-2">Toplam Aktif Admin Hesaplar: </span>
        <span class="fs-3"> {{ admin }}/{{ totalAdmin }}</span>
      </div>
      <div class="d-flex align-items-center justify-content-center">
        <span class="fw-bold fs-3 me-2">Toplam Aktif Ürünler: </span>
        <span class="fs-3"> {{ kedi + kopek + balik + kus }}/{{ totalProducts }}</span>
      </div>
      <div class="d-flex align-items-center justify-content-center">
        <span class="fw-bold fs-3 me-2">Toplam Aktif Kedi Ürünleri: </span>
        <span class="fs-3"> {{ kedi }}/{{ totalKedi }}</span>
      </div>
      <div class="d-flex align-items-center justify-content-center">
        <span class="fw-bold fs-3 me-2">Toplam Aktif Köpek Ürünleri: </span>
        <span class="fs-3"> {{ kopek }}/{{ totalKopek }}</span>
      </div>
      <div class="d-flex align-items-center justify-content-center">
        <span class="fw-bold fs-3 me-2">Toplam Aktif Balık Ürünleri: </span>
        <span class="fs-3"> {{ balik }}/{{ totalBalik }}</span>
      </div>
      <div class="d-flex align-items-center justify-content-center">
        <span class="fw-bold fs-3 me-2">Toplam Aktif Kuş Ürünleri: </span>
        <span class="fs-3"> {{ kus }}/{{ totalKus }}</span>
      </div>
    </div>
  </section>
</template>

<script>
import Chart from "primevue/chart";
import Toast from "primevue/toast";
import axios from "axios";
export default {
  components: { Chart, Toast },
  data() {
    return {
      total: 0,
      kedi: 0,
      kopek: 0,
      balik: 0,
      kus: 0,
      totalKedi: 0,
      totalKopek: 0,
      totalBalik: 0,
      totalKus: 0,
      totalAccount: 0,
      totalUser: 0,
      user: 0,
      totalSeller: 0,
      seller: 0,
      totalAdmin: 0,
      admin: 0,
      totalProducts: 0,
      totalOrder: 0,
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
        url: "http://localhost:5000/api/admin/getinfo",
        data: {
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
            this.totalKedi = res.data.totalKedi;
            this.totalKopek = res.data.totalKopek;
            this.totalBalik = res.data.totalBalik;
            this.totalKus = res.data.totalKus;
            this.totalProducts = res.data.totalProducts;
            this.totalAccount = res.data.totalAccount;
            this.totalUser = res.data.totalUser;
            this.user = res.data.user;
            this.totalSeller = res.data.totalSeller;
            this.seller = res.data.seller;
            this.totalAdmin = res.data.totalAdmin;
            this.admin = res.data.admin;
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

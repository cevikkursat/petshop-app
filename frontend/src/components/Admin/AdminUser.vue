<template>
  <section class="m-2">
    <Toast />
    <div class="w-100">
      <div class="card p-2" v-if="users.length === 0">Kullanıcı bulunamadı!</div>
      <v-sheet v-else elevation="12" rounded="lg" class="p-4 w-100 h-100">
        <h3>Kullanıcı Listesi</h3>
        <div class="card p-2">
          <DataTable v-model:filters="filters" :value="users" paginator :rows="10">
            <template #header>
              <div class="w25">
                <v-text-field prepend-icon="mdi-magnify" v-model="filters['global'].value" label="Aranacak Kelime" variant="outlined"></v-text-field>
              </div>
            </template>
            <template #empty> Kullanıcı bulunmuyor. </template>
            <Column field="username" sortable header="Kullanıcı Adı"></Column>
            <Column field="fName" sortable header="Ad"></Column>
            <Column field="lName" sortable header="Soyad"></Column>
            <Column field="phone" sortable header="Telefon"></Column>
            <Column field="email" sortable header="Mail"></Column>
            <Column field="accountStatus" sortable header="Hesap Durumu">
              <template #body="slotProps">
                <Tag v-if="slotProps.data.accountStatus == 'active'" value="Aktif" severity="success" />
                <Tag v-else-if="slotProps.data.accountStatus == 'inactive'" value="İnaktif" severity="warning" />
                <Tag v-else-if="slotProps.data.accountStatus == 'deactivated'" value="Hesap Kapatıldı" severity="danger" />
                <Tag v-else-if="slotProps.data.accountStatus == 'banned'" value="Banlandı" severity="danger" />
              </template>
            </Column>
            <Column field="role" sortable header="Hesap Düzeyi">
              <template #body="slotProps">
                <Tag v-if="slotProps.data.role == 'user'" value="Kullanıcı" severity="info" />
                <Tag v-else-if="slotProps.data.role == 'seller'" value="Satıcı" severity="success" />
                <Tag v-else-if="slotProps.data.role == 'admin'" value="Admin" severity="danger" />
              </template>
            </Column>
            <Column field="earnedMoney" sortable header="Kazanılan Para">
              <template #body="slotProps">
                {{ new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(slotProps.data.earnedMoney) }}
              </template>
            </Column>
            <Column field="completedOrder" sortable header="Tamamlanan Siparişler">
              <template #body="slotProps">
                {{ slotProps.data.completedOrder }}
              </template>
            </Column>
            <Column field="address" sortable header="Adresler">
              <template #body="slotProps">
                <span v-for="(item, index) in slotProps.data.address" :key="index">
                  <div>{{ item.name }}: {{ item.address }}</div>
                </span>
              </template>
            </Column>

            <Column header="İşlemler">
              <template #body="slotProps">
                <v-tooltip text="Hesap Durumu Değiştir" location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" icon="mdi-list-status" density="compact" class="m-1" @click="sec(slotProps.data._id, 'status')"> </v-btn>
                  </template>
                </v-tooltip>
                <v-tooltip text="Hesap Düzeyi Değiştir" location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" icon="mdi-gamepad-circle" density="compact" class="m-1" @click="sec(slotProps.data._id, 'role')"> </v-btn>
                  </template>
                </v-tooltip>
              </template>
            </Column>
          </DataTable>
        </div>
      </v-sheet>
    </div>
    <Dialog
      v-model:visible="visible"
      :header="selectedDialog === 'role' ? 'Düzey Ayarları' : 'Durum Ayarları'"
      :style="{ width: '50vw' }"
      :breakpoints="{ '960px': '75vw', '641px': '100vw' }"
      position="top"
      modal
    >
      <select v-if="selectedDialog === 'role'" v-model="selecteduserrole" class="form-select" aria-label="Default select example">
        <option value="selected">Bir Rol Seçiniz</option>
        <option value="user">Hesabı Kullanıcı Yap</option>
        <option value="seller">Hesabı Satıcı Yap</option>
        <option value="admin">Hesabı Admin Yap</option>
      </select>

      <select v-else v-model="selecteduserstatus" class="form-select" aria-label="Default select example">
        <option value="selected">Bir Durum Seçiniz</option>
        <option value="active">Hesabı Aktif Et</option>
        <option value="inactive">Hesabı İnaktif Et</option>
        <option value="deactivated">Hesabı Kapat</option>
        <option value="banned">Hesabı Banla</option>
      </select>
      <template #footer>
        <v-btn style="text-transform: capitalize" class="m-1" @click="selectedDialog === 'role' ? userRoleDegistir() : userDurumuDegistir()">
          {{ selectedDialog === "role" ? "Hesap Rolü Kaydet" : "Hesap Durumunu Kaydet" }}
        </v-btn>
      </template>
    </Dialog>
  </section>
</template>

<script>
import { FilterMatchMode } from "primevue/api";
import DataTable from "primevue/datatable";
import Tag from "primevue/tag";
import Column from "primevue/column";
import axios from "axios";
import Toast from "primevue/toast";
import Dialog from "primevue/dialog";
export default {
  components: { Toast, DataTable, Column, Tag, Dialog },
  data() {
    return {
      filters: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      },
      visible: false,
      users: [],
      selectedUser: null,
      selectedDialog: null,
      selecteduserstatus: "selected",
      selecteduserrole: "selected",
    };
  },
  async mounted() {
    this.kullanicilariGetir();
  },
  methods: {
    sec(id, dialog) {
      this.selectedDialog = dialog;
      this.visible = true;
      this.selectedUser = id;
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
    async kullanicilariGetir() {
      await axios({
        method: "post",
        url: "http://localhost:5000/api/admin/getusers",
        data: {
          jwt: this.getCookie("jwt"),
        },
      })
        .then((res) => {
          if (res.data.status === true) {
            this.users = res.data.users;
            this.totalusers = res.data.totalusers;
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
    async userDurumuDegistir() {
      await axios({
        method: "post",
        url: "http://localhost:5000/api/admin/setuserstatus",
        data: {
          id: this.selectedUser,
          status: this.selecteduserstatus,
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
            let ids = [];
            for (let i = 0; i < this.users.length; i++) {
              const element = this.users[i]._id;
              ids.push(element);
            }
            const index = ids.indexOf(this.selectedUser);
            this.users[index].accountStatus = this.selecteduserstatus;
            this.visible = false;
            this.selecteduserstatus = "selected";
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
    async userRoleDegistir() {
      await axios({
        method: "post",
        url: "http://localhost:5000/api/admin/setuserrole",
        data: {
          id: this.selectedUser,
          role: this.selecteduserrole,
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
            let ids = [];
            for (let i = 0; i < this.users.length; i++) {
              const element = this.users[i]._id;
              ids.push(element);
            }
            const index = ids.indexOf(this.selectedUser);
            this.users[index].role = this.selecteduserrole;
            this.visible = false;
            this.selecteduserrole = "selected";
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

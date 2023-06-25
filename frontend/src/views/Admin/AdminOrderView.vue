<template>
  <div class="d-flex">
    <SideBar class="col-auto">
      <template #header>Admin Paneli</template>
      <template #bonusareaOne>
        <li class="mb-2 pt-2 border-top" style="border-top: 2px solid black">
          <RouterLink class="btn btn-toggle rounded border-0 text-decoration-none" to="/admin-settings" exact-active-class="active">
            <i class="mdi mdi-cog"></i>
            <span class="d-none d-md-inline ms-3">Admin Ayarları</span>
          </RouterLink>
        </li>
      </template>
      <template #bonusareaTwo>
        <li class="mb-2 pt-2 border-top" style="border-color: gray !important">
          <RouterLink class="btn btn-toggle rounded border-0 text-decoration-none" to="/admin-user" exact-active-class="active">
            <i class="mdi mdi-account-multiple"></i>
            <span class="d-none d-md-inline ms-3">Kullanıcılar</span>
          </RouterLink>
        </li>
      </template>
      <template #bonusareaThree>
        <li class="mb-2 pt-2 border-top" style="border-color: gray !important">
          <RouterLink class="btn btn-toggle rounded border-0 text-decoration-none" to="/admin-product" exact-active-class="active">
            <i class="mdi mdi-list-box"></i>
            <span class="d-none d-md-inline ms-3">Ürünler</span>
          </RouterLink>
        </li>
      </template>
      <template #bonusareaFour>
        <li class="mb-2 pt-2 border-top" style="border-color: gray !important">
          <RouterLink class="btn btn-toggle rounded border-0 text-decoration-none" to="/admin-order" exact-active-class="active">
            <i class="mdi mdi-order-bool-descending"></i>
            <span class="d-none d-md-inline ms-3">Siparişler</span>
          </RouterLink>
        </li>
      </template>
    </SideBar>
    <AdminOrder class="col" />
  </div>
</template>

<script>
import SideBar from "../../components/Site/SideBar.vue";
import AdminOrder from "../../components/Admin/AdminOrder.vue";
export default {
  components: { SideBar, AdminOrder },
};
</script>

<style scoped></style>

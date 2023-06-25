<template>
  <div class="d-flex">
    <SideBar class="col-auto">
      <template #header>Hesabım</template>
      <template #bonusareaOne>
        <li class="mb-2 pt-2 mt-2" style="border-top: 2px solid black">
          <RouterLink class="btn btn-toggle rounded border-0 text-decoration-none" to="/account" exact-active-class="active">
            <i class="mdi mdi-account"></i>
            <span class="d-none d-md-inline ms-3">Hesap</span>
          </RouterLink>
        </li>
      </template>
      <template #bonusareaTwo>
        <li class="mb-2 pt-2 border-top" style="border-color: gray !important">
          <RouterLink class="btn btn-toggle rounded border-0 text-decoration-none" to="/account-settings" exact-active-class="active">
            <i class="mdi mdi-cog"></i>
            <span class="d-none d-md-inline ms-3">Hesap Ayarları</span>
          </RouterLink>
        </li>
      </template>
      <template #bonusareaThree>
        <li class="mb-2 pt-2 border-top" style="border-color: gray !important">
          <RouterLink class="btn btn-toggle rounded border-0 text-decoration-none" to="/account-address" exact-active-class="active">
            <i class="mdi mdi-map-marker"></i>
            <span class="d-none d-md-inline ms-3">Adreslerim</span>
          </RouterLink>
        </li>
      </template>
    </SideBar>
    <Address class="col" />
  </div>
</template>

<script>
import SideBar from "../../components/Site/SideBar.vue";
import Address from "../../components/User/Address.vue";
export default {
  components: { SideBar, Address },
};
</script>

<style scoped></style>

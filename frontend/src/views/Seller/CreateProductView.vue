<template>
  <div class="row g-0">
    <SideBar class="col-auto">
      <template #header>Satıcı Paneli</template>
      <template #buttonsellerUrun>
        <li class="mb-2 pt-2 mt-2" style="border-top: 2px solid black">
          <button
            class="btn btn-toggle rounded border-0 w-100 d-flex justify-content-start"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseOne"
            aria-expanded="false"
          >
            <i class="mdi mdi-apps-box"></i><span class="fw-bold d-none d-md-inline ms-3">Ürün</span>
          </button>
          <div class="collapse" id="collapseOne">
            <div class="card card-body border-bottom-0 border-end-0 nav-title">
              <RouterLink class="nav-link ms-2 mb-2" to="/create-product-view" exact-active-class="active"> Ürün Oluştur </RouterLink>
              <RouterLink class="nav-link ms-2" to="/list-products-view" exact-active-class="active"> Ürünlerimi Listele </RouterLink>
            </div>
          </div>
        </li>
      </template>
      <template #buttonsellerSatis>
        <li class="mb-2 pt-2 border-top" style="border-color: gray !important">
          <button
            class="btn btn-toggle rounded border-0 fw-bold w-100 d-flex justify-content-start"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseTwo"
            aria-expanded="false"
          >
            <i class="mdi mdi-account-cash"></i><span class="fw-bold d-none d-md-inline ms-3">Satış</span>
          </button>
          <div class="collapse" id="collapseTwo">
            <div class="card card-body border-bottom-0 border-end-0 nav-title">
              <RouterLink class="nav-link ms-2 mb-2" to="/sales-view" exact-active-class="active"> Satışlarımı Gör </RouterLink>
            </div>
          </div>
        </li>
      </template>
    </SideBar>
    <CreateProduct class="col" />
  </div>
</template>

<script>
import SideBar from "../../components/Site/SideBar.vue";
import CreateProduct from "../../components/Seller/createProduct.vue";
export default {
  components: { SideBar, CreateProduct },
};
</script>

<style scoped></style>

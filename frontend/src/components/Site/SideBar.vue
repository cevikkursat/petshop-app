<template>
  <div class="min-vh-100">
    <div id="sideBar" class="p-3 h-100" style="max-width: 280px; border-end: 2px solid black">
      <a class="top d-flex justify-content-center align-items-center" :href="link">
        <img src="../../assets/petshopicon.png" alt="LOGO" width="50" />
        <span class="ms-5 fs-4 fw-bolder d-none d-md-inline">
          <slot name="header"></slot>
        </span>
      </a>
      <ul class="list-unstyled ps-0 mb-0">
        <slot name="buttonsellerUrun"></slot>
        <slot name="buttonsellerSatis"></slot>
        <slot name="bonusareaOne"></slot>
        <slot name="bonusareaTwo"></slot>
        <slot name="bonusareaThree"></slot>
        <slot name="bonusareaFour"></slot>
        <slot name="bonusareaFive"></slot>
      </ul>
      <div class="mb-2 pt-2 border-top" style="border-color: gray !important">
        <RouterLink class="btn btn-toggle rounded border-0 text-decoration-none" to="/" exact-active-class="active">
          <i class="mdi mdi-home"></i> <span class="d-none d-md-inline fw-bold">Siteye Geri Dön</span>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script>
import { RouterLink } from "vue-router";
export default {
  data() {
    return {
      link: null,
    };
  },
  mounted() {
    window.location.pathname.split("/")[1].split("-")[0] === "account"
      ? (this.link = "/account")
      : window.location.pathname.split("/")[1].split("-")[0] === "admin"
      ? (this.link = "/admin")
      : (this.link = "/seller-page");
  },
};
</script>

<style scoped>
.nav-title {
  border-top-right-radius: 0;
  border-bottom-left-radius: 0;
  border-color: gray;
}
.active {
  text-decoration: underline;
}
.top {
  text-decoration: none;
  color: black;
}
.nav-link {
  text-decoration: none;
  color: black;
}
.nav-link:hover {
  animation: nav-link-animation 0.2s linear 0s 1 normal both;
}

@keyframes nav-link-animation {
  0% {
    transform: scale(1);
  }

  100% {
    transform: scale(1.1);
  }
}
</style>

<template>
  <div class="card card-product">
    <div class="card-body py-2 px-1">
      <div class="text-center position-relative">
        <div class="position-absolute top-0 start-0" style="z-index: 9">
          <span class="badge bg-danger">
            <slot name="badge"></slot>
          </span>
        </div>
        <slot name="img"></slot>
        <div class="card-product-action position-absolute top-0 end-0 d-flex justify-content-end">
          <div class="d-flex flex-column">
            <slot name="productView"></slot>
          </div>
        </div>
      </div>
      <div class="text-small mb-1 d-flex justify-content-between align-items-center">
        <small><slot name="firmName"></slot></small>
        <div>
          <span><slot name="countedPrice"></slot></span> <span class="text-decoration-line-through text-muted"><slot name="price"> </slot></span>
        </div>
      </div>
      <h2 class="fs-6"><slot name="productName"></slot></h2>
      <div class="d-flex align-items-center">
        <slot name="rating"></slot>
      </div>
      <div class="d-flex justify-content-center align-items-center mt-3">
        <slot name="addCart"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    srcIMG: 3.5,
  }),
};
</script>

<style scoped>
.card-product {
  transition: 0.2s;
  -moz-transition: 0.2s;
  -webkit-transition: 0.2s;
  -o-transition: 0.2s;
}

.card-product .card-product-action {
  opacity: 0;
  transition: all 0.3s ease 0s;
  visibility: hidden;
  width: 100%;
  z-index: 9;
}

.card-product:hover {
  border: 1px solid green;
  box-shadow: 0 5px 12px rgba(0, 0, 0, 0.12);
  transition: 0.2s;
  -moz-transition: 0.2s;
  -webkit-transition: 0.2s;
  -o-transition: 0.2s;
}

.card-product:hover .card-product-action {
  opacity: 1;
  visibility: visible;
}

.card-product .btn-action:hover {
  background-color: dimgrey;
  color: whitesmoke;
}
</style>

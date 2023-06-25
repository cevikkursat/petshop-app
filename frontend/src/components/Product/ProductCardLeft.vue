<template>
  <div class="card card-product">
    <div class="card-body p-2 d-flex justify-content-between">
      <div class="d-flex">
        <div class="me-2">
          <slot name="img"></slot>
          <div class="position-absolute top-0 start-0" style="z-index: 9">
            <span class="badge bg-danger">
              <slot name="badge"></slot>
            </span>
          </div>
        </div>
        <div class="align-self-center">
          <div class="text-small mb-1">
            <small><slot name="firmName"></slot></small>
          </div>
          <h2 class="fs-6"><slot name="productName"></slot></h2>
          <div class="d-flex align-items-center">
            <slot name="rating"></slot>
          </div>
          <span><slot name="countedPrice"></slot></span> <span class="text-decoration-line-through text-muted"><slot name="price"> </slot></span>
        </div>
      </div>
      <div class="my-3 mx-4">
        <div class="position-relative">
          <div class="card-product-action position-absolute top-0 end-0 d-flex justify-content-end">
            <div class="d-flex flex-column">
              <slot name="btns"></slot>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
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

.card-product .btn-action {
  background-color: whitesmoke;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px -1px rgba(145, 158, 171, 0.2), 0 4px 5px 0 rgba(145, 158, 171, 0.14), 0 1px 10px 0 rgba(145, 158, 171, 0.12);
  color: dimgrey;
  font-size: 14px;
  height: 34px;
  line-height: 34px;
  transition: all 0.3s ease 0s;
  width: 34px;
}

.card-product .btn-action:hover {
  background-color: dimgrey;
  color: whitesmoke;
}
</style>

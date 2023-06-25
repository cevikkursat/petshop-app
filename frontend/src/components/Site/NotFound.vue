<template>
  <v-sheet elevation="12" max-width="1000" rounded="lg" width="100%" class="m-5 p-4 text-center mx-auto">
    <v-icon class="mb-5" color="danger" icon="mdi-close-circle" size="112"></v-icon>

    <h2 class="text-h5 mb-6">Sayfa Bulunamadı!</h2>

    <p class="mb-4 text-medium-emphasis text-body-2">Üzgünüz. Gidilmeye çalışılan sayfa bulunamadı!</p>

    <v-divider class="mb-4"></v-divider>

    <div class="text-end">
      <v-btn class="text-none" color="success" rounded variant="flat" @click="$router.push('/')" style="text-transform: capitalize">
        Ana Sayfaya Dön
      </v-btn>
    </div>
  </v-sheet>
</template>

<script>
import { RouterLink } from "vue-router";
export default {};
</script>

<style scoped></style>

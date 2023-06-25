import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import "./assets/main.css";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "@mdi/font/css/materialdesignicons.css";
const vuetify = createVuetify({
  components,
  directives,
});

import PrimeVue from "primevue/config";
import "primevue/resources/primevue.min.css";
import "primevue/resources/themes/lara-light-indigo/theme.css";
import ToastService from "primevue/toastservice";

const app = createApp(App);

app.use(PrimeVue);
app.use(ToastService);
app.use(vuetify);
app.use(createPinia());
app.use(router);

app.mount("#app");

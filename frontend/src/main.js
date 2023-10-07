import { createApp } from "vue";
import Notifications from "@kyvg/vue3-notification";
import App from "./App.vue";
import router from "./router.js";
import "./assets/css/main.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "bootstrap-vue/dist/bootstrap-vue.css";
import gAuthPlugin from "vue3-google-oauth2";
import store from "@/store";

//for localhost
// let gauthClientId =
//   "166577061938-28lvbdl056li6lfjg5s5g6reuvoalg57.apps.googleusercontent.com";

//for menejar mine
// let gauthClientId =
//   "774153973478-c262rffsferirdv4mmb73u1upajd84b6.apps.googleusercontent.com";

//for menejar yatin sir
let gauthClientId =
  "278841736897-sa5b1fck9ltq5t0b7vh4n9so41m8q7lh.apps.googleusercontent.com";

const app = createApp(App);
app.use(store);
app.use(router);
app.use(Notifications);
app.use(gAuthPlugin, {
  clientId: gauthClientId,
  scope: "email",
  prompt: "consent",
});

app.mount("#app");

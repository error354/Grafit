import { createApp } from "vue";
import App from "./App.vue";
import VCalendar from "v-calendar";
import VWave from "v-wave";

import "./assets/main.css";
import "./assets/icons.css";
import "v-calendar/dist/style.css";

createApp(App)
  .use(VCalendar, {})
  .use(VWave, {
    color: "gold",
    duration: 0.3,
    initialOpacity: 0.8,
    finalOpacity: 0.3,
  })
  .mount("#app");

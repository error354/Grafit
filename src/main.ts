import { createApp } from 'vue'
import App from './App.vue'
import VCalendar from 'v-calendar';

import './assets/main.css'
import 'v-calendar/dist/style.css';

createApp(App)
  .use(VCalendar, {})
  .mount('#app')

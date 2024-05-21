import './assets/main.css'

import { createApp, provide } from 'vue'
import store from './store/store'
import router from './router/router'
import Notifications from '@kyvg/vue3-notification'
import App from './App.vue'

const app = createApp(App);

app
    .use(store)
    .use(router)
    .use(Notifications)
    .mount('#app');





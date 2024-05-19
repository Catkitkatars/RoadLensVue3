import './assets/main.css'

import { createApp, provide } from 'vue'
import store from './store/store'
import router from './router/router'
import App from './App.vue'

const app = createApp(App);

app
    .use(store)
    .use(router)
    .mount('#app');





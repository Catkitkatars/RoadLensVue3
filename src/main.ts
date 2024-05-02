import './assets/main.css'

import { createApp, provide } from 'vue'
import App from './App.vue'

const app = createApp(App);

const globalPoint = {
    activePoint: null,
    setActivePoint(pointId) {
        this.activePoint = pointId;
    },
    getActivePoint() {
        return this.activePoint;
    },
};

app.provide('globalPoint', globalPoint);

app.mount('#app');





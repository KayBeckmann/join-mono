// packages/frontend/src/main.js (oder main.ts)

import { createApp } from 'vue'
import { createPinia } from 'pinia' // Importiere Pinia

import App from './App.vue'
import router from './router' // <-- Importiere deine Router-Instanz
import './assets/main.css' // Beispiel für globales CSS

const app = createApp(App)

app.use(createPinia()) // Registriere Pinia
app.use(router) // <-- REGISTRIERE DEN ROUTER HIER!

app.mount('#app')
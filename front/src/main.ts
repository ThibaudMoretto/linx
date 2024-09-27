import './assets/main.css'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

// PrimeVue - Theme
app.use(PrimeVue, {
  defaultColorScheme: 'dark',
  theme: {
    preset: Aura
  }
})

// Pinia - State management
app.use(createPinia())

// Router - Navigation
app.use(router)

app.mount('#app')

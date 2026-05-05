import { createApp } from 'vue'
import { createPinia } from 'pinia'
import persistedstate from 'pinia-plugin-persistedstate'
import { MotionPlugin } from '@vueuse/motion'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/authStore'
import './assets/index.css'

const pinia = createPinia()
pinia.use(persistedstate)

const authStore = useAuthStore(pinia)
authStore.initAuth()

createApp(App).use(pinia).use(router).use(MotionPlugin).mount('#app')

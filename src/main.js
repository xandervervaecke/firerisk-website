import { createApp } from 'vue'
import '@fontsource-variable/inter'
import '@fontsource/ibm-plex-mono/500.css'
import './styles/main.css'
import './styles/prose.css'
import App from './App.vue'
import router from './router'
import reveal from './composables/reveal'

createApp(App).use(router).directive('reveal', reveal).mount('#app')

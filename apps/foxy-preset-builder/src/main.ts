import './assets/main.css'

import '@noction/vue-bezier/styles'
//@ts-ignore
import Transitions from '@noction/vue-bezier'

import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import { FoxyVueUIPlugin } from "@foxy/vue-ui";

import { createApp } from 'vue'
import App from './App.vue'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

createApp(App)
	.use(Transitions)
	.use(pinia)
	.use(FoxyVueUIPlugin)
	.mount('#app')
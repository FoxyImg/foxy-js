import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { FoxyPlugin } from "@foxy/vue";

const app = createApp(App);

app.use(FoxyPlugin, {
	host: "http://localhost:8080",
	sourceId: "gweb2",
	secret: "rapscallion",
	imgixMode: true,
});

app.mount('#app')

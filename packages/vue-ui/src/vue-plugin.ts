import type {App, Plugin} from "vue";
import FloatingVue from 'floating-vue';
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import { hideAllPoppers } from "floating-vue";

import "vue3-colorpicker/style.css";
import 'floating-vue/dist/style.css';
import "./styles.css";

export const FoxyVueUIPlugin:Plugin= {
	install: (app:App) => {

		app.provide("hideAllPoppers", hideAllPoppers);

		app.use(autoAnimatePlugin);
		app.use(FloatingVue);
	}
}

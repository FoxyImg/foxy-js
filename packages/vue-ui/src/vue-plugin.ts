import type {App, Plugin} from "vue";
import FloatingVue from 'floating-vue';
import Vue3ColorPicker from "vue3-colorpicker";
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import { hideAllPoppers } from "floating-vue";

import "vue3-colorpicker/style.css";
import 'floating-vue/dist/style.css';

export const FoxyVueUIPlugin:Plugin= {
	install: (app:App) => {

		app.provide("hideAllPoppers", hideAllPoppers);

		app.use(autoAnimatePlugin);
		app.use(FloatingVue);
		app.use(Vue3ColorPicker);
	}
}

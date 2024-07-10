// plugins/floating-vue.ts
import { defineNuxtPlugin } from "#app";
import { FoxyVueUIPlugin } from "@foxyimg/vue-ui";

export default defineNuxtPlugin(({ vueApp }) => {
	vueApp.use(FoxyVueUIPlugin);
});
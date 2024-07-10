import {defineNuxtPlugin} from "#app";
import '@noction/vue-bezier/styles'
//@ts-ignore
import Transitions from '@noction/vue-bezier'

export default defineNuxtPlugin(({ vueApp }) => {
	vueApp.use(Transitions);
});
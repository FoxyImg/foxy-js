import './assets/main.css'

import FloatingVue from 'floating-vue';
import 'floating-vue/dist/style.css';

import Vue3ColorPicker from "vue3-colorpicker";
import "vue3-colorpicker/style.css";

import { autoAnimatePlugin } from '@formkit/auto-animate/vue'


import { createApp } from 'vue'
import App from './App.vue'

createApp(App).use(autoAnimatePlugin).use(FloatingVue).use(Vue3ColorPicker).mount('#app')

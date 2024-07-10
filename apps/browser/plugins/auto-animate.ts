import { defineNuxtPlugin } from "#app";
import { vAutoAnimate } from "@formkit/auto-animate";

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.directive("auto-animate", vAutoAnimate);
});

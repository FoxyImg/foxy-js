<script setup lang="ts">
import Toast from "./Toast.vue";
import {useToastStore} from "../composables/toast-store";
import {useWindowSize} from "@vueuse/core";
import {watchEffect} from "vue";
const { toasts, maxToasts, removeToast } = useToastStore();

if (typeof window !== 'undefined') {
	const { height } = useWindowSize();
	watchEffect(() => {
		if (height.value) {
			maxToasts.value = (height.value - 40) / 112;
		}
	});
}

function beforeLeave(el:HTMLElement) {
	const { marginLeft, marginTop, width, height } = window.getComputedStyle(el);

	el.style.left = `${el.offsetLeft - parseFloat(marginLeft)}px`;
	el.style.top = `${el.offsetTop - parseFloat(marginTop)}px`;
	el.style.width = width;
	el.style.height = height;
}
</script>
<template>
	<div class="fixed right-0 top-0 h-full z-[900000] pointer-events-none">
		<TransitionGroup
			tag="ul"
			name="toasts"
			class="relative flex flex-col gap-3 w-[400px] max-w-[90vw] pt-5 pr-5 z-[30000]"
			@before-leave="beforeLeave">
			<Toast v-for="toast in toasts" :key="toast.id" :toast="toast" @remove="removeToast" />
		</TransitionGroup>
	</div>
</template>
<style>
.toasts-move,
.toasts-enter-active,
.toasts-leave-active {
	transition: all 0.333s ease;
}

.toasts-leave-active {
	position: absolute;
	z-index: -1;
}

.toasts-enter-from {
	opacity: 0;
	transform: translateX(100%);
}

.toasts-leave-to {
	opacity: 0;
	transform: scale(0.5);
}
</style>

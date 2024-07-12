<script setup lang="ts">
import type {Toast} from "../types/toast";
import DurationLabel from "./DurationLabel.vue";
import CloseIcon from "./CloseIcon.vue";
import {useToastStore} from "../composables/toast-store";
import {computed} from "vue";

const { toastDuration } = useToastStore();

const props = defineProps<{
	toast: Toast,
}>();

const emit = defineEmits<{
	(e: 'remove', id: string): void;
}>();

const toastClass = computed(() => {
	switch (props.toast.type) {
		case 'info':
			return 'bg-blue-400';
		case 'success':
			return 'bg-green-400';
		case 'warning':
			return 'bg-orange-400';
		case 'error':
			return 'bg-red-600';
	}
});
</script>
<template>
	<li class="group relative flex gap-2 items-center rounded-md px-5 py-3 shadow-lg pointer-events-auto" :class="toastClass">
		<div class="text-white flex flex-1 flex-col gap-0 leading-none">
			<div class="text-sm font-semibold leading-5 xs:text-base">
				{{ toast.message }}
			</div>
			<div class="text-xs opacity-75">
				<DurationLabel :date="new Date(toast.timestamp).toISOString()" suffix=" ago." :force="true" />
			</div>
		</div>
		<div
			class="border border-white transition-all opacity-0 group-hover:opacity-100 absolute -left-2 -top-2 shadow-lg rounded-full backdrop-blur-lg bg-white/25 w-5 h-5 flex items-center justify-center cursor-pointer"
			@click="emit('remove', toast.id)">
			<CloseIcon class="w-2 h-auto fill-black" />
		</div>
		<div
			class="toast-duration-bar absolute left-0 bottom-0 h-[2px] bg-white/50"
			:style="`animation-duration: ${toastDuration}ms`"></div>
	</li>
</template>
<style>
@keyframes toastduration {
	from {
		width: 0;
	}

	to {
		width: 100%;
	}
}

.toast-duration-bar {
	animation: toastduration linear;
}
</style>

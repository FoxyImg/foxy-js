<script setup lang="ts">
import BrokenIcon from "../icons/BrokenIcon.vue"
import LoaderFeedback from "../ui/LoaderFeedback.vue";
import {ref, watch} from "vue";

const props = defineProps<{
	modelValue: HTMLImageElement|null,
	currentImageUrl: string|null,
	isLoading: boolean,
	error: string|null,
}>();

const emit = defineEmits<{
	(e: 'update:modelValue', value: HTMLImageElement|null): void;
}>();


const previewImage = ref<HTMLImageElement|null>(null);
watch(previewImage, (newVal) => {
	if (newVal !== props.modelValue) {
		emit('update:modelValue', newVal);
	}
}, {immediate: true});
</script>
<template>
	<div class="group relative flex items-center justify-center bg-checkered">
		<div v-if="error" class="absolute left-1/2 top-1/2 -translate-x-1/2 flex flex-col items-center justify-center bg-white/15 p-2 rounded-lg backdrop-blur overflow-hidden transform-gpu">
			<BrokenIcon class="fill-red-600 w-16 h-auto" />
			<div class="font-bold">Oops.</div>
		</div>
		<template v-else-if="currentImageUrl">
			<img
				alt="Preview Image"
				class="max-w-full max-h-full"
				ref="previewImage"
				:src="currentImageUrl">
		</template>
		<div v-if="isLoading" class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
			<LoaderFeedback class=""/>
		</div>
	</div>
</template>

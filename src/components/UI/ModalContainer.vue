<script setup lang="ts">
import Icon from "@/components/UI/Icon.vue";

const emit = defineEmits(['close']);
withDefaults(defineProps<{
	title: string,
	showTitle: boolean
	showClose: boolean
	fullScreen: boolean
}>(), {
	showTitle: true,
	showClose: true,
	fullScreen: false,
});
</script>
<template>
	<div class="fixed left-0 top-0 w-full h-full z-[100002] flex items-center justify-center">
		<div class="absolute left-0 top-0 w-full h-full bg-black/70 backdrop-blur-lg z-[-1]"></div>
		<div class="bg-white rounded-lg flex flex-col w-full" :class="{'max-w-[min(90vw,480px)]': !fullScreen, 'min-w-[95vw] max-w-[95vw] min-h-[90vh] max-h-[90vh]': fullScreen }">
			<div v-if="showTitle" class="flex items-center justify-between border-b border-b-neutral-300">
				<div class="p-3 text-base font-bold">{{ title }}</div>
				<div v-if="showClose" @click="emit('close')" class="p-3 cursor-pointer">
					<Icon name="close" class="fill-black w-2 h-auto" />
				</div>
			</div>
			<slot></slot>
		</div>
	</div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import {ColorPicker} from "vue3-colorpicker";
import {CloseIcon} from "@foxy/vue-ui";

const props = defineProps<{
	title: string,
	modelValue: string|null,
	default: string|null,
}>();

const emit = defineEmits<{
	(e: 'update:modelValue', value: string|null): void;
}>();

const currentValue = computed({
	get: () => {
		if (props.modelValue === null) {
			return props.default ?? "#00000000";
		}

		return props.modelValue;
	},
	set: (value) => emit('update:modelValue', value),
});
</script>
<template>
	<div class="flex flex-col gap-1.5">
		<div class="flex items-center justify-between gap-2">
			<label class="text-xxs uppercase text-neutral-600" :class="{'font-bold text-neutral-700': modelValue !== props.default}">{{title}}</label>
			<div class="flex items-center gap-1">
				<a v-if="modelValue !== props.default" href="#" @click.prevent.stop="emit('update:modelValue', props.default)" class="aspect-square rounded-full p-1"><CloseIcon class="fill-black w-2 h-auto" /></a>
				<ColorPicker format="hex8" :z-index="100001" :disable-alpha="false" shape="circle" :pure-color="currentValue" @update:pure-color="currentValue = $event.replace('#', '')" />
			</div>
		</div>
	</div>
</template>
<style>
.vc-color-wrap {
	margin-right: 0 !important;
}
</style>
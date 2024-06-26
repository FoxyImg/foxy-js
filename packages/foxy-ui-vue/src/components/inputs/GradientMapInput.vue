<script setup lang="ts">
import type {GradientStops} from "@foxy/url-builder";
import {computed} from "vue";
import GradientEditor from "../ui/GradientEditor.vue";
import GradientMapPresetsSelector from "../inputs/GradientMapPresetsSelector.vue";
import BookmarkIcon from "../icons/BookmarkIcon.vue";
import ReverseIcon from "../icons/ReverseIcon.vue";

const props = defineProps<{
	title: string,
	modelValue: GradientStops[],
	default: GradientStops[],
	enabled: boolean,
}>();

const emit = defineEmits<{
	(e: 'update:modelValue', value: GradientStops[]): void;
}>();

const currentValue = computed({
	get: () => props.modelValue,
	set: (value) => emit('update:modelValue', value),
});

function reverseGradient() {
	const stops = JSON.parse(JSON.stringify(currentValue.value));
	stops.forEach((stop:GradientStops) => {
		stop.stop = 100 - stop.stop;
	});

	currentValue.value = stops;
}


</script>
<template>
	<div class="flex flex-col gap-2">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-1 text-xs text-neutral-600">
				<label :class="{'font-bold text-neutral-700': enabled}">{{  title  }}</label>
				<VDropdown>
					<div class="cursor-pointer aspect-square">
						<BookmarkIcon class="w-3 h-auto stroke-neutral-500" />
					</div>
					<template #popper>
						<GradientMapPresetsSelector v-model="currentValue" />
					</template>
				</VDropdown>
			</div>
			<div class="cursor-pointer flex items-center justify-center" @click="reverseGradient">
				<ReverseIcon class="w-3.5 h-auto stroke-neutral-500" />
			</div>
		</div>
		<GradientEditor v-model="currentValue" />
	</div>
</template>
<style>
.gradient-param-container {
	background-image: url("data:image/svg+xml, %3Csvg%20width=%2216%22%20height=%2216%22%20viewBox=%220%200%2016%2016%22%20fill=%22none%22%20xmlns=%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%3Crect%20width=%228%22%20height=%228%22%20fill=%22%23AEAEAE%22%2F%3E%0A%3Crect%20x=%228%22%20y=%228%22%20width=%228%22%20height=%228%22%20fill=%22%23AEAEAE%22%2F%3E%0A%3Crect%20x=%228%22%20width=%228%22%20height=%228%22%20fill=%22%23D9D9D9%22%2F%3E%0A%3Crect%20y=%228%22%20width=%228%22%20height=%228%22%20fill=%22%23D9D9D9%22%2F%3E%0A%3C%2Fsvg%3E%0A");
}

.gradient-param-container  .vc-color-wrap.round {
	margin: 0 !important;
	width: 14px !important;
	height: 14px !important;
	line-height: 0 !important;
}
</style>

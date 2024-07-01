<script setup lang="ts">
import {computed, onMounted, onUnmounted, ref} from "vue";
import {ColorPicker} from "vue3-colorpicker";
import shortUUID from "short-uuid";
import type {GradientStops} from "@foxyimg/url-builder";
import {ClientOnly} from "../ssr/ClientOnly";

const props = defineProps<{
	modelValue: GradientStops[],
}>();

const emit = defineEmits<{
	(e: 'update:modelValue', value: GradientStops[]): void;
}>();

const currentValue = computed({
	get: () => props.modelValue,
	set: (value) => emit('update:modelValue', value),
});

function stopStyle(stop:GradientStops) {
	return {
		left: `${stop.stop}%`,
	};
}

const gradientRef = ref<HTMLElement|null>(null);

function addStop(e:MouseEvent) {
	if (draggingStop.value !== null) {
		return;
	}

	if (gradientRef.value) {
		currentValue.value = [...currentValue.value, {enabled: true, color: '#000000', stop: (e.offsetX /gradientRef.value.clientWidth) * 100}];
	}
}

const sortedStops = computed(() => {
	return currentValue.value.sort((a, b) => a.stop - b.stop);
});

const draggingStop = ref<GradientStops|null>(null);

function dragStop(e:MouseEvent) {
	if (draggingStop.value === null) {
		return;
	}

	e.stopPropagation();
	e.preventDefault();

	if (gradientRef.value !== null) {
		const rect = gradientRef.value.getBoundingClientRect();

		const x = Math.max(0, Math.min(gradientRef.value.clientWidth, e.clientX - rect.left));
		const y = e.clientY - rect.top;

		draggingStop.value.stop = Math.round((x / gradientRef.value.clientWidth) * 100);
		draggingStop.value.enabled = (y >= 0 && y <= gradientRef.value.clientHeight);
	}

	document.addEventListener('mouseup', dragStopEnd, { once: true });
}

function dragStopEnd(e:MouseEvent) {
	if (draggingStop.value !== null && !draggingStop.value.enabled) {
		currentValue.value = currentValue.value.filter((stop) => stop !== draggingStop.value);
	}

	draggingStop.value = null;
}

onMounted(() => {
	document.addEventListener('mousemove', dragStop);
});

onUnmounted(() => {
	document.removeEventListener('mousemove', dragStop);
	document.removeEventListener('mouseup', dragStopEnd);
});


const gradId = ref('gradient-'+shortUUID.generate());
</script>
<template>
	<div class="flex flex-col gap-1.5">
		<div class="pb-2">
			<div class="relative w-full h-[32px] gradient-param-container border border-neutral-200" ref="gradientRef">
				<svg class="absolute inset-0 w-full h-full cursor-pointer" @mouseup="addStop" >
					<defs>
						<linearGradient :id="gradId" x1="0%" y1="0%" x2="100%" y2="0%">
							<template v-for="(stop, index) in sortedStops" :key="index">
								<stop v-if="stop.enabled" :offset="`${Math.floor(stop.stop)}%`" :stop-color="stop.color" />
							</template>
						</linearGradient>
					</defs>
					<rect width="100%" height="100%" :fill="`url(#${gradId})`" />
				</svg>
				<div v-for="(stop, index) in sortedStops" :key="index" class="absolute -translate-x-1/2 -top-2 -bottom-2 flex flex-col cursor-ew-resize" :style="stopStyle(stop)">
					<div class="flex-1" @mousedown.prevent.stop="draggingStop=stop" >&nbsp;</div>
					<div v-if="stop.enabled" class="cursor-pointer leading-none">
						<ClientOnly>
							<ColorPicker format="hex8" :z-index="100001" :disable-alpha="false" shape="circle" class="" :pure-color="stop.color" @update:pure-color="stop.color = $event" />
						</ClientOnly>
					</div>
				</div>
			</div>
		</div>
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

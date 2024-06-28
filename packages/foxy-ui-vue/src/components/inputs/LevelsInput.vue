<script setup lang="ts">
import {computed, ref} from 'vue';
import type {ChannelLevelsParams} from "@foxyimg/url-builder";
import shortUUID from "short-uuid";

const props = withDefaults(defineProps<{
	title: string,
	modelValue: ChannelLevelsParams,
	default: ChannelLevelsParams,
	shadowColor: string,
	midColor: string,
	highlightColor: string,
}>(), {
});

const emit = defineEmits<{
	(e: 'update:modelValue', value: ChannelLevelsParams): void;
}>();

const currentValue = computed({
	get: () => props.modelValue,
	set: (value) => emit('update:modelValue', value),
});

const gradId = ref('gradient-'+shortUUID.generate());

const shadowX = computed(() => {
	return (props.modelValue.shadows / 255.0) * 100;
});

const midX = computed(() => {
	const mid = props.modelValue.shadows + ((props.modelValue.mid /100.0 * (props.modelValue.highlights - props.modelValue.shadows)));
	return (mid / 255.0) * 100;
});

const highlightsX = computed(() => {
	return (props.modelValue.highlights / 255.0) * 100;
});

const currentKnob = ref<null|'shadow'|'mid'|'highlight'>(null);
const knobContainer = ref<HTMLElement|null>(null);
let knobBounds:DOMRect|undefined = undefined;

function mouseDown(which:'shadow'|'mid'|'highlight') {
	currentKnob.value = which;
	knobBounds = knobContainer.value?.getBoundingClientRect();
	document.addEventListener('mousemove', mouseMove);
	document.addEventListener('mouseup', mouseUp);
}

function mouseMove(e:MouseEvent) {
	if (currentKnob.value === null || knobBounds === undefined) {
		return;
	}

	const newModelVal = JSON.parse(JSON.stringify(currentValue.value));

	let knobVal = 255 * (Math.max(0, Math.min(1.0, (e.clientX - knobBounds.left) / knobBounds.width)));

	if (currentKnob.value === 'shadow') {
		newModelVal.shadows = Math.min(knobVal, currentValue.value.highlights - 1);
	} else if (currentKnob.value === 'highlight') {
		newModelVal.highlights = Math.max(knobVal, currentValue.value.shadows + 1);
	} else {
		let midVal = Math.floor(((knobVal - currentValue.value.shadows) / (currentValue.value.highlights - currentValue.value.shadows)) * 100.0);
		newModelVal.mid = Math.min(Math.max(0, midVal), 100);
	}

	console.log('newModelVal', currentKnob.value, knobVal, newModelVal.shadows, newModelVal.mid, newModelVal.highlights);
	currentValue.value = newModelVal;
}

function mouseUp(e:MouseEvent) {
	if (currentKnob.value === null) {
		return;
	}

	document.removeEventListener('mousemove', mouseMove);
	document.removeEventListener('mouseup', mouseUp);
}
</script>
<template>
	<div class="flex flex-col gap-1.5">
		<div class="flex flex-col items-start gap-1">
			<label class="text-xxs uppercase text-neutral-600" :class="{'font-bold text-neutral-700': currentValue !== props.default}">{{title}}</label>
			<div class="flex flex-col gap-[2px] w-full">
				<svg class="w-full h-[24px]" xmlns="http://www.w3.org/2000/svg">
					<defs>
						<linearGradient :id="gradId" x1="0%" y1="0%" x2="100%" y2="0%">
							<stop :offset="`${shadowX}%`" :stop-color="props.shadowColor" />
							<stop :offset="`${midX}%`" :stop-color="props.midColor" />
							<stop :offset="`${highlightsX}%`" :stop-color="props.highlightColor" />
						</linearGradient>
					</defs>
					<rect width="100%" height="100%" :fill="`url(#${gradId})`" />
				</svg>
				<div ref="knobContainer" class="w-full h-[12px] relative">
					<div @mousedown.prevent.stop="mouseDown('shadow')" class="cursor-ew-resize absolute w-[10px] aspect-square -translate-x-1/2" :style="`left: ${shadowX}%; `">
						<svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
							<polygon points="0,12 12,12 6,0" :fill="props.shadowColor"></polygon>
						</svg>
					</div>
					<div @mousedown.prevent.stop="mouseDown('mid')" class="cursor-ew-resize absolute w-[10px] aspect-square rounded-full border -translate-x-1/2" :style="`left: ${midX}%; background-color: ${props.midColor}`"></div>
					<div @mousedown.prevent.stop="mouseDown('highlight')" class="cursor-ew-resize absolute w-[10px] aspect-square -translate-x-1/2" :style="`left: ${highlightsX}%;`">
						<svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
							<polygon points="0,10 10,10 5,0" :fill="props.highlightColor" stroke="rgba(0,0,0,0.25)" stroke-width="1"></polygon>
						</svg>
					</div>
				</div>
			</div>
		</div>
		<div class="flex justify-end text-xxxs uppercase">
			<a href="#" @click.prevent.stop="emit('update:modelValue', props.default)">Reset</a>
		</div>
	</div>
</template>

<script setup lang="ts">
import type {RedactRect} from "@foxy/url-builder";
import {computed, ref} from "vue";
import {CloseIcon} from "@foxy/vue-ui";

const props = defineProps<{
	modelValue: RedactRect,
	selected: boolean,
	container: HTMLElement|null,
}>();

const emit = defineEmits<{
	(e: 'update:modelValue', value: RedactRect): void;
	(e: 'remove'): void;
	(e: 'select'): void;
}>();

const style = computed(() => {
	const style:any = {
		left: `${props.modelValue.left * 100}%`,
		top: `${props.modelValue.top * 100}%`,
		width: `${props.modelValue.width * 100}%`,
		height: `${props.modelValue.height * 100}%`,
		borderRadius: `${props.modelValue.cornerRadius}%`,
		transform: `rotate(${props.modelValue.rotation}deg)`,
	};

	if (props.selected) {
		style.border = '2px solid red';
	}

	return style;
});

const regionDiv = ref<HTMLDivElement|null>(null);
const mouseIsDown = ref(false);

const regionBounds = ref<DOMRect|null>(null);
const containerBounds = ref<DOMRect|null>(null);
const offset = {
	x: 0,
	y: 0,
}

function mouseDown(e:MouseEvent) {
	emit('select');

	if (!regionDiv.value || !props.container) {
		return;
	}

	mouseIsDown.value = true;

	regionBounds.value = regionDiv.value.getBoundingClientRect();
	offset.x = e.clientX - regionBounds.value.left + (regionBounds.value.width / 2);
	offset.y = e.clientY - regionBounds.value.top + (regionBounds.value.height / 2);

	containerBounds.value = props.container.getBoundingClientRect();

	document.addEventListener('mousemove', mouseMove);
	document.addEventListener('mouseup', mouseUp, {once: true});
}

function mouseMove(e:MouseEvent) {
	if (!mouseIsDown.value || !containerBounds.value || !regionBounds.value) {
		return;
	}

	const x = e.clientX - containerBounds.value.left;
	const y = e.clientY - containerBounds.value.top;

	const left = Math.min(Math.max(0, (x + (regionBounds.value.width / 2)) - offset.x), containerBounds.value.width) / containerBounds.value.width;
	const top = Math.min(Math.max(0, (y + (regionBounds.value.height / 2)) - offset.y), containerBounds.value.height) / containerBounds.value.height;

	const newRect = {
		left,
		top,
		width: props.modelValue.width,
		height: props.modelValue.height,
		cornerRadius: props.modelValue.cornerRadius,
		rotation: props.modelValue.rotation,
	}

	emit('update:modelValue', newRect);
}

function mouseUp(e:MouseEvent) {
	mouseIsDown.value = false;
}
</script>
<template>
	<div ref="regionDiv" :style="style" class="border border-white absolute drop-shadow cursor-move" @mousedown.stop.prevent="mouseDown">
		<div @click="emit('remove')" class="pointer-events-auto cursor-pointer absolute left-0 top-0 p-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/50 hover:bg-white backdrop-blur-lg">
			<CloseIcon class="fill-black w-1.5 h-auto" />
		</div>
	</div>
</template>
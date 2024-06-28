<script setup lang="ts">
import {computed, inject, ref, watch} from 'vue';
import {DefaultSizingParams, type Face, type ImageMeta} from "@foxyimg/url-builder";
import FocalPointerIcon from "../icons/FocalPointerIcon.vue";
import type {URLBuilder} from "../../types/url-builder";

const buildUrl:URLBuilder = inject("buildUrl") as URLBuilder;

const props = defineProps<{
	modelValue: {x: number, y:number, zoom: number},
	imageKey: string|null,
	imageMeta: ImageMeta|null,
}>();

const emit = defineEmits(['update:modelValue']);

const currentValue = computed<{x: number, y:number, zoom: number}>({
	get() {
		return props.modelValue;
	},
	set(value) {
		emit('update:modelValue', value);
	}
});

const focalPointStyle = computed(() => {
	return {
		left: `${currentValue.value.x * 100}%`,
		top: `${currentValue.value.y * 100}%`,
	};
});

const imageUrl = ref<string|null>(null);
watch(() => props.imageKey, async (newVal) => {
	if (props.imageKey) {
		imageUrl.value = await buildUrl(props.imageKey, { sizing: { ...DefaultSizingParams, width: 300 } });
	}
}, {immediate: true});


let boundingRect:DOMRect|null = null;
const mouseIsDown = ref(false);

function mouseDown(e:MouseEvent) {
	mouseIsDown.value = true;

	boundingRect = (<HTMLElement>e.target)?.getBoundingClientRect();

	if (boundingRect) {
		console.log({
			x: e.offsetX / boundingRect.width,
			y: e.offsetY / boundingRect.height,
			zoom: currentValue.value.zoom,
		});

		emit("update:modelValue", {
			x: e.offsetX / boundingRect.width,
			y: e.offsetY / boundingRect.height,
			zoom: currentValue.value.zoom,
		});
	}
}

function mouseMove(e:MouseEvent) {
	if (!mouseIsDown.value) {
		return;
	}

	if (boundingRect) {
		console.log({
			x: e.offsetX / boundingRect.width,
			y: e.offsetY / boundingRect.height,
			zoom: currentValue.value.zoom,
		});

		emit("update:modelValue", {
			x: e.offsetX / boundingRect.width,
			y: e.offsetY / boundingRect.height,
			zoom: currentValue.value.zoom,
		});
	}
}

function mouseUp(e:MouseEvent) {
	mouseIsDown.value = false;
}

function faceStyle(face:Face) {
	return {
		left: `${face.box.left * 100}%`,
		top: `${face.box.top * 100}%`,
		width: `${face.box.width * 100}%`,
		height: `${face.box.height * 100}%`,
	};

}
</script>

<template>
	<div v-if="imageUrl" class="w-full relative">
		<img
			draggable="false"
			class="w-full h-auto select-none"
			:src="imageUrl"

			@mousedown="mouseDown"
			@mousemove="mouseMove"
			@mouseup="mouseUp"
			@mouseleave="mouseUp"
		/>
		<template v-if="imageMeta">
			<div v-for="(face, key, idx) in imageMeta.faces" class="pointer-events-none border border-white absolute drop-shadow" :style="faceStyle(face)"></div>
		</template>
		<FocalPointerIcon :style="focalPointStyle" class="w-5 h-auto pointer-events-none absolute -translate-x-1/2 -translate-y-1/2" />
	</div>
</template>

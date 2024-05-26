<script setup lang="ts">
import { computed, ref } from 'vue';
import type {Face, ImageMeta} from "@/types/image-meta";
import type {FoxySource} from "@/types/options";
import buildUrl from "@/utils/url-builder";
import {buildImageParams} from "@/types/params";
import Icon from "@/components/UI/Icon.vue";

const props = defineProps<{
	modelValue: {x: number, y:number},
	currentSource: FoxySource|null,
	imageKey: string,
	imageMeta: ImageMeta|null,
}>();

const emit = defineEmits(['update:modelValue']);

const currentValue = computed<{x: number, y:number}>({
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

const imageUrl = computed(() => {
	if (!props.currentSource || !props.currentSource.url || !props.currentSource.key || !props.currentSource.secret || !props.imageKey) {
		return null;
	}

	return buildUrl(props.currentSource.url, props.currentSource.key, props.currentSource.secret, props.imageKey, buildImageParams({ width: 300 }));
});

let boundingRect:DOMRect|null = null;
const mouseIsDown = ref(false);

function mouseDown(e:MouseEvent) {
	mouseIsDown.value = true;

	boundingRect = (<HTMLElement>e.target)?.getBoundingClientRect();

	if (boundingRect) {
		console.log({
			x: e.offsetX / boundingRect.width,
			y: e.offsetY / boundingRect.height,
		});

		emit("update:modelValue", {
			x: e.offsetX / boundingRect.width,
			y: e.offsetY / boundingRect.height,
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
		});

		emit("update:modelValue", {
			x: e.offsetX / boundingRect.width,
			y: e.offsetY / boundingRect.height,
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
		<Icon name="focal-pointer" :style="focalPointStyle" class="w-5 h-auto pointer-events-none absolute -translate-x-1/2 -translate-y-1/2" />
	</div>
</template>
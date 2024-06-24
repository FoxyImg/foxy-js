<script setup lang="ts">
import { computed, ref } from 'vue';
import type {Face, ImageMeta} from "@/types/image-meta";
import buildUrl from "@/utils/build-url";
import Icon from "@/components/UI/Icon.vue";
import {storeToRefs} from "pinia";
import {useFoxyAppStore} from "@/stores/foxy-app-store";
import {useImageParamsStore} from "@/stores/image-params-store";

const {
	currentApp,
	currentSource,
	imageKey,
} = storeToRefs(useFoxyAppStore());

const {
	imageMeta,
} = storeToRefs(useImageParamsStore());


const props = defineProps<{
	modelValue: {x: number, y:number},
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
	if (!currentSource.value || !currentApp.value || !currentApp.value.url || !currentSource.value.key || !currentApp.value.signingKey || !imageKey.value) {
		return null;
	}

	return buildUrl(currentApp.value.url, currentSource.value.key, currentApp.value.signingKey, imageKey.value, { sizing: { width: 300 }}, null, false, currentSource.value.imgixMode);
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
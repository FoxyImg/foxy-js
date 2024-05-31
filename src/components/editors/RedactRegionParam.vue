<script setup lang="ts">
import {storeToRefs} from "pinia";
import {useFoxyAppStore} from "@/stores/foxy-app-store";
import {useImageParamsStore} from "@/stores/image-params-store";
import {buildImageParams, type Rect} from "@/types/params";
import {computed, ref} from "vue";
import buildUrl from "@/utils/url-builder";
import type {Face} from "@/types/image-meta";
import Icon from "@/components/UI/Icon.vue";

const {
	currentApp,
	currentSource,
	imageKey,
} = storeToRefs(useFoxyAppStore());

const {
	imageMeta,
} = storeToRefs(useImageParamsStore());

const props = defineProps<{
	modelValue: Rect[],
}>();

const emit = defineEmits(['update:modelValue']);

const imageUrl = computed(() => {
	if (!currentSource.value || !currentApp.value || !currentApp.value.url || !currentSource.value.key || !currentApp.value.secret || !imageKey.value) {
		return null;
	}

	return buildUrl(currentApp.value.url, currentSource.value.key, currentApp.value.secret, imageKey.value, buildImageParams({ width: 300 }));
});

function regionStyle(region:Rect) {
	return {
		left: `${region.left * 100}%`,
		top: `${region.top * 100}%`,
		width: `${region.width * 100}%`,
		height: `${region.height * 100}%`,
	};
}

const mouseIsDown = ref(false);
const downX = ref(0);
const downY = ref(0);
const currentX = ref(0);
const currentY = ref(0);

const currentStyle = computed(() => {
	if (!mouseIsDown.value || (downX.value === currentX.value && downY.value === currentY.value)) {
		return {};
	}

	return {
		left: `${Math.min(currentX.value, downX.value)}px`,
		top: `${Math.min(currentY.value, downY.value)}px`,
		width: `${Math.max(currentX.value, downX.value) - Math.min(currentX.value, downX.value)}px`,
		height: `${Math.max(currentY.value, downY.value) - Math.min(currentY.value, downY.value)}px`,
	};
});


function mouseDown(e:MouseEvent) {
	mouseIsDown.value = true;

	downX.value = e.offsetX;
	downY.value = e.offsetY;
	currentX.value = e.offsetX;
	currentY.value = e.offsetY;
}

function mouseMove(e:MouseEvent) {
	if (!mouseIsDown.value) {
		return;
	}

	currentX.value = e.offsetX;
	currentY.value = e.offsetY;
}

function mouseUp(e:MouseEvent) {
	if (!mouseIsDown.value) {
		return;
	}

	const boundingRect = (<HTMLElement>e.target)?.getBoundingClientRect();
	if (!boundingRect) {
		return;
	}

	const left = Math.min(currentX.value, downX.value) / boundingRect.width;
	const top = Math.min(currentY.value, downY.value) / boundingRect.height;
	const width = (Math.max(currentX.value, downX.value) - Math.min(currentX.value, downX.value)) / boundingRect.width;
	const height = (Math.max(currentY.value, downY.value) - Math.min(currentY.value, downY.value)) / boundingRect.height;

	const newVal = JSON.parse(JSON.stringify(props.modelValue));
	newVal.push({
		left: left,
		top: top,
		width: width,
		height: height,
	});

	emit('update:modelValue', newVal);

	mouseIsDown.value = false;
}

function removeRegion(idx:number) {
	const newVal = JSON.parse(JSON.stringify(props.modelValue));
	newVal.splice(idx, 1);

	emit('update:modelValue', newVal);
}
</script>
<template>
	<div class="flex flex-col gap-1.5">
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

			<div v-for="(region, idx) in modelValue" class="pointer-events-none border border-white absolute drop-shadow" :style="regionStyle(region)">
				<div @click="removeRegion(idx)" class="pointer-events-auto cursor-pointer absolute left-0 top-0 p-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/50 hover:bg-white backdrop-blur-lg">
					<Icon name="close" class="fill-black w-1.5 h-auto" />
				</div>
			</div>
			<div v-if="mouseIsDown" class="pointer-events-none border border-white absolute drop-shadow" :style="currentStyle"></div>
		</div>
		<div class="flex justify-end text-xxxs uppercase">
			<a href="#" @click.prevent.stop="emit('update:modelValue', [])">Reset</a>
		</div>
	</div>
</template>
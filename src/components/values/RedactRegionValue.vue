<script setup lang="ts">
import {storeToRefs} from "pinia";
import {useFoxyAppStore} from "@/stores/foxy-app-store";
import {useImageParamsStore} from "@/stores/image-params-store";
import {buildImageParams, type RedactRect} from "@/types/params";
import {computed, ref} from "vue";
import buildUrl from "@/utils/build-url";
import type {Face} from "@/types/image-meta";
import Icon from "@/components/UI/Icon.vue";
import RedactRegion from "@/components/values/RedactRegion.vue";
import SliderParam from "@/components/values/SliderValue.vue";
import {DefaultSizingParams} from "@/composables/params/sizing";

const {
	currentApp,
	currentSource,
	imageKey,
} = storeToRefs(useFoxyAppStore());

const {
	imageMeta,
} = storeToRefs(useImageParamsStore());

const props = defineProps<{
	modelValue: RedactRect[],
	cornerRadius: number,
}>();

const selectedRectIdx = ref(-1);

const selectedRect = computed(() => {
	if (selectedRectIdx.value === -1) {
		return null;
	}

	return props.modelValue[selectedRectIdx.value];
});

const selectedCornerRadius = computed({
	get: () => selectedRect.value ? selectedRect.value.cornerRadius : 0,
	set: (value) => {
		if (selectedRect.value) {
			selectedRect.value.cornerRadius = value;
		}
	},
});

const selectedCornerRotation = computed({
	get: () => selectedRect.value ? selectedRect.value.rotation : 0,
	set: (value) => {
		if (selectedRect.value) {
			selectedRect.value.rotation = value;
		}
	},
});

const emit = defineEmits(['update:modelValue']);

const imageUrl = computed(() => {
	if (!currentSource.value || !currentApp.value || !currentApp.value.url || !currentSource.value.key || !currentApp.value.signingKey || !imageKey.value) {
		return null;
	}

	return buildUrl(currentApp.value.url, currentSource.value.key, currentApp.value.signingKey, imageKey.value, buildImageParams({ sizing: { ...DefaultSizingParams, width: 300 } }));
});

const currentValue = computed({
	get: () => props.modelValue,
	set: (value) => emit('update:modelValue', value),
});

function regionStyle(region:RedactRect) {
	const style:any = {
		left: `${region.left * 100}%`,
		top: `${region.top * 100}%`,
		width: `${region.width * 100}%`,
		height: `${region.height * 100}%`,
		borderRadius: `${region.cornerRadius}%`,
	};

	if (selectedRect.value === region) {
		style.border = '2px solid red';
	}

	return style;
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
		cornerRadius: 0,
		rotation: 0,
	});

	emit('update:modelValue', newVal);

	selectedRectIdx.value = newVal.length - 1;

	mouseIsDown.value = false;
}

function removeRegion(idx:number) {
	const newVal = JSON.parse(JSON.stringify(props.modelValue));
	newVal.splice(idx, 1);

	emit('update:modelValue', newVal);
}

function selectRegion(idx:number) {
	selectedRectIdx.value = idx;
}

const container = ref<HTMLElement|null>(null);
</script>
<template>
	<div class="flex flex-col gap-3">
		<div class="flex flex-col gap-1.5">
			<div v-if="imageUrl" class="w-full relative" ref="container">
				<img
					draggable="false"
					class="w-full h-auto select-none"
					:src="imageUrl"

					@mousedown="mouseDown"
					@mousemove="mouseMove"
					@mouseup="mouseUp"
					@mouseleave="mouseUp"
				/>

				<template v-for="(region, idx) in currentValue" :key="idx">
					<RedactRegion
						v-model="currentValue[idx]"
						:selected="selectedRectIdx === idx"
						:container="container"
						@remove="removeRegion(idx)"
						@select="selectRegion(idx)"
					/>
				</template>
				<div v-if="mouseIsDown" class="pointer-events-none border border-white absolute drop-shadow" :style="currentStyle"></div>
			</div>
			<div class="flex justify-end text-xxxs uppercase">
				<a href="#" @click.prevent.stop="emit('update:modelValue', [])">Reset</a>
			</div>
		</div>
		<SliderParam title="Region Corner Radius" v-model="selectedCornerRadius" :min="0" :max="100" :step="1" :default="0" default-label="None" suffix="%" :disabled="!selectedRect" />
		<SliderParam title="Region Corner Rotation" v-model="selectedCornerRotation" :min="-360" :max="360" :step="1" :default="0" default-label="None" suffix="°" :disabled="!selectedRect" />
	</div>
</template>
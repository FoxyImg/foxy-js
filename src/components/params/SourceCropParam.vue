<script setup lang="ts">
import {computed, ref} from 'vue';
import {buildImageParams, type SourceCropParams} from "@/types/params";
import {storeToRefs} from "pinia";
import {useFoxyAppStore} from "@/stores/foxy-app-store";
import buildUrl from "@/utils/url-builder";
import SourceCropModal from "@/components/modals/SourceCropModal.vue";
import {useImageParamsStore} from "@/stores/image-params-store";

const {
	currentApp,
	currentSource,
	imageKey,
} = storeToRefs(useFoxyAppStore());

const {
	imageMeta,
} = storeToRefs(useImageParamsStore());

const props = withDefaults(defineProps<{
	title: string,
	modelValue: SourceCropParams,
	default: SourceCropParams,
}>(), {
});

const emit = defineEmits<{
	(e: 'update:modelValue', value: SourceCropParams): void;
}>();

const currentValue = computed({
	get: () => props.modelValue,
	set: (value) => emit('update:modelValue', value),
});

const imageUrl = computed(() => {
	if (!currentSource.value || !currentApp.value || !currentApp.value.url || !currentSource.value.key || !currentApp.value.signingKey || !imageKey.value) {
		return null;
	}

	return buildUrl(currentApp.value.url, currentSource.value.key, currentApp.value.signingKey, imageKey.value, buildImageParams({ width: 300 }));
});

const showCropModal = ref(false);

const cropStyle = computed(() => {
	if (imageMeta.value === null || currentValue.value.width === 0 || currentValue.value.height === 0) {
		return {
			left: '0',
			top: '0',
			width: '0',
			height: '0',
		};
	}

	const x = currentValue.value.x / imageMeta.value.width * 100.0;
	const y = currentValue.value.y / imageMeta.value.height * 100.0;
	const w = currentValue.value.width / imageMeta.value.width * 100.0;
	const h = currentValue.value.height / imageMeta.value.height * 100.0;

	return {
		left: 0,
		top: 0,
		width: '100%',
		height: '100%',
		clipPath: `polygon(
			0% ${y}%,
			0% 0%,
			100%  0%,
			100%  100%,
			0% 100%,
			0% ${y}%,
			${x}% ${y}%,
			${x}% ${y+h}%,
			${x+w}% ${y+h}%,
			${x+w}% ${y}%,
			${x}% ${y}%,
			0% ${y}%
		)`,
	}
});

const cropBorderStyle = computed(() => {
	if (imageMeta.value === null || currentValue.value.width === 0 || currentValue.value.height === 0) {
		return {
			display: 'none',
		};
	}

	return {
		width: `${currentValue.value.width / imageMeta.value.width * 100.0}%`,
		height: `${currentValue.value.height / imageMeta.value.height * 100.0}%`,
		left: `${currentValue.value.x / imageMeta.value.width * 100.0}%`,
		top: `${currentValue.value.y / imageMeta.value.height * 100.0}%`,
	}
});

const isMouseDown = ref(false);
const lastMousePos = ref({x: 0, y: 0});
const imageRef = ref<HTMLImageElement|null>(null);
const imageRect = ref<DOMRect|null>(null);

function mouseDown(e:MouseEvent) {
	if (!imageMeta.value || imageRef.value === null) {
		return;
	}

	imageRect.value = imageRef.value.getBoundingClientRect();
	isMouseDown.value = true;
	lastMousePos.value = {x: e.clientX - imageRect.value!.x, y: e.clientY - imageRect.value!.y};
	document.addEventListener('mousemove', mouseMove);
	document.addEventListener('mouseup', mouseUp, {once: true});
}

function mouseMove(e:MouseEvent) {
	if (!imageMeta.value || !isMouseDown.value || imageRef.value === null) {
		return;
	}

	const newPos = {x: e.clientX - imageRect.value!.x, y: e.clientY - imageRect.value!.y};
	const dx = newPos.x - lastMousePos.value.x;
	const dy = newPos.y - lastMousePos.value.y;
	const nx = currentValue.value.x + ((dx / imageRect.value!.width) * imageMeta.value!.width);
	const ny = currentValue.value.y + ((dy / imageRect.value!.width) * imageMeta.value!.height);
	const mx = imageMeta.value!.width - currentValue.value.width;
	const my = imageMeta.value!.height - currentValue.value.height;

	currentValue.value.x = Math.min(mx, Math.max(0, nx));
	currentValue.value.y = Math.min(my, Math.max(0, ny));

	lastMousePos.value = newPos;
	console.log(dx, dy, currentValue.value.x, currentValue.value.y);
}

function mouseUp(e:MouseEvent) {
	if (!imageMeta.value || !isMouseDown.value || imageRef.value === null) {
		return;
	}

	emit('update:modelValue', currentValue.value);
	document.removeEventListener('mousemove', mouseMove);
}

</script>
<template>
	<div class="flex flex-col gap-1.5">
		<div class="flex flex-col items-start gap-1">
			<div class="w-full relative">
				<img
					v-if="imageUrl"
					draggable="false"
					class="w-full h-auto select-none"
					:src="imageUrl"
					ref="imageRef"
				/>
				<div class="absolute bg-black/30 backdrop-blur-sm" :style="cropStyle"></div>
				<div class="absolute border border-white/50 cursor-move" @mousedown="mouseDown" :style="cropBorderStyle"></div>
			</div>
		</div>
		<div class="flex justify-end text-xs gap-2">
			<button type="button" class="button small"  @click="emit('update:modelValue', props.default)">Clear Crop</button>
			<button type="button" class="button small"  @click="showCropModal = true">Edit Crop</button>
		</div>
	</div>
	<teleport to="#modals">
		<SourceCropModal v-if="showCropModal" v-model="currentValue" @close="showCropModal = false" />
	</teleport>
</template>
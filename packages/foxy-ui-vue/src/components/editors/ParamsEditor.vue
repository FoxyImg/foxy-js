<script setup lang="ts">
import ColorInput from "../inputs/ColorInput.vue";
import EditorPanel from "../inputs/EditorPanel.vue";
import SourceCropParam from "../params/SourceCropParam.vue";
import SizingParam from "../params/SizingParam.vue";
import BackgroundRemovalParam from "../params/BackgroundRemovalParam.vue";
import RotationParam from "../params/RotationParam.vue";
import AdjustmentsParam from "../params/AdjustmentsParam.vue";
import StylizeParam from "../params/StylizeParam.vue";
import GradientMapParam from "../params/GradientMapParam.vue";
import BorderParam from "../params/BorderParam.vue";
import MaskParam from "../params/MaskParam.vue";
import RedactParam from "../params/RedactParam.vue";
import ExportParam from "../params/ExportParam.vue";
import LevelsParam from "../params/LevelsParam.vue";

import {type ImageMeta, type ImageParams} from "@foxyimg/url-builder";

defineProps<{
	imageParams: ImageParams,
	imageKey: string|null,
	imageMeta: ImageMeta|null,
	faceCount: number,
	peopleCount: number,
	sampleImages: string[],
	overlayImages: string[],
}>();

const emit = defineEmits<{
	(e: 'resetImageParams'): void
	(e: 'removeSampleImage', value: string): void;
	(e: 'addSampleImage', value: string): void;
	(e: 'removeOverlayImage', value: string): void;
	(e: 'addOverlayImage', value: string): void;
}>();

</script>

<template>
	<div class="p-3 flex flex-col gap-3">
		<SourceCropParam v-model="imageParams.sourceCrop" :image-meta="imageMeta" :image-key="imageKey" />
		<SizingParam v-model="imageParams.sizing" :image-key="imageKey" :image-meta="imageMeta" :face-count="faceCount" :people-count="peopleCount" />
		<EditorPanel title="Image Attributes" collapse-key="image-attributes">
			<ColorInput title="Background Color" v-model="imageParams.backgroundColor" :default="null" />
		</EditorPanel>
		<BackgroundRemovalParam
			v-model="imageParams.backgroundRemoval"
			:sample-images="sampleImages"
			@remove-sample-image="emit('removeSampleImage', $event)"
			@add-sample-image="emit('addSampleImage', $event)" />
		<RotationParam v-model="imageParams.rotation" />
		<LevelsParam v-model="imageParams.levels" />
		<AdjustmentsParam v-model="imageParams.adjustments" />
		<StylizeParam v-model="imageParams.stylize" />
		<GradientMapParam v-model="imageParams.gradientMap" />
		<BorderParam v-model="imageParams.padding" noun="Padding" collapse-key="padding-editor" constrain-key="foxy_constrain_padding" />
		<BorderParam v-model="imageParams.border" noun="Border" collapse-key="border-editor" constrain-key="foxy_constrain_border" />
		<MaskParam v-model="imageParams.mask" :overlay-images="overlayImages" @add-overlay-image="emit('addOverlayImage', $event)" @remove-overlay-image="emit('removeOverlayImage', $event)" />
		<RedactParam v-model="imageParams.redact" :image-meta="imageMeta" :image-key="imageKey" />
		<ExportParam v-model="imageParams.export" />
		<EditorPanel collapse-key="debug-editor">
			<div class="flex items-center justify-center">
				<div @click="emit('resetImageParams')" class="cursor-pointer text-xs hover:text-blue-600">Reset All</div>
			</div>
		</EditorPanel>
	</div>
</template>

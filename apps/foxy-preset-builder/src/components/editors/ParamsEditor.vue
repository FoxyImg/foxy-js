<script setup lang="ts">
import ColorValue from "@/components/values/ColorValue.vue";
import EditorPanel from "@/components/values/EditorPanel.vue";
import SourceCropParam from "@/components/params/SourceCropParam.vue";
import SizingParam from "@/components/params/SizingParam.vue";
import BackgroundRemovalParam from "@/components/params/BackgroundRemovalParam.vue";
import RotationParam from "@/components/params/RotationParam.vue";
import AdjustmentsParam from "@/components/params/AdjustmentsParam.vue";
import StylizeParam from "@/components/params/StylizeParam.vue";
import GradientMapParam from "@/components/params/GradientMapParam.vue";
import BorderParam from "@/components/params/BorderParam.vue";
import MaskParam from "@/components/params/MaskParam.vue";
import RedactParam from "@/components/params/RedactParam.vue";
import ExportParam from "@/components/params/ExportParam.vue";
import LevelsParam from "@/components/params/LevelsParam.vue";

import {type ImageMeta, type ImageParams} from "@foxy/url-builder";

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
			<ColorValue title="Background Color" v-model="imageParams.backgroundColor" :default="null" />
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
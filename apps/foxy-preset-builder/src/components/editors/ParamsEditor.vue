<script setup lang="ts">
import ColorValue from "@/components/values/ColorValue.vue";
import EditorPanel from "@/components/values/EditorPanel.vue";
import {storeToRefs} from "pinia";
import {useImageParamsStore} from "@/stores/image-params-store";
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

const {
	imageParams,
} = storeToRefs(useImageParamsStore());


const {
	resetParams,
} = useImageParamsStore();
</script>

<template>
	<div class="p-3 flex flex-col gap-3">
		<SourceCropParam v-model="imageParams.sourceCrop" />
		<SizingParam v-model="imageParams.sizing" />
		<EditorPanel title="Image Attributes" collapse-key="image-attributes">
			<ColorValue title="Background Color" v-model="imageParams.backgroundColor" :default="null" />
		</EditorPanel>
		<BackgroundRemovalParam v-model="imageParams.backgroundRemoval" />
		<RotationParam v-model="imageParams.rotation" />
		<LevelsParam v-model="imageParams.levels" />
		<AdjustmentsParam v-model="imageParams.adjustments" />
		<StylizeParam v-model="imageParams.stylize" />
		<GradientMapParam v-model="imageParams.gradientMap" />
		<BorderParam v-model="imageParams.padding" noun="Padding" collapse-key="padding-editor" constrain-key="foxy_constrain_padding" />
		<BorderParam v-model="imageParams.border" noun="Border" collapse-key="border-editor" constrain-key="foxy_constrain_border" />
		<MaskParam v-model="imageParams.mask" />
		<RedactParam v-model="imageParams.redact" />
		<ExportParam v-model="imageParams.export" />
		<EditorPanel collapse-key="debug-editor">
			<div class="flex items-center justify-center">
				<div @click="resetParams" class="cursor-pointer text-xs hover:text-blue-600">Reset All</div>
			</div>
		</EditorPanel>
	</div>
</template>
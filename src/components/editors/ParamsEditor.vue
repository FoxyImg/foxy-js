<script setup lang="ts">
import {
	BlendModeOptions,
	BlendModes,
	DefaultImageParams, ExportFormatOptions, MaskFitOptions, MaskTypeOptions,
	RotationModeOptions,
	StylizeOrderOptions,
} from "@/types/params";
import {CropOptions, HGravityOptions, InterestingOptions, VGravityOptions} from "@/types/options";
import SelectParam from "@/components/params/SelectParam.vue";
import SliderParam from "@/components/params/SliderParam.vue";
import TagsParam from "@/components/params/TagsParam.vue";
import ColorParam from "@/components/params/ColorParam.vue";
import ObjectSelectParam from "@/components/params/ObjectSelectParam.vue";
import FocalPointParam from "@/components/params/FocalPointParam.vue";
import EditorPanel from "@/components/params/EditorPanel.vue";
import GradientMapParam from "@/components/params/GradientMapParam.vue";
import SourceCropParam from "@/components/params/SourceCropParam.vue";
import RedactRegionParam from "@/components/params/RedactRegionParam.vue";
import ToggleParam from "@/components/params/ToggleParam.vue";
import Icon from "@/components/UI/Icon.vue";
import {storeToRefs} from "pinia";
import {useImageParamsStore} from "@/stores/image-params-store";
import {useStorage} from "@vueuse/core";
import {computed, watch} from "vue";
import {useFoxyAppStore} from "@/stores/foxy-app-store";
import OverlayImageParam from "@/components/params/OverlayImageParam.vue";

const {
	imageKey,
} = storeToRefs(useFoxyAppStore());

const {
	imageParams,
	imageMeta,
	faceCount,
	peopleCount,
} = storeToRefs(useImageParamsStore());


const {
	resetParams,
} = useImageParamsStore();

const constrainDimensions = useStorage('foxy_constrain_dimensions', false);
const constrainPadding = useStorage('foxy_constrain_padding', true);
const constrainBorder = useStorage('foxy_constrain_border', true);
const constrainWatermarkPadding = useStorage('foxy_constrain_watermark_padding', true);


const personOptions = computed(() => {
	const options = [
		{ label: 'Smallest Person', value: -3 },
		{ label: 'Largest Person', value: -2 },
		{ label: 'All People', value: -1 },
	];

	if (imageMeta.value && imageMeta.value.people && imageMeta.value.people.length > 0) {
		options.push(...imageMeta.value.people.map((person:any, index:number) => ({
			label: `Person ${index + 1} - ${person.name}`,
			value: index,
		})));
	}

	return options;
});

const redactPersonOptions = computed(() => {
	const options = [
		{ label: 'All People', value: 'all' },
	];

	if (imageMeta.value && imageMeta.value.people && imageMeta.value.people.length > 0) {
		options.push(...imageMeta.value.people.map((person:any, index:number) => ({
			label: `Person ${index + 1} - ${person.name}`,
			value: `${index}`,
		})));
	}

	return options;
});

const faceOptions = computed(() => {
	const options = [
		{ label: 'Smallest Face', value: -3 },
		{ label: 'Largest Face', value: -2 },
		{ label: 'All Faces', value: -1 },
	];

	if (imageMeta.value && imageMeta.value.faces && imageMeta.value.faces.length > 0) {
		options.push(...imageMeta.value.faces.map((face:any, index:number) => ({
			label: `Face #${index + 1}`,
			value: index,
		})));
	}

	return options;
});

const redactFaceOptions = computed(() => {
	const options = [
		{ label: 'All Faces', value: "all" },
	];

	if (imageMeta.value && imageMeta.value.faces && imageMeta.value.faces.length > 0) {
		options.push(...imageMeta.value.faces.map((face:any, index:number) => ({
			label: `Face #${index + 1}`,
			value: `${index}`,
		})));
	}

	return options;
});

watch(() => [imageParams.value.width, imageParams.value.height], (newVal, oldVal) => {
	if (!constrainDimensions.value) {
		return;
	}

	if (oldVal[0] !== newVal[0]) {
		if (imageParams.value.height !== newVal[0]) {
			imageParams.value.height = newVal[0];
		}
	} else if (oldVal[1] !== newVal[1]) {
		if (imageParams.value.width !== newVal[1]) {
			imageParams.value.width = newVal[1];
		}
	}
});

watch(() => [imageParams.value.padding.top, imageParams.value.padding.left, imageParams.value.padding.right, imageParams.value.padding.bottom], (newVal, oldVal) => {
	if (!constrainPadding.value) {
		return;
	}

	if (oldVal[0] !== newVal[0]) {
		imageParams.value.padding.left = newVal[0];
		imageParams.value.padding.right = newVal[0];
		imageParams.value.padding.bottom = newVal[0];
	} else if (oldVal[1] !== newVal[1]) {
		imageParams.value.padding.top = newVal[1];
		imageParams.value.padding.right = newVal[1];
		imageParams.value.padding.bottom = newVal[1];
	} else if (oldVal[2] !== newVal[2]) {
		imageParams.value.padding.top = newVal[2];
		imageParams.value.padding.left = newVal[2];
		imageParams.value.padding.bottom = newVal[2];
	} else if (oldVal[3] !== newVal[3]) {
		imageParams.value.padding.top = newVal[3];
		imageParams.value.padding.left = newVal[3];
		imageParams.value.padding.right = newVal[3];
	}
});

watch(() => [imageParams.value.border.top, imageParams.value.border.left, imageParams.value.border.right, imageParams.value.border.bottom], (newVal, oldVal) => {
	if (!constrainBorder.value) {
		return;
	}

	if (oldVal[0] !== newVal[0]) {
		imageParams.value.border.left = newVal[0];
		imageParams.value.border.right = newVal[0];
		imageParams.value.border.bottom = newVal[0];
	} else if (oldVal[1] !== newVal[1]) {
		imageParams.value.border.top = newVal[1];
		imageParams.value.border.right = newVal[1];
		imageParams.value.border.bottom = newVal[1];
	} else if (oldVal[2] !== newVal[2]) {
		imageParams.value.border.top = newVal[2];
		imageParams.value.border.left = newVal[2];
		imageParams.value.border.bottom = newVal[2];
	} else if (oldVal[3] !== newVal[3]) {
		imageParams.value.border.top = newVal[3];
		imageParams.value.border.left = newVal[3];
		imageParams.value.border.right = newVal[3];
	}
});
</script>

<template>
	<div class="p-3 flex flex-col gap-3">
		<EditorPanel title="Source Crop" collapse-key="source-crop-editor" v-model="imageParams.enableSourceCrop" :show-toggle="true" :disabled="!imageParams.enableSourceCrop">
			<SourceCropParam title="Crop" :default="DefaultImageParams.sourceCrop" v-model="imageParams.sourceCrop" />
		</EditorPanel>
		<EditorPanel title="Cropping / Resizing" collapse-key="crop-editor" v-model="imageParams.enableCrop" :show-toggle="true" :disabled="!imageParams.enableCrop">
			<TagsParam title="Crop Mode" :options="CropOptions" v-model="imageParams.crop" placeholder="Select 1 or more crop modes" />
			<SelectParam v-if="imageParams.crop.includes('smart')" title="Smart Crop Mode" v-model="imageParams.smartMode" :default="null" :options="InterestingOptions" />
			<div class="flex items-center gap-1">
				<div class="flex-1 flex flex-col gap-3">
					<SliderParam title="Width" v-model="imageParams.width" :min="0" :max="3840" :step="1" :default="0" default-label="None" suffix="px" />
					<SliderParam title="Height" v-model="imageParams.height" :min="0" :max="3840" :step="1" :default="0" default-label="None" suffix="px" />
				</div>
				<div class="flex flex-col items-center justify-center gap-1">
					<Icon name="contrain-line" class="w-3 h-auto stroke-neutral-500" />
					<div class="cursor-pointer border border-neutral-300 rounded-lg p-1" :class="{'bg-neutral-300': constrainDimensions}" @click="constrainDimensions = !constrainDimensions">
						<Icon name="constrain" class="fill-black w-3 h-auto" />
					</div>
					<Icon name="contrain-line" class="w-3 h-auto stroke-neutral-500 rotate-180 -scale-x-100" />
				</div>
			</div>
			<SliderParam v-if="imageParams.crop.length > 0" title="Aspect Ratio Width" v-model="imageParams.aspectRatioWidth" :min="0" :max="128" :step="1" :default="0" default-label="None" />
			<SliderParam v-if="imageParams.crop.length > 0" title="Aspect Ratio Height" v-model="imageParams.aspectRatioHeight" :min="0" :max="128" :step="1" :default="0" default-label="None" />
			<SliderParam v-if="imageParams.crop.length > 0" title="Zoom" v-model="imageParams.zoom" :min="1" :max="10" :step="0.01" :default="1" default-label="None" suffix="x" />
			<div v-if="imageParams.crop.includes('crop')" class="grid grid-cols-2 gap-3">
				<SelectParam title="Horizontal Gravity" v-model="imageParams.hGravity" default="center" :allow-null="false" :options="HGravityOptions" />
				<SelectParam title="Vertical Gravity" v-model="imageParams.vGravity" default="center" :allow-null="false" :options="VGravityOptions" />
			</div>
		</EditorPanel>
		<EditorPanel v-if="imageParams.crop.includes('focus') && imageKey" collapse-key="focal-point-editor" title="Focal Point"  :disabled="!imageParams.enableCrop">
			<FocalPointParam v-model="imageParams.focalPoint"/>
			<SliderParam title="Focal Point Zoom" v-model="imageParams.focalPointZoom" :min="0" :max="200" :step="1" :default="0" suffix="%" />
		</EditorPanel>
		<EditorPanel v-if="imageParams.crop.includes('face') && faceCount > 0" title="Face Crop Options" collapse-key="face-crop-options"  :disabled="!imageParams.enableCrop">
			<ObjectSelectParam title="Face Index" v-model="imageParams.face.index" :default="-1" :allow-null="false" :options="faceOptions" />
			<SliderParam title="Face Padding" v-model="imageParams.face.padding" :min="0" :max="256" :step="1" :default="8" suffix="px" />
			<SliderParam title="Face Zoom" v-model="imageParams.face.zoom" :min="0" :max="200" :step="1" :default="0" suffix="%" />
			<div class="grid grid-cols-2 gap-3">
				<SelectParam title="Face Horizontal Gravity" v-model="imageParams.face.hGravity" default="center" :allow-null="false" :options="HGravityOptions" />
				<SelectParam title="Face Vertical Gravity" v-model="imageParams.face.vGravity" default="top" :allow-null="false" :options="VGravityOptions" />
			</div>
			<ToggleParam title="Focus Face" v-model="imageParams.face.focus" />
		</EditorPanel>
		<EditorPanel v-if="imageParams.crop.includes('person') && peopleCount > 0" title="Person Crop Options" collapse-key="person-crop-options"  :disabled="!imageParams.enableCrop">
			<ObjectSelectParam title="Person Index" v-model="imageParams.person.index" :default="-1" :allow-null="false" :options="personOptions" />
			<SliderParam title="Person Padding" v-model="imageParams.person.padding" :min="0" :max="256" :step="1" :default="0" suffix="px" />
			<SliderParam title="Person Zoom" v-model="imageParams.person.zoom" :min="0" :max="200" :step="1" :default="0" suffix="%" />
			<div class="grid grid-cols-2 gap-3">
				<SelectParam title="Person Horiz. Gravity" v-model="imageParams.person.hGravity" default="center" :allow-null="false" :options="HGravityOptions" />
				<SelectParam title="Person Vertical Gravity" v-model="imageParams.person.vGravity" default="center" :allow-null="false" :options="VGravityOptions" />
			</div>
		</EditorPanel>
		<EditorPanel title="Image Attributes" collapse-key="image-attributes">
			<ColorParam title="Background Color" v-model="imageParams.backgroundColor" :default="null" />
		</EditorPanel>
		<EditorPanel title="Rotation" collapse-key="rotation-editor" v-model="imageParams.enabledRotation" :show-toggle="true" :disabled="!imageParams.enabledRotation">
			<SliderParam title="Rotation" v-model="imageParams.rotation.rotation" :min="0" :max="360" :step="1" :default="0" suffix="°" />
			<ObjectSelectParam title="Rotation Mode" v-model="imageParams.rotation.mode" :default="0" :allow-null="false" :options="RotationModeOptions" />
		</EditorPanel>
		<EditorPanel title="Adjustments" collapse-key="adjustments-editor"  v-model="imageParams.enableAdjustments" :show-toggle="true" :disabled="!imageParams.enableAdjustments">
			<SliderParam title="Brightness" v-model="imageParams.adjustments.brightness" :min="0" :max="200" :step="1" :default="100" suffix="%" />
			<SliderParam title="Saturation" v-model="imageParams.adjustments.saturation" :min="0" :max="200" :step="1" :default="100" suffix="%" />
			<SliderParam title="Vibrance" v-model="imageParams.adjustments.vibrance" :min="0" :max="100" :step="1" :default="0" default-label="None" />
			<SliderParam title="Contrast" v-model="imageParams.adjustments.contrast" :min="0" :max="3" :step="0.01" :default="1" />
			<SliderParam title="Exposure" v-model="imageParams.adjustments.exposure" :min="-3" :max="3" :step="0.01" :default="0" />
			<SliderParam title="Gamma" v-model="imageParams.adjustments.gamma" :min="0.01" :max="10" :step="0.01" :default="1" />
			<SliderParam title="Texture" v-model="imageParams.adjustments.texture" :min="0" :max="50" :step="0.1" :default="0" default-label="None" />
			<SliderParam title="Texture Density" v-model="imageParams.adjustments.textureDensity" :min="0" :max="100" :step="1" :default="100" suffix="%" />
			<SliderParam title="Hue" v-model="imageParams.adjustments.hue" :min="-360" :max="360" :step="1" :default="0" suffix="°" />
			<ToggleParam title="Invert" v-model="imageParams.adjustments.invert" />
		</EditorPanel>
		<EditorPanel title="Stylize" collapse-key="stylize-editor"  v-model="imageParams.enableStylize" :show-toggle="true" :disabled="!imageParams.enableStylize">
			<TagsParam title="Stylize Order" :options="StylizeOrderOptions" v-model="imageParams.stylize.order" placeholder="Order to process stylize operations" />
			<SliderParam title="Blur" v-model="imageParams.stylize.blur" :min="0" :max="512" :step="1" :default="0" default-label="None" suffix="px" />
			<SliderParam title="Pixelate" v-model="imageParams.stylize.pixelate" :min="0" :max="512" :step="1" :default="0" default-label="None" suffix="px" />
		</EditorPanel>
		<EditorPanel title="Gradient Map" collapse-key="gradient-map-editor"  v-model="imageParams.enableGradientMap" :show-toggle="true" :disabled="!imageParams.enableGradientMap">
			<GradientMapParam title="Gradient Map" :default="DefaultImageParams.gradientMap.stops" v-model="imageParams.gradientMap.stops" :enabled="imageParams.gradientMap.opacity > 0" />
			<SliderParam title="Gradient Map Opacity" v-model="imageParams.gradientMap.opacity" :min="0" :max="100" :step="1" :default="0" default-label="Disabled" suffix="%" />
			<ObjectSelectParam title="Gradient Map Mode" v-model="imageParams.gradientMap.blendMode" :default="BlendModes.BlendModeOver" :allow-null="false" :options="BlendModeOptions" />
			<SliderParam title="Blur" v-model="imageParams.gradientMap.blur" :min="0" :max="320" :step="1" :default="0" default-label="None" suffix="px" />
			<ToggleParam title="Map Monochrome Image" v-model="imageParams.gradientMap.monochrome" />
		</EditorPanel>
		<EditorPanel title="Padding" collapse-key="padding-editor"  v-model="imageParams.enablePadding" :show-toggle="true" :disabled="!imageParams.enablePadding">
			<ColorParam title="Padding Color" v-model="imageParams.padding.color" :default="null" />
			<div class="flex items-center gap-1">
				<div class="flex-1 flex flex-col gap-3">
					<SliderParam title="Top Padding" v-model="imageParams.padding.top" :min="0" :max="512" :step="1" :default="0" default-label="None" suffix="px" />
					<SliderParam title="Right Padding" v-model="imageParams.padding.right" :min="0" :max="512" :step="1" :default="0" default-label="None" suffix="px" />
					<SliderParam title="Bottom Padding" v-model="imageParams.padding.bottom" :min="0" :max="512" :step="1" :default="0" default-label="None" suffix="px" />
					<SliderParam title="Left Padding" v-model="imageParams.padding.left" :min="0" :max="512" :step="1" :default="0" default-label="None" suffix="px" />
				</div>
				<div class="flex flex-col items-center justify-center gap-[8px]">
					<Icon name="constraint-line-long" class="w-[11px] h-auto stroke-neutral-300" />
					<div class="cursor-pointer border border-neutral-300 rounded-lg p-1" :class="{'bg-neutral-300': constrainPadding}" @click="constrainPadding = !constrainPadding">
						<Icon name="constrain" class="fill-black w-3 h-auto" />
					</div>
					<Icon name="constraint-line-long" class="w-[11px] h-auto stroke-neutral-300 rotate-180 -scale-x-100" />
				</div>
			</div>
		</EditorPanel>
		<EditorPanel title="Border" collapse-key="border-editor" v-model="imageParams.enableBorder" :show-toggle="true" :disabled="!imageParams.enableBorder">
			<ColorParam title="Border Color" v-model="imageParams.border.color" :default="null" />
			<div class="flex items-center gap-1">
				<div class="flex-1 flex flex-col gap-3">
					<SliderParam title="Top Border" v-model="imageParams.border.top" :min="0" :max="512" :step="1" :default="0" default-label="None" suffix="px" />
					<SliderParam title="Right Border" v-model="imageParams.border.right" :min="0" :max="512" :step="1" :default="0" default-label="None" suffix="px" />
					<SliderParam title="Bottom Border" v-model="imageParams.border.bottom" :min="0" :max="512" :step="1" :default="0" default-label="None" suffix="px" />
					<SliderParam title="Left Border" v-model="imageParams.border.left" :min="0" :max="512" :step="1" :default="0" default-label="None" suffix="px" />
				</div>
				<div class="flex flex-col items-center justify-center gap-[8px]">
					<Icon name="constraint-line-long" class="w-[11px] h-auto stroke-neutral-300" />
					<div class="cursor-pointer border border-neutral-300 rounded-lg p-1" :class="{'bg-neutral-300': constrainBorder}" @click="constrainBorder = !constrainBorder">
						<Icon name="constrain" class="fill-black w-3 h-auto" />
					</div>
					<Icon name="constraint-line-long" class="w-[11px] h-auto stroke-neutral-300 rotate-180 -scale-x-100" />
				</div>
			</div>
		</EditorPanel>
		<EditorPanel title="Mask" collapse-key="mask-editor" v-model="imageParams.enableMask" :show-toggle="true" :disabled="!imageParams.enableMask">
			<ObjectSelectParam title="Mask Type" v-model="imageParams.mask.type" default="circle" :allow-null="false" :options="MaskTypeOptions" />
			<OverlayImageParam v-if="imageParams.mask.type === 'image'" title="Mask Image Key" default="" v-model="imageParams.mask.imageKey" />
			<ObjectSelectParam v-if="imageParams.mask.type === 'image'" title="Mask Fit" v-model="imageParams.mask.fit" default="fit" :allow-null="false" :options="MaskFitOptions" />
			<SliderParam v-if="imageParams.mask.type === 'rect' || imageParams.mask.type === 'square'" title="Corner Radius" v-model="imageParams.mask.cornerRadius" :min="0" :max="1920" :step="1" :default="0" default-label="None" suffix="px" />
		</EditorPanel>
		<EditorPanel title="Redact" collapse-key="redact-editor" v-model="imageParams.enableRedact" :show-toggle="true" :disabled="!imageParams.enableRedact">
			<TagsParam title="Faces" :options="redactFaceOptions" v-model="imageParams.redact.faces" placeholder="Faces to redact" />
			<TagsParam title="People" :options="redactPersonOptions" v-model="imageParams.redact.people" placeholder="People to redact" />
			<RedactRegionParam v-model="imageParams.redact.regions" :corner-radius="imageParams.redact.cornerRadius" />
			<SliderParam title="Blur" v-model="imageParams.redact.blur" :min="0" :max="512" :step="1" :default="0" default-label="None" suffix="" />
			<SliderParam title="Pixelate" v-model="imageParams.redact.pixelate" :min="0" :max="512" :step="1" :default="0" default-label="None" suffix="px" />
			<ToggleParam title="Use Fill Color" v-model="imageParams.redact.useColor" />
			<ColorParam v-if="imageParams.redact.useColor" title="Fill Color" v-model="imageParams.redact.color" :default="null" />
			<SliderParam title="Blur Mask" v-model="imageParams.redact.blurMask" :min="0" :max="512" :step="1" :default="0" default-label="None" suffix="" />
			<SliderParam title="Expand Mask" v-model="imageParams.redact.expandMask" :min="0" :max="200" :step="1" :default="0" default-label="None" suffix="%" />
			<SliderParam title="Pixelate Mask" v-model="imageParams.redact.pixelateMask" :min="0" :max="512" :step="1" :default="0" default-label="None" suffix="px" />
		</EditorPanel>
		<EditorPanel title="Format" collapse-key="format-editor">
			<ObjectSelectParam title="File Format" v-model="imageParams.export.format" default="webp" :allow-null="false" :options="ExportFormatOptions" />
			<SliderParam title="Quality" v-model="imageParams.export.quality" :min="0" :max="100" :step="1" :default="85" />
			<SliderParam v-if="imageParams.export.format === 'webp'" title="Reduction Effort" v-model="imageParams.export.reductionEffort" :min="0" :max="6" :step="1" :default="4" />
			<ToggleParam title="Lossless" v-model="imageParams.export.lossless" />
			<ToggleParam title="Near Lossless" v-model="imageParams.export.nearLossless" />
		</EditorPanel>
		<EditorPanel collapse-key="debug-editor">
			<div class="flex items-center justify-center">
				<div @click="resetParams" class="cursor-pointer text-xs hover:text-blue-600">Reset All</div>
			</div>
		</EditorPanel>
	</div>
</template>
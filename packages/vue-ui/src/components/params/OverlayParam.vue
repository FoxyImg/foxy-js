<script setup lang="ts">
import {computed} from "vue";
import EditorPanel from "../inputs/EditorPanel.vue";
import EditorSubPanel from "../inputs/EditorSubPanel.vue";
import {
	FitOptions,
	OverlayBackgroundColorTypeOptions,
	type OverlayParams,
	OverlayTypeOptions,
	RotationOptions,
	HGravityOptions,
	VGravityOptions, type ImageMeta
} from "@foxyimg/url-builder";
import ObjectSelectInput from "../inputs/ObjectSelectInput.vue";
import OverlayImageInput from "../inputs/OverlayImageInput.vue";
import SubstitutionsInput from "../inputs/SubstitutionsInput.vue";
import ToggleInput from "../inputs/ToggleInput.vue";
import SliderInput from "../inputs/SliderInput.vue";
import SelectInput from "../inputs/SelectInput.vue";
import ColorInput from "../inputs/ColorInput.vue";
import DeleteSourceIcon from "../icons/DeleteSourceIcon.vue";

const props = defineProps<{
	modelValue: OverlayParams,
	overlayImages: string[],
	imageMeta: ImageMeta|null,
}>();

const emit = defineEmits<{
	(e: 'update:modelValue', value: OverlayParams): void
	(e: 'remove'): void
	(e: 'addOverlayImage', value: string): void;
	(e: 'removeOverlayImage', value: string): void;
}>();


const currentValue = computed({
	get: () => props.modelValue,
	set: (value) => emit('update:modelValue', value),
});

function overlayTitle(overlay:OverlayParams) {
	const type = overlay.type === 'image' ? 'Image Overlay' : 'Text Overlay';
	if (currentValue.value.type === 'image') {
		return `${type} - ${currentValue.value.url}`;
	} else {
		return `${type} - ${currentValue.value.text}`;
	}
}

const imageWidth = computed(() => {
	if (props.imageMeta === null) {
		return 1920;
	}

	return props.imageMeta.width;
});

const imageHeight = computed(() => {
	if (props.imageMeta === null) {
		return 1920;
	}

	return props.imageMeta.height;
});
</script>
<template>
	<EditorPanel :title="overlayTitle(currentValue)" v-model="currentValue.enabled"  :show-toggle="true"   :disabled="!currentValue.enabled" :collapse-key="`overlay-${currentValue.id}`">
		<template #extras-right>
			<DeleteSourceIcon class="w-auto h-3.5 fill-red-600 cursor-pointer" @click="emit('remove')" />
		</template>
		<ObjectSelectInput title="Overlay Type" v-model="currentValue.type" default="image" :allow-null="false" :options="OverlayTypeOptions" />
		<OverlayImageInput v-if="currentValue.type === 'image'" title="Overlay Image Key" default="" v-model="currentValue.url" :overlay-images="overlayImages" @add-overlay-image="emit('addOverlayImage', $event)" @remove-overlay-image="emit('removeOverlayImage', $event)" />
		<ObjectSelectInput v-if="currentValue.type === 'image'" title="Image Scaling" v-model="currentValue.fit" default="fit" :allow-null="false" :options="FitOptions" />
		<SubstitutionsInput title="Text Substitutions" :default="[]" v-model="currentValue.substitutions" />
		<ToggleInput v-if="currentValue.type === 'image'" title="Trim Overlay Image" v-model="currentValue.trim" />
		<SliderInput title="Opacity" v-model="currentValue.opacity" :min="0" :max="100" :step="1" :default="100" suffix="%" />
		<ObjectSelectInput v-if="currentValue.type === 'image' || currentValue.type === 'text'" title="Rotation" v-model="currentValue.rotate" :default="0" :allow-null="false" :options="RotationOptions" />
		<SliderInput title="Horizontal Padding" v-model="currentValue.hPadding" :min="0" :max="imageWidth" :step="1" :default="0" default-label="None" suffix="px" />
		<SliderInput title="Vertical Padding" v-model="currentValue.vPadding" :min="0" :max="imageHeight" :step="1" :default="0"  default-label="None" suffix="px" />
		<EditorSubPanel title="Position" :collapse-key="`overlay-${currentValue.id}-position`" :initially-expanded="false">
			<ToggleInput title="Relative Coordinates" v-model="currentValue.relativeCoords" />
			<SliderInput title="X" v-model="currentValue.x" :min="0" :max="currentValue.relativeCoords ? 100 : imageWidth" :step="1" :default="0" :suffix="currentValue.relativeCoords ? '%' : 'px'" />
			<SliderInput title="Y" v-model="currentValue.y" :min="0" :max="currentValue.relativeCoords ? 100 : imageHeight" :step="1" :default="0" :suffix="currentValue.relativeCoords ? '%' : 'px'" />
			<div class="grid grid-cols-2 gap-3">
				<SelectInput title="Horizontal Anchor" v-model="currentValue.hAnchor" default="right" :allow-null="false" :options="HGravityOptions" />
				<SelectInput title="Vertical Anchor" v-model="currentValue.vAnchor" default="bottom" :allow-null="false" :options="VGravityOptions" />
			</div>
		</EditorSubPanel>
		<EditorSubPanel title="Size" :collapse-key="`overlay-${currentValue.id}-size`" :initially-expanded="false">
			<ToggleInput title="Relative Size" v-model="currentValue.relativeSize" />
			<SliderInput title="Width" v-model="currentValue.width" :min="0" :max="currentValue.relativeSize ? 100 : imageWidth" :step="1" :default="0" default-label="Auto" :suffix="currentValue.relativeSize ? '%' : 'px'" />
			<SliderInput title="Height" v-model="currentValue.height" :min="0" :max="currentValue.relativeSize ? 100 : imageHeight" :step="1" :default="0" default-label="Auto" :suffix="currentValue.relativeSize ? '%' : 'px'" />
			<SliderInput title="Minimum Width" v-model="currentValue.minWidth" :min="0" :max="!currentValue.relativeSize ? 100 : imageWidth" :step="1" :default="0" default-label="None" :suffix="!currentValue.relativeSize ? '%' : 'px'" />
			<SliderInput title="Minimum Height" v-model="currentValue.minHeight" :min="0" :max="!currentValue.relativeSize ? 100 : imageHeight" :step="1" :default="0" default-label="None" :suffix="!currentValue.relativeSize ? '%' : 'px'" />
			<SliderInput title="Maximum Width" v-model="currentValue.maxWidth" :min="0" :max="!currentValue.relativeSize ? 100 : imageWidth" :step="1" :default="0" default-label="None" :suffix="!currentValue.relativeSize ? '%' : 'px'" />
			<SliderInput title="Maximum Height" v-model="currentValue.maxHeight" :min="0" :max="!currentValue.relativeSize ? 100 : imageHeight" :step="1" :default="0" default-label="None" :suffix="!currentValue.relativeSize ? '%' : 'px'" />
		</EditorSubPanel>
		<EditorSubPanel title="Background" :collapse-key="`overlay-${currentValue.id}-background`" :initially-expanded="false" v-model="currentValue.background.enabled" :show-toggle="true" :disabled="!currentValue.background.enabled">
			<ObjectSelectInput title="Background Color Type" v-model="currentValue.background.backgroundColorType" default="color" :allow-null="false" :options="OverlayBackgroundColorTypeOptions" />
			<SliderInput v-if="currentValue.background.backgroundColorType !== 'color'" title="Dominant Color Opacity" v-model="currentValue.background.dominantColorOpacity" :min="0" :max="100" :step="1" :default="100" suffix="%" />
			<ColorInput title="Background Color" v-model="currentValue.background.backgroundColor" default="#000000" />
			<SliderInput title="Horizontal Padding" v-model="currentValue.background.hPadding" :min="0" :max="imageWidth" :step="1" :default="0" default-label="None" suffix="px" />
			<SliderInput title="Vertical Padding" v-model="currentValue.background.vPadding" :min="0" :max="imageHeight" :step="1" :default="0"  default-label="None" suffix="px" />
			<SliderInput title="Corner Radius" v-model="currentValue.background.cornerRadius" :min="0" :max="imageHeight" :step="1" :default="0"  default-label="None" suffix="px" />
			<SliderInput title="Blur" v-model="currentValue.background.blur" :min="0" :max="100" :step="1" :default="0" suffix="px" />
			<SliderInput title="Brightness" v-model="currentValue.background.brightness" :min="0" :max="200" :step="1" :default="100" suffix="%" />
			<SliderInput title="Saturation" v-model="currentValue.background.saturation" :min="0" :max="200" :step="1" :default="100" suffix="%" />
			<SliderInput title="Contrast" v-model="currentValue.background.contrast" :min="0" :max="3" :step="0.01" :default="1" />
			<div class="grid grid-cols-2 gap-3">
				<SelectInput title="Horizontal Align" v-model="currentValue.background.hAlign" default="right" :allow-null="false" :options="HGravityOptions" />
				<SelectInput title="Vertical Align" v-model="currentValue.background.vAlign" default="bottom" :allow-null="false" :options="VGravityOptions" />
			</div>
			<EditorSubPanel title="Background Size" :collapse-key="`overlay-${currentValue.id}-bg-size`" :initially-expanded="false">
				<ToggleInput title="Relative Size" v-model="currentValue.background.relativeSize" />
				<SliderInput title="Width" v-model="currentValue.background.width" :min="0" :max="currentValue.background.relativeSize ? 100 : imageWidth" :step="1" :default="0" default-label="Auto" :suffix="currentValue.background.relativeSize ? '%' : 'px'" />
				<SliderInput title="Height" v-model="currentValue.background.height" :min="0" :max="currentValue.background.relativeSize ? 100 : imageHeight" :step="1" :default="0" default-label="Auto" :suffix="currentValue.background.relativeSize ? '%' : 'px'" />
				<SliderInput title="Minimum Width" v-model="currentValue.background.minWidth" :min="0" :max="!currentValue.background.relativeSize ? 100 : imageWidth" :step="1" :default="0" default-label="None" :suffix="!currentValue.background.relativeSize ? '%' : 'px'" />
				<SliderInput title="Minimum Height" v-model="currentValue.background.minHeight" :min="0" :max="!currentValue.background.relativeSize ? 100 : imageHeight" :step="1" :default="0" default-label="None" :suffix="!currentValue.background.relativeSize ? '%' : 'px'" />
				<SliderInput title="Maximum Width" v-model="currentValue.background.maxWidth" :min="0" :max="!currentValue.background.relativeSize ? 100 : imageWidth" :step="1" :default="0" default-label="None" :suffix="!currentValue.background.relativeSize ? '%' : 'px'" />
				<SliderInput title="Maximum Height" v-model="currentValue.background.maxHeight" :min="0" :max="!currentValue.background.relativeSize ? 100 : imageHeight" :step="1" :default="0" default-label="None" :suffix="!currentValue.background.relativeSize ? '%' : 'px'" />
			</EditorSubPanel>
		</EditorSubPanel>
		<EditorSubPanel title="Drop Shadow" :collapse-key="`overlay-${currentValue.id}-shadow`" :initially-expanded="false" v-model="currentValue.dropShadow.enabled" :show-toggle="true" :disabled="!currentValue.dropShadow.enabled">
			<SliderInput title="Opacity" v-model="currentValue.dropShadow.opacity" :min="0" :max="100" :step="1" :default="100" suffix="%" />
			<SliderInput title="Blur" v-model="currentValue.dropShadow.blur" :min="0" :max="100" :step="1" :default="3" suffix="px" />
			<ColorInput title="Color" v-model="currentValue.dropShadow.color" default="#000000" />
			<div class="grid grid-cols-2 gap-3">
				<SliderInput title="Offset X" v-model="currentValue.dropShadow.offsetX" :min="0" :max="100" :step="1" :default="1" suffix="px" />
				<SliderInput title="Offset Y" v-model="currentValue.dropShadow.offsetX" :min="0" :max="100" :step="1" :default="1" suffix="px" />
			</div>
		</EditorSubPanel>
	</EditorPanel>
</template>

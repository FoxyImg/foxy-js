<script setup lang="ts">
import {computed} from "vue";
import EditorPanel from "@/components/values/EditorPanel.vue";
import {HGravityOptions, VGravityOptions} from "@/types/options";
import {
	FitOptions,
	OverlayBackgroundColorTypeOptions,
	type OverlayParams,
	OverlayTypeOptions
} from "@/composables/params/overlay";
import {RotationOptions} from "@/composables/params/rotation";
import {storeToRefs} from "pinia";
import {useImageParamsStore} from "@/stores/image-params-store";
import ObjectSelectValue from "@/components/values/ObjectSelectValue.vue";
import OverlayImageValue from "@/components/values/OverlayImageValue.vue";
import SubstitutionsValue from "@/components/values/SubstitutionsValue.vue";
import ToggleValue from "@/components/values/ToggleValue.vue";
import SliderValue from "@/components/values/SliderValue.vue";
import SelectValue from "@/components/values/SelectValue.vue";
import ColorValue from "@/components/values/ColorValue.vue";
import Icon from "@/components/UI/Icon.vue";

const {
	imageMeta,
} = storeToRefs(useImageParamsStore());

const props = defineProps<{
	modelValue: OverlayParams
}>();

const emit = defineEmits<{
	(e: 'update:modelValue', value: OverlayParams): void
	(e: 'remove'): void
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
	if (imageMeta.value === null) {
		return 1920;
	}

	return imageMeta.value.width;
});

const imageHeight = computed(() => {
	if (imageMeta.value === null) {
		return 1920;
	}

	return imageMeta.value.height;
});
</script>
<template>
	<EditorPanel :title="overlayTitle(currentValue)" v-model="currentValue.enabled"  :show-toggle="true"   :disabled="!currentValue.enabled" :collapse-key="`overlay-${currentValue.id}`">
		<template #extras-right>
			<Icon name="delete-source" class="w-auto h-3.5 fill-red-600 cursor-pointer" @click="emit('remove')" />
		</template>
		<ObjectSelectValue title="Overlay Type" v-model="currentValue.type" default="image" :allow-null="false" :options="OverlayTypeOptions" />
		<OverlayImageValue v-if="currentValue.type === 'image'" title="Overlay Image Key" default="" v-model="currentValue.url" />
		<ObjectSelectValue v-if="currentValue.type === 'image'" title="Image Scaling" v-model="currentValue.fit" default="fit" :allow-null="false" :options="FitOptions" />
		<SubstitutionsValue title="Text Substitutions" :default="[]" v-model="currentValue.substitutions" />
		<ToggleValue v-if="currentValue.type === 'image'" title="Trim Overlay Image" v-model="currentValue.trim" />
		<SliderValue title="Opacity" v-model="currentValue.opacity" :min="0" :max="100" :step="1" :default="100" suffix="%" />
		<ObjectSelectValue v-if="currentValue.type === 'image' || currentValue.type === 'text'" title="Rotation" v-model="currentValue.rotate" :default="0" :allow-null="false" :options="RotationOptions" />
		<SliderValue title="Horizontal Padding" v-model="currentValue.hPadding" :min="0" :max="imageWidth" :step="1" :default="0" default-label="None" suffix="px" />
		<SliderValue title="Vertical Padding" v-model="currentValue.vPadding" :min="0" :max="imageHeight" :step="1" :default="0"  default-label="None" suffix="px" />
		<EditorPanel title="Position" :collapse-key="`overlay-${currentValue.id}-position`" :initially-expanded="false">
			<ToggleValue title="Relative Coordinates" v-model="currentValue.relativeCoords" />
			<SliderValue title="X" v-model="currentValue.x" :min="0" :max="currentValue.relativeCoords ? 100 : imageWidth" :step="1" :default="0" :suffix="currentValue.relativeCoords ? '%' : 'px'" />
			<SliderValue title="Y" v-model="currentValue.y" :min="0" :max="currentValue.relativeCoords ? 100 : imageHeight" :step="1" :default="0" :suffix="currentValue.relativeCoords ? '%' : 'px'" />
			<div class="grid grid-cols-2 gap-3">
				<SelectValue title="Horizontal Anchor" v-model="currentValue.hAnchor" default="right" :allow-null="false" :options="HGravityOptions" />
				<SelectValue title="Vertical Anchor" v-model="currentValue.vAnchor" default="bottom" :allow-null="false" :options="VGravityOptions" />
			</div>
		</EditorPanel>
		<EditorPanel title="Size" :collapse-key="`overlay-${currentValue.id}-size`" :initially-expanded="false">
			<ToggleValue title="Relative Size" v-model="currentValue.relativeSize" />
			<SliderValue title="Width" v-model="currentValue.width" :min="0" :max="currentValue.relativeCoords ? 100 : imageWidth" :step="1" :default="0" default-label="Auto" :suffix="currentValue.relativeCoords ? '%' : 'px'" />
			<SliderValue title="Height" v-model="currentValue.height" :min="0" :max="currentValue.relativeCoords ? 100 : imageHeight" :step="1" :default="0" default-label="Auto" :suffix="currentValue.relativeCoords ? '%' : 'px'" />
			<SliderValue title="Minimum Width" v-model="currentValue.minWidth" :min="0" :max="!currentValue.relativeCoords ? 100 : imageWidth" :step="1" :default="0" default-label="None" :suffix="!currentValue.relativeCoords ? '%' : 'px'" />
			<SliderValue title="Minimum Height" v-model="currentValue.minHeight" :min="0" :max="!currentValue.relativeCoords ? 100 : imageHeight" :step="1" :default="0" default-label="None" :suffix="!currentValue.relativeCoords ? '%' : 'px'" />
			<SliderValue title="Maximum Width" v-model="currentValue.maxWidth" :min="0" :max="!currentValue.relativeCoords ? 100 : imageWidth" :step="1" :default="0" default-label="None" :suffix="!currentValue.relativeCoords ? '%' : 'px'" />
			<SliderValue title="Maximum Height" v-model="currentValue.maxHeight" :min="0" :max="!currentValue.relativeCoords ? 100 : imageHeight" :step="1" :default="0" default-label="None" :suffix="!currentValue.relativeCoords ? '%' : 'px'" />
		</EditorPanel>
		<EditorPanel title="Background" :collapse-key="`overlay-${currentValue.id}-background`" :initially-expanded="false" v-model="currentValue.background.enabled" :show-toggle="true" :disabled="!currentValue.background.enabled">
			<ObjectSelectValue title="Background Color Type" v-model="currentValue.background.backgroundColorType" default="color" :allow-null="false" :options="OverlayBackgroundColorTypeOptions" />
			<SliderValue v-if="currentValue.background.backgroundColorType !== 'color'" title="Dominant Color Opacity" v-model="currentValue.background.dominantColorOpacity" :min="0" :max="100" :step="1" :default="100" suffix="%" />
			<ColorValue title="Background Color" v-model="currentValue.background.backgroundColor" default="#000000" />
			<SliderValue title="Horizontal Padding" v-model="currentValue.background.hPadding" :min="0" :max="imageWidth" :step="1" :default="0" default-label="None" suffix="px" />
			<SliderValue title="Vertical Padding" v-model="currentValue.background.vPadding" :min="0" :max="imageHeight" :step="1" :default="0"  default-label="None" suffix="px" />
			<SliderValue title="Corner Radius" v-model="currentValue.background.cornerRadius" :min="0" :max="imageHeight" :step="1" :default="0"  default-label="None" suffix="px" />
			<SliderValue title="Blur" v-model="currentValue.background.blur" :min="0" :max="100" :step="1" :default="0" suffix="px" />
			<SliderValue title="Brightness" v-model="currentValue.background.brightness" :min="0" :max="200" :step="1" :default="100" suffix="%" />
			<SliderValue title="Saturation" v-model="currentValue.background.saturation" :min="0" :max="200" :step="1" :default="100" suffix="%" />
			<SliderValue title="Contrast" v-model="currentValue.background.contrast" :min="0" :max="3" :step="0.01" :default="1" />
			<div class="grid grid-cols-2 gap-3">
				<SelectValue title="Horizontal Align" v-model="currentValue.background.hAlign" default="right" :allow-null="false" :options="HGravityOptions" />
				<SelectValue title="Vertical Align" v-model="currentValue.background.vAlign" default="bottom" :allow-null="false" :options="VGravityOptions" />
			</div>
			<EditorPanel title="Size" :collapse-key="`overlay-${currentValue.id}-bg-size`" :initially-expanded="false">
				<ToggleValue title="Relative Size" v-model="currentValue.background.relativeSize" />
				<SliderValue title="Width" v-model="currentValue.background.width" :min="0" :max="currentValue.background.relativeSize ? 100 : imageWidth" :step="1" :default="0" default-label="Auto" :suffix="currentValue.background.relativeSize ? '%' : 'px'" />
				<SliderValue title="Height" v-model="currentValue.background.height" :min="0" :max="currentValue.background.relativeSize ? 100 : imageHeight" :step="1" :default="0" default-label="Auto" :suffix="currentValue.background.relativeSize ? '%' : 'px'" />
				<SliderValue title="Minimum Width" v-model="currentValue.background.minWidth" :min="0" :max="!currentValue.background.relativeSize ? 100 : imageWidth" :step="1" :default="0" default-label="None" :suffix="!currentValue.background.relativeSize ? '%' : 'px'" />
				<SliderValue title="Minimum Height" v-model="currentValue.background.minHeight" :min="0" :max="!currentValue.background.relativeSize ? 100 : imageHeight" :step="1" :default="0" default-label="None" :suffix="!currentValue.background.relativeSize ? '%' : 'px'" />
				<SliderValue title="Maximum Width" v-model="currentValue.background.maxWidth" :min="0" :max="!currentValue.background.relativeSize ? 100 : imageWidth" :step="1" :default="0" default-label="None" :suffix="!currentValue.background.relativeSize ? '%' : 'px'" />
				<SliderValue title="Maximum Height" v-model="currentValue.background.maxHeight" :min="0" :max="!currentValue.background.relativeSize ? 100 : imageHeight" :step="1" :default="0" default-label="None" :suffix="!currentValue.background.relativeSize ? '%' : 'px'" />
			</EditorPanel>
		</EditorPanel>
		<EditorPanel title="Drop Shadow" :collapse-key="`overlay-${currentValue.id}-shadow`" :initially-expanded="false" v-model="currentValue.dropShadow.enabled" :show-toggle="true" :disabled="!currentValue.dropShadow.enabled">
			<SliderValue title="Opacity" v-model="currentValue.dropShadow.opacity" :min="0" :max="100" :step="1" :default="100" suffix="%" />
			<SliderValue title="Blur" v-model="currentValue.dropShadow.blur" :min="0" :max="100" :step="1" :default="3" suffix="px" />
			<ColorValue title="Color" v-model="currentValue.dropShadow.color" default="#000000" />
			<div class="grid grid-cols-2 gap-3">
				<SliderValue title="Offset X" v-model="currentValue.dropShadow.offsetX" :min="0" :max="100" :step="1" :default="1" suffix="px" />
				<SliderValue title="Offset Y" v-model="currentValue.dropShadow.offsetX" :min="0" :max="100" :step="1" :default="1" suffix="px" />
			</div>
		</EditorPanel>
	</EditorPanel>
</template>
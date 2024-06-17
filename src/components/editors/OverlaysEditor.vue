<script setup lang="ts">
import {storeToRefs} from "pinia";
import {useImageParamsStore} from "@/stores/image-params-store";
import {computed, onMounted, ref, watch} from "vue";
import {
	DefaultOverlayParams,
	FitOptions, OverlayBackgroundColorTypeOptions,
	type OverlayParams,
	OverlayTypeOptions,
	RotationOptions,
} from "@/types/params";
import EditorPanel from "@/components/params/EditorPanel.vue";
import ObjectSelectParam from "@/components/params/ObjectSelectParam.vue";
import OverlayImageParam from "@/components/params/OverlayImageParam.vue";
import ToggleParam from "@/components/params/ToggleParam.vue";
import {HGravityOptions, VGravityOptions} from "@/types/options";
import SelectParam from "@/components/params/SelectParam.vue";
import SliderParam from "@/components/params/SliderParam.vue";
import { animations } from "@formkit/drag-and-drop";
import {useDragAndDrop} from "@formkit/drag-and-drop/vue";
import shortUUID from "short-uuid";
import Icon from "@/components/UI/Icon.vue";
import ColorParam from "@/components/params/ColorParam.vue";
import Toggle from "@/components/UI/Toggle.vue";
import SubstitutionsParam from "@/components/params/SubstitutionsParam.vue";

const {
	imageParams,
	imageMeta,
} = storeToRefs(useImageParamsStore());

const [parent, overlays] = useDragAndDrop(imageParams.value.overlays ?? [], {
	dragHandle: ".drag-handle",
	plugins: [
		animations()
	]
});

watch(overlays, () => {
	imageParams.value.overlays = overlays.value;
});

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

const overlayType = ref<"image"|"text"|"rect"|"ellipse">("image");

function addOverlay() {
	const newOverlay = JSON.parse(JSON.stringify(DefaultOverlayParams));
	newOverlay.id = shortUUID.generate();
	newOverlay.type = overlayType.value;
	overlays.value.push(newOverlay);
}

function overlayTitle(overlay:OverlayParams) {
	const type = overlay.type === 'image' ? 'Image Overlay' : 'Text Overlay';
	if (overlay.type === 'image') {
		return `${type} - ${overlay.url}`;
	} else {
		return `${type} - ${overlay.text}`;
	}
}

function removeOverlay(id:string) {
	if (confirm("Remove this overlay?")) {
		overlays.value = overlays.value.filter((overlay) => overlay.id !== id);
	}
}
</script>
<template>
	<div class="p-3 flex flex-col gap-3">
		<div class="p-3 rounded-lg shadow bg-white flex flex-col gap-3 border border-neutral-200 text-xs">
			<div class="flex items-center gap-1">
				<div>Add Overlay</div>
				<select v-model="overlayType" class="border border-neutral-200 text-xs flex-1 rounded-md py-1.5 px-1">
					<option value="image">Image</option>
					<option value="text">Text</option>
					<option value="rect">Rect</option>
					<option value="ellipse">Ellipse</option>
				</select>
				<button type="button" class="ml-2 button small" @click="addOverlay">Add</button>
			</div>
			<div class="flex items-center gap-2">
				<Toggle v-model="imageParams.encodeOverlays" size="sm" />
				<div>Encode Overlays</div>
			</div>
		</div>
		<div class="flex flex-col gap-3" ref="parent">
			<EditorPanel v-for="(overlay, index) in overlays" :draggable="true" :title="overlayTitle(overlay)" v-model="overlay.enabled"  :show-toggle="true" :key="`overlay-${overlay.id}`"  :disabled="!overlay.enabled" :collapse-key="`overlay-${overlay.id}`">
				<template #extras-right>
					<Icon name="delete-source" class="w-auto h-3.5 fill-red-600 cursor-pointer" @click="removeOverlay(overlay.id)" />
				</template>
				<ObjectSelectParam title="Overlay Type" v-model="overlay.type" default="image" :allow-null="false" :options="OverlayTypeOptions" />
				<OverlayImageParam v-if="overlay.type === 'image'" title="Overlay Image Key" default="" v-model="overlay.url" />
				<ObjectSelectParam v-if="overlay.type === 'image'" title="Image Scaling" v-model="overlay.fit" default="fit" :allow-null="false" :options="FitOptions" />
				<SubstitutionsParam title="Text Substitutions" :default="[]" v-model="overlay.substitutions" />
				<ToggleParam v-if="overlay.type === 'image'" title="Trim Overlay Image" v-model="overlay.trim" />
				<SliderParam title="Opacity" v-model="overlay.opacity" :min="0" :max="100" :step="1" :default="100" suffix="%" />
				<ObjectSelectParam v-if="overlay.type === 'image' || overlay.type === 'text'" title="Rotation" v-model="overlay.rotate" :default="0" :allow-null="false" :options="RotationOptions" />
				<SliderParam title="Horizontal Padding" v-model="overlay.hPadding" :min="0" :max="imageWidth" :step="1" :default="0" default-label="None" suffix="px" />
				<SliderParam title="Vertical Padding" v-model="overlay.vPadding" :min="0" :max="imageHeight" :step="1" :default="0"  default-label="None" suffix="px" />
				<EditorPanel title="Position" :collapse-key="`overlay-${overlay.id}-position`" :initially-expanded="false">
					<ToggleParam title="Relative Coordinates" v-model="overlay.relativeCoords" />
					<SliderParam title="X" v-model="overlay.x" :min="0" :max="overlay.relativeCoords ? 100 : imageWidth" :step="1" :default="0" :suffix="overlay.relativeCoords ? '%' : 'px'" />
					<SliderParam title="Y" v-model="overlay.y" :min="0" :max="overlay.relativeCoords ? 100 : imageHeight" :step="1" :default="0" :suffix="overlay.relativeCoords ? '%' : 'px'" />
					<div class="grid grid-cols-2 gap-3">
						<SelectParam title="Horizontal Anchor" v-model="overlay.hAnchor" default="right" :allow-null="false" :options="HGravityOptions" />
						<SelectParam title="Vertical Anchor" v-model="overlay.vAnchor" default="bottom" :allow-null="false" :options="VGravityOptions" />
					</div>
				</EditorPanel>
				<EditorPanel title="Size" :collapse-key="`overlay-${overlay.id}-size`" :initially-expanded="false">
					<ToggleParam title="Relative Size" v-model="overlay.relativeSize" />
					<SliderParam title="Width" v-model="overlay.width" :min="0" :max="overlay.relativeCoords ? 100 : imageWidth" :step="1" :default="0" default-label="Auto" :suffix="overlay.relativeCoords ? '%' : 'px'" />
					<SliderParam title="Height" v-model="overlay.height" :min="0" :max="overlay.relativeCoords ? 100 : imageHeight" :step="1" :default="0" default-label="Auto" :suffix="overlay.relativeCoords ? '%' : 'px'" />
					<SliderParam title="Minimum Width" v-model="overlay.minWidth" :min="0" :max="!overlay.relativeCoords ? 100 : imageWidth" :step="1" :default="0" default-label="None" :suffix="!overlay.relativeCoords ? '%' : 'px'" />
					<SliderParam title="Minimum Height" v-model="overlay.minHeight" :min="0" :max="!overlay.relativeCoords ? 100 : imageHeight" :step="1" :default="0" default-label="None" :suffix="!overlay.relativeCoords ? '%' : 'px'" />
					<SliderParam title="Maximum Width" v-model="overlay.maxWidth" :min="0" :max="!overlay.relativeCoords ? 100 : imageWidth" :step="1" :default="0" default-label="None" :suffix="!overlay.relativeCoords ? '%' : 'px'" />
					<SliderParam title="Maximum Height" v-model="overlay.maxHeight" :min="0" :max="!overlay.relativeCoords ? 100 : imageHeight" :step="1" :default="0" default-label="None" :suffix="!overlay.relativeCoords ? '%' : 'px'" />
				</EditorPanel>
				<EditorPanel title="Background" :collapse-key="`overlay-${overlay.id}-background`" :initially-expanded="false" v-model="overlay.background.enabled" :show-toggle="true" :disabled="!overlay.background.enabled">
					<ObjectSelectParam title="Background Color Type" v-model="overlay.background.backgroundColorType" default="color" :allow-null="false" :options="OverlayBackgroundColorTypeOptions" />
					<SliderParam v-if="overlay.background.backgroundColorType !== 'color'" title="Dominant Color Opacity" v-model="overlay.background.dominantColorOpacity" :min="0" :max="100" :step="1" :default="100" suffix="%" />
					<ColorParam title="Background Color" v-model="overlay.background.backgroundColor" default="#000000" />
					<SliderParam title="Horizontal Padding" v-model="overlay.background.hPadding" :min="0" :max="imageWidth" :step="1" :default="0" default-label="None" suffix="px" />
					<SliderParam title="Vertical Padding" v-model="overlay.background.vPadding" :min="0" :max="imageHeight" :step="1" :default="0"  default-label="None" suffix="px" />
					<SliderParam title="Corner Radius" v-model="overlay.background.cornerRadius" :min="0" :max="imageHeight" :step="1" :default="0"  default-label="None" suffix="px" />
					<SliderParam title="Blur" v-model="overlay.background.blur" :min="0" :max="100" :step="1" :default="0" suffix="px" />
					<SliderParam title="Brightness" v-model="overlay.background.brightness" :min="0" :max="200" :step="1" :default="100" suffix="%" />
					<SliderParam title="Saturation" v-model="overlay.background.saturation" :min="0" :max="200" :step="1" :default="100" suffix="%" />
					<SliderParam title="Contrast" v-model="overlay.background.contrast" :min="0" :max="3" :step="0.01" :default="1" />
					<div class="grid grid-cols-2 gap-3">
						<SelectParam title="Horizontal Align" v-model="overlay.background.hAlign" default="right" :allow-null="false" :options="HGravityOptions" />
						<SelectParam title="Vertical Align" v-model="overlay.background.vAlign" default="bottom" :allow-null="false" :options="VGravityOptions" />
					</div>
					<EditorPanel title="Size" :collapse-key="`overlay-${overlay.id}-bg-size`" :initially-expanded="false">
						<ToggleParam title="Relative Size" v-model="overlay.background.relativeSize" />
						<SliderParam title="Width" v-model="overlay.background.width" :min="0" :max="overlay.background.relativeSize ? 100 : imageWidth" :step="1" :default="0" default-label="Auto" :suffix="overlay.background.relativeSize ? '%' : 'px'" />
						<SliderParam title="Height" v-model="overlay.background.height" :min="0" :max="overlay.background.relativeSize ? 100 : imageHeight" :step="1" :default="0" default-label="Auto" :suffix="overlay.background.relativeSize ? '%' : 'px'" />
						<SliderParam title="Minimum Width" v-model="overlay.background.minWidth" :min="0" :max="!overlay.background.relativeSize ? 100 : imageWidth" :step="1" :default="0" default-label="None" :suffix="!overlay.background.relativeSize ? '%' : 'px'" />
						<SliderParam title="Minimum Height" v-model="overlay.background.minHeight" :min="0" :max="!overlay.background.relativeSize ? 100 : imageHeight" :step="1" :default="0" default-label="None" :suffix="!overlay.background.relativeSize ? '%' : 'px'" />
						<SliderParam title="Maximum Width" v-model="overlay.background.maxWidth" :min="0" :max="!overlay.background.relativeSize ? 100 : imageWidth" :step="1" :default="0" default-label="None" :suffix="!overlay.background.relativeSize ? '%' : 'px'" />
						<SliderParam title="Maximum Height" v-model="overlay.background.maxHeight" :min="0" :max="!overlay.background.relativeSize ? 100 : imageHeight" :step="1" :default="0" default-label="None" :suffix="!overlay.background.relativeSize ? '%' : 'px'" />
					</EditorPanel>
				</EditorPanel>
				<EditorPanel title="Drop Shadow" :collapse-key="`overlay-${overlay.id}-shadow`" :initially-expanded="false" v-model="overlay.dropShadow.enabled" :show-toggle="true" :disabled="!overlay.dropShadow.enabled">
					<SliderParam title="Opacity" v-model="overlay.dropShadow.opacity" :min="0" :max="100" :step="1" :default="100" suffix="%" />
					<SliderParam title="Blur" v-model="overlay.dropShadow.blur" :min="0" :max="100" :step="1" :default="3" suffix="px" />
					<ColorParam title="Color" v-model="overlay.dropShadow.color" default="#000000" />
					<div class="grid grid-cols-2 gap-3">
						<SliderParam title="Offset X" v-model="overlay.dropShadow.offsetX" :min="0" :max="100" :step="1" :default="1" suffix="px" />
						<SliderParam title="Offset Y" v-model="overlay.dropShadow.offsetX" :min="0" :max="100" :step="1" :default="1" suffix="px" />
					</div>
				</EditorPanel>
			</EditorPanel>
			</div>
	</div>
</template>
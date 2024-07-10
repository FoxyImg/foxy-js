<script setup lang="ts">
import {computed, watch} from "vue";
import EditorPanel from "../inputs/EditorPanel.vue";
import EditorSubPanel from "../inputs/EditorSubPanel.vue";
import {
	type ImageMeta,
	type SizingParams,
	CropOptions,
	HGravityOptions,
	InterestingOptions,
	VGravityOptions, type ImageParams
} from "@foxyimg/url-builder";
import TagsInput from "../inputs/TagsInput.vue";
import SelectInput from "../inputs/SelectInput.vue";
import SliderInput from "../inputs/SliderInput.vue";
import FocalPointInput from "../inputs/FocalPointInput.vue";
import ObjectSelectInput from "../inputs/ObjectSelectInput.vue";
import ToggleInput from "../inputs/ToggleInput.vue";
import {useStorage} from "@vueuse/core";
import ConstrainLineIcon from "../icons/ConstrainLineIcon.vue";
import ConstrainIcon from "../icons/ConstrainIcon.vue";

const props = defineProps<{
	modelValue: SizingParams,
	imageKey: string|null,
	imageMeta: ImageMeta|null,
	faceCount: number,
	peopleCount: number,
	imageParams: ImageParams,
}>();

const emit = defineEmits<{
	(e: 'update:modelValue', value: SizingParams): void
}>();

const currentValue = computed({
	get: () => props.modelValue,
	set: (value) => emit('update:modelValue', value),
});

const constrainDimensions = useStorage('foxy_constrain_dimensions', false);

const personOptions = computed(() => {
	const options = [
		{ label: 'Smallest Person', value: -3 },
		{ label: 'Largest Person', value: -2 },
		{ label: 'All People', value: -1 },
	];

	if (props.imageMeta && props.imageMeta.people && props.imageMeta.people.length > 0) {
		options.push(...props.imageMeta.people.map((person:any, index:number) => ({
			label: `Person ${index + 1} - ${person.name}`,
			value: index,
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

	if (props.imageMeta && props.imageMeta.faces && props.imageMeta.faces.length > 0) {
		options.push(...props.imageMeta.faces.map((face:any, index:number) => ({
			label: `Face #${index + 1}`,
			value: index,
		})));
	}

	return options;
});

watch(() => [currentValue.value.width, currentValue.value.height], (newVal, oldVal) => {
	if (!constrainDimensions.value) {
		return;
	}

	if (oldVal[0] !== newVal[0]) {
		if (currentValue.value.height !== newVal[0]) {
			currentValue.value.height = newVal[0];
		}
	} else if (oldVal[1] !== newVal[1]) {
		if (currentValue.value.width !== newVal[1]) {
			currentValue.value.width = newVal[1];
		}
	}
});
</script>
<template>
	<EditorPanel title="Cropping / Resizing" collapse-key="crop-editor" v-model="currentValue.enabled" :show-toggle="true" :disabled="!currentValue.enabled">
		<TagsInput title="Crop Mode" :options="CropOptions" v-model="currentValue.crop" placeholder="Select 1 or more crop modes" />
		<SelectInput v-if="currentValue.crop.includes('smart')" title="Smart Crop Mode" v-model="currentValue.smartMode" :default="null" :options="InterestingOptions" />
		<div class="flex items-center gap-1">
			<div class="flex-1 flex flex-col gap-3">
				<SliderInput title="Width" v-model="currentValue.width" :min="0" :max="3840" :step="1" :default="0" default-label="None" suffix="px" />
				<SliderInput title="Height" v-model="currentValue.height" :min="0" :max="3840" :step="1" :default="0" default-label="None" suffix="px" />
			</div>
			<div class="flex flex-col items-center justify-center gap-1">
				<ConstrainLineIcon class="w-3 h-auto stroke-neutral-500" />
				<div class="cursor-pointer border border-neutral-300 rounded-lg p-1" :class="{'bg-neutral-300': constrainDimensions}" @click="constrainDimensions = !constrainDimensions">
					<ConstrainIcon class="fill-black w-3 h-auto" />
				</div>
				<ConstrainLineIcon class="w-3 h-auto stroke-neutral-500 rotate-180 -scale-x-100" />
			</div>
		</div>
		<SliderInput v-if="currentValue.crop.length > 0" title="Aspect Ratio Width" v-model="currentValue.aspectRatioWidth" :min="0" :max="128" :step="1" :default="0" default-label="None" />
		<SliderInput v-if="currentValue.crop.length > 0" title="Aspect Ratio Height" v-model="currentValue.aspectRatioHeight" :min="0" :max="128" :step="1" :default="0" default-label="None" />
		<SliderInput v-if="currentValue.crop.length > 0" title="Zoom" v-model="currentValue.zoom" :min="1" :max="10" :step="0.01" :default="1" default-label="None" suffix="x" />
		<div v-if="currentValue.crop.includes('crop')" class="grid grid-cols-2 gap-3">
			<SelectInput title="Horizontal Gravity" v-model="currentValue.hGravity" default="center" :allow-null="false" :options="HGravityOptions" />
			<SelectInput title="Vertical Gravity" v-model="currentValue.vGravity" default="center" :allow-null="false" :options="VGravityOptions" />
		</div>
		<EditorSubPanel v-if="currentValue.crop.includes('focus') && imageKey" collapse-key="focal-point-editor" title="Focal Point"  :disabled="!currentValue.enabled">
			<FocalPointInput v-model="currentValue.focalPoint" :image-key="imageKey" :image-meta="imageMeta" :image-params="imageParams" />
			<SliderInput title="Focal Point Zoom" v-model="currentValue.focalPoint.zoom" :min="0" :max="200" :step="1" :default="0" suffix="%" />
		</EditorSubPanel>
		<EditorSubPanel v-if="currentValue.crop.includes('face') && faceCount > 0" title="Face Crop Options" collapse-key="face-crop-options"  :disabled="!currentValue.enabled">
			<ObjectSelectInput title="Face Index" v-model="currentValue.face.index" :default="-1" :allow-null="false" :options="faceOptions" />
			<SliderInput title="Face Padding" v-model="currentValue.face.padding" :min="0" :max="256" :step="1" :default="8" suffix="px" />
			<SliderInput title="Face Zoom" v-model="currentValue.face.zoom" :min="0" :max="200" :step="1" :default="0" suffix="%" />
			<div class="grid grid-cols-2 gap-3">
				<SelectInput title="Face Horizontal Gravity" v-model="currentValue.face.hGravity" default="center" :allow-null="false" :options="HGravityOptions" />
				<SelectInput title="Face Vertical Gravity" v-model="currentValue.face.vGravity" default="top" :allow-null="false" :options="VGravityOptions" />
			</div>
			<ToggleInput title="Focus Face" v-model="currentValue.face.focus" />
		</EditorSubPanel>
		<EditorSubPanel v-if="currentValue.crop.includes('person') && peopleCount > 0" title="Person Crop Options" collapse-key="person-crop-options"  :disabled="!currentValue.enabled">
			<ObjectSelectInput title="Person Index" v-model="currentValue.person.index" :default="-1" :allow-null="false" :options="personOptions" />
			<SliderInput title="Person Padding" v-model="currentValue.person.padding" :min="0" :max="256" :step="1" :default="0" suffix="px" />
			<SliderInput title="Person Zoom" v-model="currentValue.person.zoom" :min="0" :max="200" :step="1" :default="0" suffix="%" />
			<div class="grid grid-cols-2 gap-3">
				<SelectInput title="Person Horiz. Gravity" v-model="currentValue.person.hGravity" default="center" :allow-null="false" :options="HGravityOptions" />
				<SelectInput title="Person Vertical Gravity" v-model="currentValue.person.vGravity" default="center" :allow-null="false" :options="VGravityOptions" />
			</div>
		</EditorSubPanel>
	</EditorPanel>
</template>

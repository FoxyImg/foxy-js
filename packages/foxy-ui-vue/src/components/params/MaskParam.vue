<script setup lang="ts">
import {computed} from "vue";
import EditorPanel from "../inputs/EditorPanel.vue";
import {MaskFitOptions, type MaskParams, MaskTypeOptions} from "@foxy/url-builder";
import ObjectSelectInput from "../inputs/ObjectSelectInput.vue";
import OverlayImageInput from "../inputs/OverlayImageInput.vue";
import SliderInput from "../inputs/SliderInput.vue";

const props = defineProps<{
	modelValue: MaskParams,
	overlayImages: string[],
}>();

const emit = defineEmits<{
	(e: 'update:modelValue', value: MaskParams): void
	(e: 'removeOverlayImage', value: string): void;
	(e: 'addOverlayImage', value: string): void;
}>();


const currentValue = computed({
	get: () => props.modelValue,
	set: (value) => emit('update:modelValue', value),
});
</script>
<template>
	<EditorPanel title="Mask" collapse-key="mask-editor" v-model="currentValue.enabled" :show-toggle="true" :disabled="!currentValue.enabled">
		<ObjectSelectInput title="Mask Type" v-model="currentValue.type" default="circle" :allow-null="false" :options="MaskTypeOptions" />
		<OverlayImageInput v-if="currentValue.type === 'image'" title="Mask Image Key" default="" v-model="currentValue.imageKey" :overlay-images="overlayImages" @add-overlay-image="emit('addOverlayImage', $event)" @remove-overlay-image="emit('removeOverlayImage', $event)" />
		<ObjectSelectInput v-if="currentValue.type === 'image'" title="Mask Fit" v-model="currentValue.fit" default="fit" :allow-null="false" :options="MaskFitOptions" />
		<SliderInput v-if="currentValue.type === 'rect' || currentValue.type === 'square'" title="Corner Radius" v-model="currentValue.cornerRadius" :min="0" :max="1920" :step="1" :default="0" default-label="None" suffix="px" />
	</EditorPanel>
</template>

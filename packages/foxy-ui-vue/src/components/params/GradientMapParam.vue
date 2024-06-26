<script setup lang="ts">
import {computed} from "vue";
import EditorPanel from "../inputs/EditorPanel.vue";
import {BlendModeOptions, BlendModes, DefaultGradientMapParams, type GradientMapParams} from "@foxy/url-builder";
import GradientMapInput from "../inputs/GradientMapInput.vue";
import SliderInput from "../inputs/SliderInput.vue";
import ObjectSelectInput from "../inputs/ObjectSelectInput.vue";
import ToggleInput from "../inputs/ToggleInput.vue";

const props = defineProps<{
	modelValue: GradientMapParams
}>();

const emit = defineEmits<{
	(e: 'update:modelValue', value: GradientMapParams): void
}>();


const currentValue = computed({
	get: () => props.modelValue,
	set: (value) => emit('update:modelValue', value),
});
</script>
<template>
	<EditorPanel title="Gradient Map" collapse-key="gradient-map-editor"  v-model="currentValue.enabled" :show-toggle="true" :disabled="!currentValue.enabled">
		<GradientMapInput title="Gradient Map" :default="DefaultGradientMapParams.stops" v-model="currentValue.stops" :enabled="currentValue.opacity > 0" />
		<SliderInput title="Gradient Map Opacity" v-model="currentValue.opacity" :min="0" :max="100" :step="1" :default="0" default-label="Disabled" suffix="%" />
		<ObjectSelectInput title="Gradient Map Mode" v-model="currentValue.blendMode" :default="BlendModes.BlendModeOver" :allow-null="false" :options="BlendModeOptions" />
		<SliderInput title="Blur" v-model="currentValue.blur" :min="0" :max="320" :step="1" :default="0" default-label="None" suffix="px" />
		<ToggleInput title="Map Monochrome Image" v-model="currentValue.monochrome" />
	</EditorPanel>
</template>

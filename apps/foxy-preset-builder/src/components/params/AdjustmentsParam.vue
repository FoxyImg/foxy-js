<script setup lang="ts">
import {computed} from "vue";
import EditorPanel from "@/components/values/EditorPanel.vue";
import type {AdjustmentsParams} from "@foxy/url-builder";
import SliderValue from "@/components/values/SliderValue.vue";
import ToggleValue from "@/components/values/ToggleValue.vue";

const props = defineProps<{
	modelValue: AdjustmentsParams
}>();

const emit = defineEmits<{
	(e: 'update:modelValue', value: AdjustmentsParams): void
}>();


const currentValue = computed({
	get: () => props.modelValue,
	set: (value) => emit('update:modelValue', value),
});
</script>
<template>
	<EditorPanel title="Adjustments" collapse-key="adjustments-editor"  v-model="currentValue.enabled" :show-toggle="true" :disabled="!currentValue.enabled">
		<SliderValue title="Brightness" v-model="currentValue.brightness" :min="0" :max="200" :step="1" :default="100" suffix="%" />
		<SliderValue title="Saturation" v-model="currentValue.saturation" :min="0" :max="200" :step="1" :default="100" suffix="%" />
		<SliderValue title="Vibrance" v-model="currentValue.vibrance" :min="0" :max="100" :step="1" :default="0" default-label="None" />
		<SliderValue title="Contrast" v-model="currentValue.contrast" :min="0" :max="3" :step="0.01" :default="1" />
		<SliderValue title="Exposure" v-model="currentValue.exposure" :min="-3" :max="3" :step="0.01" :default="0" />
		<SliderValue title="Gamma" v-model="currentValue.gamma" :min="0.01" :max="10" :step="0.01" :default="1" />
		<SliderValue title="Texture" v-model="currentValue.texture" :min="0" :max="50" :step="0.1" :default="0" default-label="None" />
		<SliderValue title="Texture Density" v-model="currentValue.textureDensity" :min="0" :max="100" :step="1" :default="100" suffix="%" />
		<SliderValue title="Hue" v-model="currentValue.hue" :min="-360" :max="360" :step="1" :default="0" suffix="°" />
		<ToggleValue title="Invert" v-model="currentValue.invert" />
	</EditorPanel>
</template>
<script setup lang="ts">
import {computed} from "vue";
import EditorPanel from "@/components/values/EditorPanel.vue";
import {BlendModeOptions, BlendModes, DefaultGradientMapParams, type GradientMapParams} from "@/composables/params/gradient-map";
import GradientMapValue from "@/components/values/GradientMapValue.vue";
import SliderValue from "@/components/values/SliderValue.vue";
import ObjectSelectValue from "@/components/values/ObjectSelectValue.vue";
import ToggleValue from "@/components/values/ToggleValue.vue";

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
		<GradientMapValue title="Gradient Map" :default="DefaultGradientMapParams.stops" v-model="currentValue.stops" :enabled="currentValue.opacity > 0" />
		<SliderValue title="Gradient Map Opacity" v-model="currentValue.opacity" :min="0" :max="100" :step="1" :default="0" default-label="Disabled" suffix="%" />
		<ObjectSelectValue title="Gradient Map Mode" v-model="currentValue.blendMode" :default="BlendModes.BlendModeOver" :allow-null="false" :options="BlendModeOptions" />
		<SliderValue title="Blur" v-model="currentValue.blur" :min="0" :max="320" :step="1" :default="0" default-label="None" suffix="px" />
		<ToggleValue title="Map Monochrome Image" v-model="currentValue.monochrome" />
	</EditorPanel>
</template>
<script setup lang="ts">
import {computed} from "vue";
import EditorPanel from "../inputs/EditorPanel.vue";
import {RotationModeOptions, type RotationParams} from "@foxy/url-builder";
import SliderInput from "../inputs/SliderInput.vue";
import ObjectSelectInput from "../inputs/ObjectSelectInput.vue";

const props = defineProps<{
	modelValue: RotationParams
}>();

const emit = defineEmits<{
	(e: 'update:modelValue', value: RotationParams): void
}>();


const currentValue = computed({
	get: () => props.modelValue,
	set: (value) => emit('update:modelValue', value),
});
</script>
<template>
	<EditorPanel title="Rotation" collapse-key="rotation-editor" v-model="currentValue.enabled" :show-toggle="true" :disabled="!currentValue.enabled">
		<SliderInput title="Rotation" v-model="currentValue.rotation" :min="0" :max="360" :step="1" :default="0" suffix="°" />
		<ObjectSelectInput title="Rotation Mode" v-model="currentValue.mode" :default="0" :allow-null="false" :options="RotationModeOptions" />
	</EditorPanel>
</template>

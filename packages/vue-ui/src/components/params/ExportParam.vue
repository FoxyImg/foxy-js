<script setup lang="ts">
import {computed} from "vue";
import EditorPanel from "../inputs/EditorPanel.vue";
import {ExportFormatOptions, type ExportParams} from "@foxyimg/url-builder";
import ObjectSelectInput from "../inputs/ObjectSelectInput.vue";
import SliderInput from "../inputs/SliderInput.vue";
import ToggleInput from "../inputs/ToggleInput.vue";

const props = defineProps<{
	modelValue: ExportParams
}>();

const emit = defineEmits<{
	(e: 'update:modelValue', value: ExportParams): void
}>();


const currentValue = computed({
	get: () => props.modelValue,
	set: (value) => emit('update:modelValue', value),
});
</script>
<template>
	<EditorPanel title="Format" collapse-key="format-editor">
		<ObjectSelectInput title="File Format" v-model="currentValue.format" default="webp" :allow-null="false" :options="ExportFormatOptions" />
		<SliderInput title="Quality" v-model="currentValue.quality" :min="0" :max="100" :step="1" :default="85" />
		<SliderInput v-if="currentValue.format === 'webp'" title="Reduction Effort" v-model="currentValue.reductionEffort" :min="0" :max="6" :step="1" :default="4" />
		<ToggleInput title="Lossless" v-model="currentValue.lossless" />
		<ToggleInput title="Near Lossless" v-model="currentValue.nearLossless" />
	</EditorPanel>
</template>

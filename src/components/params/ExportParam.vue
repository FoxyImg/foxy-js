<script setup lang="ts">
import {computed} from "vue";
import EditorPanel from "@/components/values/EditorPanel.vue";
import {ExportFormatOptions, type ExportParams} from "@/composables/params/export";
import ObjectSelectValue from "@/components/values/ObjectSelectValue.vue";
import SliderValue from "@/components/values/SliderValue.vue";
import ToggleValue from "@/components/values/ToggleValue.vue";

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
		<ObjectSelectValue title="File Format" v-model="currentValue.format" default="webp" :allow-null="false" :options="ExportFormatOptions" />
		<SliderValue title="Quality" v-model="currentValue.quality" :min="0" :max="100" :step="1" :default="85" />
		<SliderValue v-if="currentValue.format === 'webp'" title="Reduction Effort" v-model="currentValue.reductionEffort" :min="0" :max="6" :step="1" :default="4" />
		<ToggleValue title="Lossless" v-model="currentValue.lossless" />
		<ToggleValue title="Near Lossless" v-model="currentValue.nearLossless" />
	</EditorPanel>
</template>
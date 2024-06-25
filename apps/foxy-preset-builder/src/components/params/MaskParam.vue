<script setup lang="ts">
import {computed} from "vue";
import EditorPanel from "@/components/values/EditorPanel.vue";
import {MaskFitOptions, type MaskParams, MaskTypeOptions} from "@foxy/url-builder";
import ObjectSelectValue from "@/components/values/ObjectSelectValue.vue";
import OverlayImageValue from "@/components/values/OverlayImageValue.vue";
import SliderValue from "@/components/values/SliderValue.vue";

const props = defineProps<{
	modelValue: MaskParams
}>();

const emit = defineEmits<{
	(e: 'update:modelValue', value: MaskParams): void
}>();


const currentValue = computed({
	get: () => props.modelValue,
	set: (value) => emit('update:modelValue', value),
});
</script>
<template>
	<EditorPanel title="Mask" collapse-key="mask-editor" v-model="currentValue.enabled" :show-toggle="true" :disabled="!currentValue.enabled">
		<ObjectSelectValue title="Mask Type" v-model="currentValue.type" default="circle" :allow-null="false" :options="MaskTypeOptions" />
		<OverlayImageValue v-if="currentValue.type === 'image'" title="Mask Image Key" default="" v-model="currentValue.imageKey" />
		<ObjectSelectValue v-if="currentValue.type === 'image'" title="Mask Fit" v-model="currentValue.fit" default="fit" :allow-null="false" :options="MaskFitOptions" />
		<SliderValue v-if="currentValue.type === 'rect' || currentValue.type === 'square'" title="Corner Radius" v-model="currentValue.cornerRadius" :min="0" :max="1920" :step="1" :default="0" default-label="None" suffix="px" />
	</EditorPanel>
</template>
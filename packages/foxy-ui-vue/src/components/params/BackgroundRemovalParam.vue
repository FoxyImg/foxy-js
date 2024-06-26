<script setup lang="ts">
import {computed} from "vue";
import EditorPanel from "../inputs/EditorPanel.vue";
import {BackgroundRemovalModeOptions, type BackgroundRemovalParams} from "@foxy/url-builder";
import ObjectSelectInput from "../inputs/ObjectSelectInput.vue";
import ColorInput from "../inputs/ColorInput.vue";
import ImageKeyInput from "../inputs/ImageKeyInput.vue";

const props = defineProps<{
	modelValue: BackgroundRemovalParams,
	sampleImages: string[],
}>();

const emit = defineEmits<{
	(e: 'update:modelValue', value: BackgroundRemovalParams): void;
	(e: 'removeSampleImage', value: string): void;
	(e: 'addSampleImage', value: string): void;
}>();

const currentValue = computed({
	get: () => props.modelValue,
	set: (value) => emit('update:modelValue', value),
});
</script>
<template>
	<EditorPanel title="Background Removal" collapse-key="background-removal" v-model="currentValue.enabled" :show-toggle="true" :disabled="!currentValue.enabled">
		<ObjectSelectInput title="Mode" v-model="currentValue.mode" default="photoroom" :allow-null="false" :options="BackgroundRemovalModeOptions" />
		<ColorInput title="Background Color" v-model="currentValue.backgroundColor" :default="null" />
		<ImageKeyInput
			title="Background Image"
			:default="null"
			v-model="currentValue.imageKey"
			:sample-images="sampleImages"
			@remove-sample-image="emit('removeSampleImage', $event)"
			@add-sample-image="emit('addSampleImage', $event)"
		/>
	</EditorPanel>
</template>

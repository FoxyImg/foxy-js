<script setup lang="ts">
import type {ImageMeta, ImageParams, SourceCropParams} from "@foxyimg/url-builder";
import {DefaultSourceCropParams} from "@foxyimg/url-builder";
import {computed} from "vue";
import EditorPanel from "../inputs/EditorPanel.vue";
import SourceCropInput from "../inputs/SourceCropInput.vue";

const props = defineProps<{
	modelValue: SourceCropParams,
	imageParams: ImageParams,
	imageMeta: ImageMeta|null,
	imageKey: string|null,
}>();

const emit = defineEmits<{
	(e: 'update:modelValue', value: SourceCropParams): void
}>();


const currentValue = computed({
	get: () => props.modelValue,
	set: (value) => emit('update:modelValue', value),
});
</script>
<template>
	<EditorPanel title="Source Crop" collapse-key="source-crop-editor" v-model="currentValue.enabled" :show-toggle="true" :disabled="!currentValue.enabled">
		<SourceCropInput title="Crop" :default="DefaultSourceCropParams" v-model="currentValue" :image-meta="imageMeta" :image-key="imageKey" :image-params="imageParams" />
	</EditorPanel>
</template>

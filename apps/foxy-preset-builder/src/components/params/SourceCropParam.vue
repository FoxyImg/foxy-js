<script setup lang="ts">
import type {ImageMeta, SourceCropParams} from "@foxy/url-builder";
import {DefaultSourceCropParams} from "@foxy/url-builder";
import {computed} from "vue";
import EditorPanel from "@/components/values/EditorPanel.vue";
import SourceCropValue from "@/components/values/SourceCropValue.vue";

const props = defineProps<{
	modelValue: SourceCropParams,
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
		<SourceCropValue title="Crop" :default="DefaultSourceCropParams" v-model="currentValue" :image-meta="imageMeta" :image-key="imageKey" />
	</EditorPanel>
</template>
<script setup lang="ts">
import {computed} from "vue";
import EditorPanel from "@/components/values/EditorPanel.vue";
import {BackgroundRemovalModeOptions, type BackgroundRemovalParams} from "@/composables/params/background-removal";
import ObjectSelectValue from "@/components/values/ObjectSelectValue.vue";
import ColorValue from "@/components/values/ColorValue.vue";
import ImageKeyValue from "@/components/values/ImageKeyValue.vue";

const props = defineProps<{
	modelValue: BackgroundRemovalParams
}>();

const emit = defineEmits<{
	(e: 'update:modelValue', value: BackgroundRemovalParams): void
}>();

const currentValue = computed({
	get: () => props.modelValue,
	set: (value) => emit('update:modelValue', value),
});
</script>
<template>
	<EditorPanel title="Background Removal" collapse-key="background-removal" v-model="currentValue.enabled" :show-toggle="true" :disabled="!currentValue.enabled">
		<ObjectSelectValue title="Mode" v-model="currentValue.mode" default="photoroom" :allow-null="false" :options="BackgroundRemovalModeOptions" />
		<ColorValue title="Background Color" v-model="currentValue.backgroundColor" :default="null" />
		<ImageKeyValue title="Background Image" :default="null" v-model="currentValue.imageKey" />
	</EditorPanel>
</template>
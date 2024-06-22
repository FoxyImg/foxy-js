<script setup lang="ts">
import {computed} from "vue";
import EditorPanel from "@/components/values/EditorPanel.vue";
import {RotationModeOptions, type RotationParams} from "@/composables/params/rotation";
import SliderValue from "@/components/values/SliderValue.vue";
import ObjectSelectValue from "@/components/values/ObjectSelectValue.vue";

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
		<SliderValue title="Rotation" v-model="currentValue.rotation" :min="0" :max="360" :step="1" :default="0" suffix="°" />
		<ObjectSelectValue title="Rotation Mode" v-model="currentValue.mode" :default="0" :allow-null="false" :options="RotationModeOptions" />
	</EditorPanel>
</template>
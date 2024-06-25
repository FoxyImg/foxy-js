<script setup lang="ts">
import {computed} from "vue";
import EditorPanel from "@/components/values/EditorPanel.vue";
import type {RedactParams} from "@foxy/url-builder";
import TagsValue from "@/components/values/TagsValue.vue";
import SliderValue from "@/components/values/SliderValue.vue";
import ColorValue from "@/components/values/ColorValue.vue";
import RedactRegionValue from "@/components/values/RedactRegionValue.vue";
import ToggleValue from "@/components/values/ToggleValue.vue";
import {storeToRefs} from "pinia";
import {useImageParamsStore} from "@/stores/image-params-store";

const {
	imageMeta,
} = storeToRefs(useImageParamsStore());

const props = defineProps<{
	modelValue: RedactParams
}>();

const emit = defineEmits<{
	(e: 'update:modelValue', value: RedactParams): void
}>();


const currentValue = computed({
	get: () => props.modelValue,
	set: (value) => emit('update:modelValue', value),
});


const redactPersonOptions = computed(() => {
	const options = [
		{ label: 'All People', value: 'all' },
	];

	if (imageMeta.value && imageMeta.value.people && imageMeta.value.people.length > 0) {
		options.push(...imageMeta.value.people.map((person:any, index:number) => ({
			label: `Person ${index + 1} - ${person.name}`,
			value: `${index}`,
		})));
	}

	return options;
});



const redactFaceOptions = computed(() => {
	const options = [
		{ label: 'All Faces', value: "all" },
	];

	if (imageMeta.value && imageMeta.value.faces && imageMeta.value.faces.length > 0) {
		options.push(...imageMeta.value.faces.map((face:any, index:number) => ({
			label: `Face #${index + 1}`,
			value: `${index}`,
		})));
	}

	return options;
});
</script>
<template>
	<EditorPanel title="Redact" collapse-key="redact-editor" v-model="currentValue.enabled" :show-toggle="true" :disabled="!currentValue.enabled">
		<TagsValue title="Faces" :options="redactFaceOptions" v-model="currentValue.faces" placeholder="Faces to redact" />
		<TagsValue title="People" :options="redactPersonOptions" v-model="currentValue.people" placeholder="People to redact" />
		<RedactRegionValue v-model="currentValue.regions" :corner-radius="currentValue.cornerRadius" />
		<SliderValue title="Blur" v-model="currentValue.blur" :min="0" :max="512" :step="1" :default="0" default-label="None" suffix="" />
		<SliderValue title="Pixelate" v-model="currentValue.pixelate" :min="0" :max="512" :step="1" :default="0" default-label="None" suffix="px" />
		<ToggleValue title="Use Fill Color" v-model="currentValue.useColor" />
		<ColorValue v-if="currentValue.useColor" title="Fill Color" v-model="currentValue.color" :default="null" />
		<SliderValue title="Blur Mask" v-model="currentValue.blurMask" :min="0" :max="512" :step="1" :default="0" default-label="None" suffix="" />
		<SliderValue title="Expand Mask" v-model="currentValue.expandMask" :min="0" :max="200" :step="1" :default="0" default-label="None" suffix="%" />
		<SliderValue title="Pixelate Mask" v-model="currentValue.pixelateMask" :min="0" :max="512" :step="1" :default="0" default-label="None" suffix="px" />
	</EditorPanel>
</template>
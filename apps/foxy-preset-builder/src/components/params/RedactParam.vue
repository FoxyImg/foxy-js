<script setup lang="ts">
import {computed} from "vue";
import EditorPanel from "@/components/inputs/EditorPanel.vue";
import type {ImageMeta, RedactParams} from "@foxy/url-builder";
import TagsInput from "@/components/inputs/TagsInput.vue";
import SliderInput from "@/components/inputs/SliderInput.vue";
import ColorInput from "@/components/inputs/ColorInput.vue";
import RedactRegionInput from "@/components/inputs/RedactRegionInput.vue";
import ToggleInput from "@/components/inputs/ToggleInput.vue";

const props = defineProps<{
	modelValue: RedactParams,
	imageMeta: ImageMeta|null,
	imageKey: string|null,
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

	if (props.imageMeta && props.imageMeta.people && props.imageMeta.people.length > 0) {
		options.push(...props.imageMeta.people.map((person:any, index:number) => ({
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

	if (props.imageMeta && props.imageMeta.faces && props.imageMeta.faces.length > 0) {
		options.push(...props.imageMeta.faces.map((face:any, index:number) => ({
			label: `Face #${index + 1}`,
			value: `${index}`,
		})));
	}

	return options;
});
</script>
<template>
	<EditorPanel title="Redact" collapse-key="redact-editor" v-model="currentValue.enabled" :show-toggle="true" :disabled="!currentValue.enabled">
		<TagsInput title="Faces" :options="redactFaceOptions" v-model="currentValue.faces" placeholder="Faces to redact" />
		<TagsInput title="People" :options="redactPersonOptions" v-model="currentValue.people" placeholder="People to redact" />
		<RedactRegionInput v-model="currentValue.regions" :corner-radius="currentValue.cornerRadius" :image-key="imageKey" />
		<SliderInput title="Blur" v-model="currentValue.blur" :min="0" :max="512" :step="1" :default="0" default-label="None" suffix="" />
		<SliderInput title="Pixelate" v-model="currentValue.pixelate" :min="0" :max="512" :step="1" :default="0" default-label="None" suffix="px" />
		<ToggleInput title="Use Fill Color" v-model="currentValue.useColor" />
		<ColorInput v-if="currentValue.useColor" title="Fill Color" v-model="currentValue.color" :default="null" />
		<SliderInput title="Blur Mask" v-model="currentValue.blurMask" :min="0" :max="512" :step="1" :default="0" default-label="None" suffix="" />
		<SliderInput title="Expand Mask" v-model="currentValue.expandMask" :min="0" :max="200" :step="1" :default="0" default-label="None" suffix="%" />
		<SliderInput title="Pixelate Mask" v-model="currentValue.pixelateMask" :min="0" :max="512" :step="1" :default="0" default-label="None" suffix="px" />
	</EditorPanel>
</template>
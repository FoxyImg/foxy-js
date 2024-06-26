<script setup lang="ts">
import {computed} from "vue";
import EditorPanel from "@/components/inputs/EditorPanel.vue";
import SliderInput from "@/components/inputs/SliderInput.vue";
import {StylizeOrderOptions, type StylizeParams} from "@foxy/url-builder";
import TagsInput from "@/components/inputs/TagsInput.vue";

const props = defineProps<{
	modelValue: StylizeParams,
}>();

const emit = defineEmits<{
	(e: 'update:modelValue', value: StylizeParams): void
}>();


const currentValue = computed({
	get: () => props.modelValue,
	set: (value) => emit('update:modelValue', value),
});
</script>
<template>
	<EditorPanel title="Stylize" collapse-key="stylize-editor"  v-model="currentValue.enabled" :show-toggle="true" :disabled="!currentValue.enabled">
		<TagsInput title="Stylize Order" :options="StylizeOrderOptions" v-model="currentValue.order" placeholder="Order to process stylize operations" />
		<SliderInput title="Blur" v-model="currentValue.blur" :min="0" :max="512" :step="1" :default="0" default-label="None" suffix="px" />
		<SliderInput title="Pixelate" v-model="currentValue.pixelate" :min="0" :max="512" :step="1" :default="0" default-label="None" suffix="px" />
	</EditorPanel>
</template>
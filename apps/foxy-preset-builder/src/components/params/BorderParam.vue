<script setup lang="ts">
import {computed, watch} from "vue";
import EditorPanel from "@/components/values/EditorPanel.vue";
import SliderValue from "@/components/values/SliderValue.vue";
import ColorValue from "@/components/values/ColorValue.vue";
import type {BorderParams} from "@foxy/url-builder";
import {useStorage} from "@vueuse/core";
import {ConstraintLineLongIcon, ConstrainIcon} from "@foxy/vue-ui";

const props = defineProps<{
	noun: string,
	collapseKey: string,
	constrainKey: string,
	modelValue: BorderParams
}>();

const emit = defineEmits<{
	(e: 'update:modelValue', value: BorderParams): void
}>();


const currentValue = computed({
	get: () => props.modelValue,
	set: (value) => emit('update:modelValue', value),
});

const constrainBorder = useStorage(props.constrainKey, true);

watch(() => [currentValue.value.top, currentValue.value.left, currentValue.value.right, currentValue.value.bottom], (newVal, oldVal) => {
	if (!constrainBorder.value) {
		return;
	}

	if (oldVal[0] !== newVal[0]) {
		currentValue.value.left = newVal[0];
		currentValue.value.right = newVal[0];
		currentValue.value.bottom = newVal[0];
	} else if (oldVal[1] !== newVal[1]) {
		currentValue.value.top = newVal[1];
		currentValue.value.right = newVal[1];
		currentValue.value.bottom = newVal[1];
	} else if (oldVal[2] !== newVal[2]) {
		currentValue.value.top = newVal[2];
		currentValue.value.left = newVal[2];
		currentValue.value.bottom = newVal[2];
	} else if (oldVal[3] !== newVal[3]) {
		currentValue.value.top = newVal[3];
		currentValue.value.left = newVal[3];
		currentValue.value.right = newVal[3];
	}
});
</script>
<template>
	<EditorPanel :title="noun" :collapse-key="collapseKey" v-model="currentValue.enabled" :show-toggle="true" :disabled="!currentValue.enabled">
		<ColorValue :title="`${noun} Color`" v-model="currentValue.color" :default="null" />
		<div class="flex items-center gap-1">
			<div class="flex-1 flex flex-col gap-3">
				<SliderValue :title="`Top ${noun}`" v-model="currentValue.top" :min="0" :max="512" :step="1" :default="0" default-label="None" suffix="px" />
				<SliderValue :title="`Right ${noun}`" v-model="currentValue.right" :min="0" :max="512" :step="1" :default="0" default-label="None" suffix="px" />
				<SliderValue :title="`Bottom ${noun}`" v-model="currentValue.bottom" :min="0" :max="512" :step="1" :default="0" default-label="None" suffix="px" />
				<SliderValue :title="`Left ${noun}`" v-model="currentValue.left" :min="0" :max="512" :step="1" :default="0" default-label="None" suffix="px" />
			</div>
			<div class="flex flex-col items-center justify-center gap-[8px]">
				<ConstraintLineLongIcon class="w-[11px] h-auto stroke-neutral-300" />
				<div class="cursor-pointer border border-neutral-300 rounded-lg p-1" :class="{'bg-neutral-300': constrainBorder}" @click="constrainBorder = !constrainBorder">
					<ConstrainIcon class="fill-black w-3 h-auto" />
				</div>
				<ConstraintLineLongIcon class="w-[11px] h-auto stroke-neutral-300 rotate-180 -scale-x-100" />
			</div>
		</div>
	</EditorPanel>
</template>
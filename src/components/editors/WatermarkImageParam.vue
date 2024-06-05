<script setup lang="ts">
import { computed } from 'vue';
import Icon from "@/components/UI/Icon.vue";
import WatermarkImageSamples from "@/components/editors/WatermarkImageSamples.vue";
import pDebounce from "p-debounce";
import {storeToRefs} from "pinia";
import {useImageParamsStore} from "@/stores/image-params-store";

const props = withDefaults(defineProps<{
	title: string,
	modelValue: string|null,
	default: string|null,
}>(), {
});

const {
	watermarkImageSamples,
} = storeToRefs(useImageParamsStore());

const emit = defineEmits<{
	(e: 'update:modelValue', value: string|null): void;
}>();

function updateModelValue(value: string|null) {
	emit('update:modelValue', value);
}

const debouncedUpdateModelValue = pDebounce(updateModelValue, 500);

const currentValue = computed({
	get: () => props.modelValue,
	set: (value) => debouncedUpdateModelValue(value),
});

function addImage() {
	console.log('adding image');
	if (currentValue.value === null || currentValue.value.trim().length === 0) {
		return;
	}

	if (watermarkImageSamples.value.includes(currentValue.value)) {
		return;
	}

	watermarkImageSamples.value.push(currentValue.value);
}
</script>
<template>
	<div class="flex flex-col gap-1.5">
		<div class="flex flex-col items-start gap-1">
			<label class="text-xxs uppercase text-neutral-600" :class="{'font-bold text-neutral-700': currentValue !== props.default}">{{title}}</label>
			<div class="w-full flex items-center gap-1">
				<input type="text" v-model="currentValue" class="flex-1 border border-neutral-200 text-xs rounded-md py-1.5 px-1" @enter="addImage" @paste="addImage" />
				<VDropdown>
					<div class="cursor-pointer flex items-center gap-1 aspect-square p-1">
						<Icon name="image-search" class="w-5 h-auto fill-black" />
					</div>
					<template #popper>
						<WatermarkImageSamples v-model="currentValue" />
					</template>
				</VDropdown>
			</div>
		</div>
		<div class="flex justify-end text-xxxs uppercase">
			<a href="#" @click.prevent.stop="emit('update:modelValue', props.default)">Reset</a>
		</div>
	</div>
</template>
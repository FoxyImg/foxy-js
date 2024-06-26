<script setup lang="ts">
import {computed, onMounted} from 'vue';
import pDebounce from "p-debounce";
import OverlayImageSamples from "@/components/values/OverlayImageSamples.vue";
import {ImageSearchIcon} from "@foxy/vue-ui";

const props = withDefaults(defineProps<{
	title: string,
	modelValue: string|null,
	overlayImages: string[],
	default: string|null,
}>(), {
});

const emit = defineEmits<{
	(e: 'update:modelValue', value: string|null): void;
	(e: 'removeOverlayImage', value: string): void;
	(e: 'addOverlayImage', value: string): void;
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
	if (currentValue.value === null) {
		return;
	}

	if (props.overlayImages.includes(currentValue.value)) {
		return;
	}

	emit('addOverlayImage', currentValue.value);
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
						<ImageSearchIcon class="w-5 h-auto fill-black" />
					</div>
					<template #popper>
						<OverlayImageSamples v-model="currentValue" :overlay-images="overlayImages" @remove-overlay-image="emit('removeOverlayImage', $event)" />
					</template>
				</VDropdown>
			</div>
		</div>
		<div class="flex justify-end text-xxxs uppercase">
			<a href="#" @click.prevent.stop="emit('update:modelValue', props.default)">Reset</a>
		</div>
	</div>
</template>
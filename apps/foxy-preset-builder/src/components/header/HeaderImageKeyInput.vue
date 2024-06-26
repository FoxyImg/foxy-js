<script setup lang="ts">
import {computed} from "vue";
import SmallLabel from "@/components/UI/SmallLabel.vue";

import pDebounce from 'p-debounce';
import {ImageSearchIcon} from "@foxy/vue-ui";
import HeaderSampleImages from "@/components/header/HeaderSampleImages.vue";

const props = withDefaults(defineProps<{
	label: string,
	type?: string,
	host:string|null|undefined,
	accessKey:string|null|undefined,
	secret:string|null|undefined,
	imgixMode:boolean,
	modelValue: string|null,
	sampleImages: string[],
}>(), {
	type: 'text',
});

const emit = defineEmits<{
	(e: 'update:modelValue', value: string|null): void;
	(e: 'removeSampleImage', value: string): void;
	(e: 'importSampleImages', value: string[]): void;
}>();

function updateModelValue(value: string|null) {
	emit('update:modelValue', value);
}

const debouncedUpdateModelValue = pDebounce(updateModelValue, 500);

const currentValue = computed({
	get: () => props.modelValue,
	set: (value) => debouncedUpdateModelValue(value),
});
</script>
<template>
	<div class="flex flex-col gap-1">
		<SmallLabel>{{ label }}</SmallLabel>
		<div class="w-full relative flex items-center gap-2">
			<input :type="type" class="w-full border border-neutral-200 rounded-md px-2 py-1 text-sm" v-model="currentValue" />
			<div v-if="host && accessKey && secret" class="aspect-square cursor-pointer">
				<VDropdown>
						<div class="w-4 aspect-square"><ImageSearchIcon class="w-auto h-4" /></div>
						<template #popper>
							<HeaderSampleImages v-model="currentValue" :host="host" :access-key="accessKey" :secret="secret" :sample-images="sampleImages" :imgix-mode="imgixMode" @remove-sample-image="emit('removeSampleImage', $event)" @import-sample-images="emit('importSampleImages', $event)" />
						</template>
				</VDropdown>
			</div>
		</div>
	</div>
</template>
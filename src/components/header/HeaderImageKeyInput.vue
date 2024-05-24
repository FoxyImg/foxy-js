<script setup lang="ts">
import {computed} from "vue";
import SmallLabel from "@/components/UI/SmallLabel.vue";

import pDebounce from 'p-debounce';
import Icon from "@/components/UI/Icon.vue";
import HeaderSampleImages from "@/components/header/HeaderSampleImages.vue";

const props = withDefaults(defineProps<{
	label: string,
	type?: string,
	host:string,
	accessKey:string|null,
	secret:string,
	modelValue: string|null,
}>(), {
	type: 'text',
});

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
</script>
<template>
	<div class="flex flex-col gap-1">
		<SmallLabel>{{ label }}</SmallLabel>
		<div class="w-full relative">
			<input :type="type" class="w-full border border-neutral-200 rounded-md px-2 py-1 text-sm" v-model="currentValue" />
			<div class="absolute right-1 top-1/2 -translate-y-1/2 cursor-pointer">
				<VDropdown>
						<div class="w-4 aspect-square"><Icon name="image-search" class="w-auto h-4" /></div>
						<template #popper>
							<HeaderSampleImages v-model="currentValue" :host="host" :access-key="accessKey" :secret="secret" />
						</template>
				</VDropdown>
			</div>
		</div>
	</div>
</template>
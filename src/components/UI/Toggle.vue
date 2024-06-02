<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
	modelValue: boolean,
	size?: 'sm'|'md'
}>(), {
	size: 'md',
});

const emit = defineEmits<{
	(e: 'update:modelValue', value: boolean): void;
}>();

const currentValue = computed({
	get: () => props.modelValue,
	set: (value) => emit('update:modelValue', value),
});

const toggleClass = computed(() => {
	if (props.size === 'sm') {
		return "w-5 h-3 peer-focus:ring-1 after:top-[1px] after:start-[1px] after:h-2.5 after:w-2.5 peer-checked:after:translate-x-2"
	} else {
		return "w-9 h-5 peer-focus:ring-2 after:top-[2px] after:start-[2px] after:h-4 after:w-4 peer-checked:after:translate-x-full"

	}
});
</script>
<template>
	<label class="inline-flex items-center cursor-pointer">
		<input type="checkbox" v-model="currentValue" class="sr-only peer">
		<div
			class="relative bg-gray-200 peer-focus:outline-none peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700  rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:bg-white after:border-gray-300 after:border after:rounded-full after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
			:class="toggleClass"
		></div>
	</label>
</template>
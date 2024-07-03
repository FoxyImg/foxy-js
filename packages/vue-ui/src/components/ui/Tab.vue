<script setup lang="ts">
withDefaults(defineProps<{
	modelValue: string,
	value: string,
	activeColor?: string,
}>(), {
	activeColor: 'bg-neutral-100'
});

const emit = defineEmits<{
	(e: 'update:modelValue', value: string): void;
}>();
</script>
<template>
	<a class="cursor-pointer px-2 py-1 uppercase font-bold text-xxs" @click="emit('update:modelValue', value)" :class="modelValue === value ? `${activeColor} text-neutral-600` : 'bg-neutral-300 text-neutral-500'">
		<slot :selected="modelValue === value"></slot>
	</a>
</template>

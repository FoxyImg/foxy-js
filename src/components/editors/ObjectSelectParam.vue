<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
	title: string,
	modelValue: string|number|null,
	default: string|number|null,
	allowNull?: boolean,
	options: { label: string, value: string|number }[]
}>(), {
	allowNull: true,
});

const emit = defineEmits<{
	(e: 'update:modelValue', value: string|number|null): void;
}>();

const currentValue = computed({
	get: () => props.modelValue,
	set: (value) => emit('update:modelValue', value),
});
</script>
<template>
	<div class="flex flex-col gap-1.5">
		<div class="flex flex-col items-start gap-1">
			<label class="text-xxs uppercase text-neutral-600" :class="{'font-bold text-neutral-700': currentValue !== props.default}">{{title}}</label>
			<select v-model="currentValue" class="w-full border border-neutral-200 text-xs flex-1 rounded-md py-1.5 px-1">
				<option v-if="allowNull" :selected="currentValue === null" :value="null">None</option>
				<option v-for="param in options" :key="param.value" :value="param.value" :selected="param.value === currentValue">{{ param.label }}</option>
			</select>
		</div>
		<div class="flex justify-end text-xxxs uppercase">
			<a href="#" @click.prevent.stop="emit('update:modelValue', props.default)">Reset</a>
		</div>
	</div>
</template>
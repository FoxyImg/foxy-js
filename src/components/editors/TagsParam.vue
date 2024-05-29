<script setup lang="ts">
import { computed } from 'vue';
import Multiselect from '@vueform/multiselect'
import "@vueform/multiselect/themes/default.css";

const props = defineProps<{
	title: string,
	placeholder: string,
	modelValue: string[],
	options: { label: string, value: string }[]
}>();

const emit = defineEmits<{
	(e: 'update:modelValue', value: string[]): void;
}>();

const currentValue = computed({
	get: () => props.modelValue,
	set: (value) => emit('update:modelValue', value),
});
</script>
<template>
	<div class="flex flex-col gap-1.5">
		<div class="flex flex-col items-start gap-1">
			<label class="text-xxs uppercase text-neutral-600" :class="{'font-bold text-neutral-700': currentValue.length > 0}">{{title}}</label>
			<Multiselect
				mode="tags"
				v-model="currentValue"
				:options="options"
				:searchable="false"
				:create-option="false"
				:add-option-on="['enter', ',']"
				:placeholder="placeholder"
				:multiple="true"
				:close-on-select="true"
			/>
		</div>
		<div class="flex justify-end text-xxxs uppercase">
			<a href="#" @click.prevent.stop="emit('update:modelValue', [])">Reset</a>
		</div>
	</div>
</template>
<style>
body {
	--ms-font-size: theme('fontSize.xxs');
	--ms-option-font-size: theme('fontSize.xs');
	--ms-tag-font-size: theme('fontSize.xxs');
	--ms-tag-bg: theme('colors.blue.600');
	--ms-tag-bg-disabled: #9CA3AF;
}
</style>
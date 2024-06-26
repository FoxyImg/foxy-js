<script setup lang="ts">
import { computed } from 'vue';
import type {OverlaySubstitutionParam} from "@foxy/url-builder";
import DeleteSourceIcon from "../icons/DeleteSourceIcon.vue";

const props = withDefaults(defineProps<{
	title: string,
	modelValue: OverlaySubstitutionParam[],
	default: OverlaySubstitutionParam[],
}>(), {
});

const emit = defineEmits<{
	(e: 'update:modelValue', value: OverlaySubstitutionParam[]): void;
}>();

const currentValue = computed({
	get: () => props.modelValue,
	set: (value) => emit('update:modelValue', value),
});

function addSubstitution() {
	const cval = JSON.parse(JSON.stringify(currentValue.value));
	cval.push({
		key: '',
		value: '',
	});
	currentValue.value = cval;
}

function deleteSubstitution(index:number) {
	const cval = JSON.parse(JSON.stringify(currentValue.value));
	cval.splice(index, 1);
	currentValue.value = cval;
}
</script>
<template>
	<div class="flex flex-col gap-1.5">
		<div class="flex flex-col items-start gap-1">
			<label class="text-xxs uppercase text-neutral-600" :class="{'font-bold text-neutral-700': currentValue !== props.default}">{{title}}</label>
			<div v-if="currentValue.length === 0" class="w-full relative flex items-center justify-center p-5 text-xs">
				No substitutions.
			</div>
			<div v-else class="py-2 w-full flex flex-col gap-1">
				<div v-for="(substitution, index) in currentValue" :key="index" class="w-full flex items-center gap-1">
					<input type="text" v-model="substitution.key" class="flex-1 border border-neutral-200 text-xs rounded-md py-1.5 px-1" />
					<input type="text" v-model="substitution.value" class="flex-1 border border-neutral-200 text-xs rounded-md py-1.5 px-1" />
					<div class="flex aspect-square cursor-pointer items-center justify-center" @click="deleteSubstitution(index)">
						<DeleteSourceIcon class="w-auto h-3.5 fill-red-600 cursor-pointer" />
					</div>
				</div>
			</div>
			<div class="w-full flex items-center justify-end gap-1">
				<button @click="addSubstitution" class="button small" type="button">Add</button>
			</div>
		</div>
	</div>
</template>

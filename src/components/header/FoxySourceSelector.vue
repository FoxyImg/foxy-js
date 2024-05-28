<script setup lang="ts">
import {computed} from "vue";
import SmallLabel from "@/components/UI/SmallLabel.vue";
import Icon from "@/components/UI/Icon.vue";
import type {FoxySource} from "@/types/foxy-source";

const props = defineProps<{
	modelValue: string|null,
	sources: FoxySource[],
}>();

const emit = defineEmits<{
	(e: 'update:modelValue', value: string|null): void;
	(e: 'newSource'): void;
	(e: 'editSource'): void;
	(e: 'deleteSource'): void;
}>();

const currentValue = computed({
	get: () => props.modelValue,
	set: (value) => emit('update:modelValue', value),
});
</script>
<template>
	<div class="flex flex-col gap-1">
		<SmallLabel>Foxy Source</SmallLabel>
		<div class="flex items-center gap-2">
			<select v-model="currentValue" class="w-full min-w-[200px] border border-neutral-200 text-xs flex-1 rounded-md py-1.5 px-1">
				<option v-for="source in sources" :key="source.key!" :value="source.key" :selected="source.key === currentValue">{{ source.name }}</option>
			</select>
			<div v-tooltip="'Create New Foxy Source'" class="cursor-pointer" @click="emit('newSource')"><Icon name="new-source" class="w-auto h-3.5" /></div>
			<div v-tooltip="'Edit Foxy Source'" class="cursor-pointer" @click="emit('editSource')" :class="{'pointer-events-none opacity-35': currentValue == null}"><Icon name="edit-source" class="w-auto h-4" /></div>
			<div v-tooltip="'Delete Foxy Source'" class="cursor-pointer" @click="emit('deleteSource')"  :class="{'pointer-events-none opacity-35': currentValue == null}"><Icon name="delete-source" class="fill-red-600 w-auto h-4"  /></div>
		</div>
	</div>
</template>
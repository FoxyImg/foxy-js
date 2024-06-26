<script setup lang="ts">
import {computed} from "vue";
import {SmallLabel} from "@foxy/vue-ui";
import type {FoxyApp} from "@/types/foxy-app";
import {DeleteSourceIcon, EditSourceIcon, NewSourceIcon} from "@foxy/vue-ui";

const props = defineProps<{
	modelValue: string|null,
	apps: FoxyApp[],
}>();

const emit = defineEmits<{
	(e: 'update:modelValue', value: string|null): void;
	(e: 'addApp'): void;
	(e: 'editApp'): void;
	(e: 'deleteApp'): void;
}>();

const currentValue = computed({
	get: () => props.modelValue,
	set: (value) => emit('update:modelValue', value),
});
</script>
<template>
	<div class="flex flex-col gap-1">
		<SmallLabel>Foxy App</SmallLabel>
		<div class="flex items-center gap-2">
			<select v-model="currentValue" class="w-full min-w-[200px] border border-neutral-200 text-xs flex-1 rounded-md py-1.5 px-1">
				<option v-for="app in apps" :key="app.id!" :value="app.id" :selected="app.id === currentValue">{{ app.name }}</option>
			</select>
			<div v-tooltip="'Add Foxy App'" class="cursor-pointer" @click="emit('addApp')"><NewSourceIcon class="w-auto h-3.5" /></div>
			<div v-tooltip="'Edit Foxy App'" class="cursor-pointer" @click="emit('editApp')" :class="{'pointer-events-none opacity-35': currentValue == null}"><EditSourceIcon class="w-auto h-4" /></div>
			<div v-tooltip="'Delete Foxy App'" class="cursor-pointer" @click="emit('deleteApp')"  :class="{'pointer-events-none opacity-35': currentValue == null}"><DeleteSourceIcon class="fill-red-600 w-auto h-4"  /></div>
		</div>
	</div>
</template>
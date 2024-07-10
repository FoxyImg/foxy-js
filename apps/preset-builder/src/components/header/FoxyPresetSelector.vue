<script setup lang="ts">
import {computed} from "vue";
import {SmallLabel} from "@foxyimg/vue-ui";
import type {FoxyPreset} from "@foxyimg/url-builder";
import {properCase} from "@foxyimg/utils";
import {DeleteSourceIcon, EditSourceIcon, NewSourceIcon, ReloadIcon, SaveIcon} from "@foxyimg/vue-ui";

const props = defineProps<{
	modelValue: string|null,
	presets: { [key:string]: FoxyPreset },
	presetChanged: boolean,
}>();

const emit = defineEmits<{
	(e: 'update:modelValue', value: string|null): void;
	(e: 'newPreset'): void;
	(e: 'editPreset'): void;
	(e: 'deletePreset'): void;
	(e: 'updatePreset'): void;
	(e: 'syncPresets'): void;
}>();

const currentValue = computed({
	get: () => props.modelValue,
	set: (value) => emit('update:modelValue', value),
});

const currentPresetKeys = computed(() => Object.keys(props.presets).sort());
</script>
<template>
	<div class="flex flex-col gap-1">
		<SmallLabel>Foxy Preset</SmallLabel>
		<div class="flex items-center gap-2">
			<select v-model="currentValue" class="w-full min-w-[200px] border border-neutral-200 text-xs flex-1 rounded-md py-1.5 px-1">
				<option :value="null" :selected="currentValue === null">None</option>
				<option v-for="key in currentPresetKeys" :key="key" :value="key" :selected="key === currentValue">{{ properCase(key.replace(/[_-]/g, " ")) }}</option>
			</select>
			<div v-tooltip="'Refresh Presets'" class="cursor-pointer" @click="emit('syncPresets')"><ReloadIcon class="fill-red-600 w-3.5 h-auto"  /></div>
			<div v-tooltip="'Update Selected Preset'" class="cursor-pointer" @click="emit('updatePreset')" :class="{'pointer-events-none opacity-35': currentValue == null}"><SaveIcon class="w-auto h-4 fill-blue-600" /></div>
			<div v-tooltip="'Create New Foxy Preset'" class="cursor-pointer" @click="emit('newPreset')"><NewSourceIcon class="w-auto h-3.5" /></div>
			<div v-tooltip="'Edit Foxy Preset'" class="cursor-pointer" @click="emit('editPreset')" :class="{'pointer-events-none opacity-35': currentValue == null}"><EditSourceIcon class="w-auto h-4" /></div>
			<div v-tooltip="'Delete Foxy Preset'" class="cursor-pointer" @click="emit('deletePreset')"  :class="{'pointer-events-none opacity-35': currentValue == null}"><DeleteSourceIcon class="fill-red-600 w-auto h-4"  /></div>
		</div>
	</div>
</template>
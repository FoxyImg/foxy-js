<script setup lang="ts">
import {ModalContainer} from "@foxy/vue-ui";
import {computed, reactive, ref, toRaw} from "vue";
import {SmallLabel} from "@foxy/vue-ui";
import type {FoxyApp} from "@/types/foxy-app";
import useFoxyAppEditor from "@/composables/foxy-app-editor";
import {storeToRefs} from "pinia";
import {useImageParamsStore} from "@/stores/image-params-store";
import {useFoxyAppStore} from "@/stores/foxy-app-store";
import type {FoxyPreset} from "@/types/foxy-preset";
import slugify from "slugify";
import {JSONViewer} from "@foxy/vue-ui";

const {
	currentPreset,
	currentPresets
} = storeToRefs(useFoxyAppStore());

const {
	currentPresetJSONObject,
} = storeToRefs(useImageParamsStore());

const props = defineProps<{
	editing: boolean,
	modelValue: string|null,
}>();

const modalProps = reactive<{
	title: string,
	showTitle: boolean
	showClose: boolean
}>({
	title: props.editing ? "Edit Source" : "New Source",
	showTitle: true,
	showClose: true
});

const emit = defineEmits(['update:modelValue', 'save', 'close']);

const presetSlug = computed(() => {
		return props.modelValue ? slugify(props.modelValue, {
			lower: true,
			strict: true,
			replacement: '-',
		}) : null;
});

const currentValue = computed({
	get: () => props.modelValue,
	set: (value) => emit('update:modelValue', value),
});

const currentJSONObject = computed(() => {
	return props.editing ? currentPreset.value : currentPresetJSONObject.value;
});

function savePreset() {
	if (!currentValue.value || currentValue.value.length === 0) {
		alert("Please enter a name for the preset.");
		return;
	}

	if (Object.keys(currentPresets.value).includes(currentValue.value)) {
		alert("A preset with that name already exists.");
		return;
	}

	emit('save');
	emit('close');
}

</script>
<template>
	<ModalContainer v-bind="modalProps" @close="emit('close')">
		<div class="p-3 text-base flex flex-col gap-3">
			<div class="flex flex-col gap-1">
				<SmallLabel>Preset Name</SmallLabel>
				<input type="text" v-model="currentValue" ref="inputRef" class="border border-neutral-200 rounded-md px-2 py-1 text-sm">
			</div>
			<div class="flex flex-col gap-1">
				<SmallLabel>Preset Slug</SmallLabel>
				<input type="text" :value="presetSlug" readonly class="border border-neutral-200 rounded-md px-2 py-1 text-sm">
			</div>
			<div v-if="currentJSONObject" class="h-[300px] w-full relative">
				<JSONViewer :json-object="currentJSONObject" class="absolute left-0 top-0 right-0 bottom-0" />
			</div>
			<div class="flex justify-end">
				<button type="button" class="button"  @click="savePreset">Save Preset</button>
			</div>
		</div>
	</ModalContainer>
</template>
<script setup lang="ts">
import ModalContainer from "@/components/UI/ModalContainer.vue";
import {SourceTypeOptions} from "@/types/options";
import {nextTick, onMounted, reactive, ref} from "vue";
import SmallLabel from "@/components/UI/SmallLabel.vue";
import type {FoxySource} from "@/types/foxy-source";
import Toggle from "@/components/UI/Toggle.vue";

const props = defineProps<{
	editing: boolean,
	modelValue: FoxySource,
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

const currentSource = ref<FoxySource>(JSON.parse(JSON.stringify(props.modelValue)));
const inputRef = ref<HTMLInputElement | null>(null);
const jsonFileInputRef = ref<HTMLInputElement | null>(null);

function saveSource() {
	emit('update:modelValue', currentSource.value);
	emit('save');
}

onMounted(() => {
	nextTick(() => {
		inputRef.value?.select();
		inputRef.value?.focus();
	});
});

function jsonSelected() {
	if (!jsonFileInputRef.value || jsonFileInputRef.value.files?.length === 0) {
		return;
	}

	const reader = new FileReader();
	reader.onload = (e) => {
		const json = JSON.parse(e.target?.result as string);
		if (Array.isArray(json)) {
			console.log(json);
			currentSource.value.sampleImages = json;
		}
	};

	reader.readAsText(jsonFileInputRef.value.files![0]);
}
</script>
<template>
	<ModalContainer v-bind="modalProps" @close="emit('close')">
		<div class="p-3 text-base flex flex-col gap-3">
			<div class="flex flex-col gap-1">
				<SmallLabel>Source Name</SmallLabel>
				<input type="text" v-model="currentSource.name" ref="inputRef" autofocus class="border border-neutral-200 rounded-md px-2 py-1 text-sm">
			</div>
			<div class="flex flex-col gap-1">
				<SmallLabel>Source Type</SmallLabel>
				<select v-model="currentSource.type" class="w-full border border-neutral-200 text-xs flex-1 rounded-md py-1.5 px-1">
					<option v-for="(param, key) in SourceTypeOptions" :key="key" :value="key" :selected="key === currentSource.type">{{ param }}</option>
				</select>
			</div>
			<div class="flex flex-col gap-1">
				<SmallLabel>Access Key</SmallLabel>
				<input type="text" v-model="currentSource.key" class="border border-neutral-200 rounded-md px-2 py-1 text-sm">
			</div>
			<div class="flex flex-col gap-2 text-sm py-1">
				<label class="flex items-center gap-1.5 cursor-pointer">
					<Toggle v-model="currentSource.imgixMode" size="md" />
					Imgix Mode
				</label>
			</div>
			<div class="flex flex-col gap-1">
				<SmallLabel>Sample Image Keys</SmallLabel>
				<input type="file" @change="jsonSelected" ref="jsonFileInputRef" class="text-sm">
			</div>
			<div class="flex justify-end">
				<button type="button" class="button"  @click="saveSource">Save Source</button>
			</div>
		</div>
	</ModalContainer>
</template>
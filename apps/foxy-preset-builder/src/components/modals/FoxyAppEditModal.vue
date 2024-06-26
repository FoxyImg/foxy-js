<script setup lang="ts">
import ModalContainer from "@/components/UI/ModalContainer.vue";
import {reactive, ref, toRaw} from "vue";
import {SmallLabel} from "@foxy/vue-ui";
import type {FoxyApp} from "@/types/foxy-app";
import useFoxyAppEditor from "@/composables/foxy-app-editor";

const {
	verifyAppId
} = useFoxyAppEditor();

const props = defineProps<{
	editing: boolean,
	modelValue: FoxyApp,
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

const currentApp = ref<FoxyApp>(JSON.parse(JSON.stringify(props.modelValue)));

async function saveSource() {
	if (currentApp.value.id === null || currentApp.value.url === null || currentApp.value.apiKey === null) {
		alert("Missing required fields");
		return;
	}


	try {
		const res = await verifyAppId(currentApp.value.id, currentApp.value.url, currentApp.value.apiKey);
		currentApp.value.sources = res.sources;
		currentApp.value.presets = res.presets;
		console.log(currentApp.value);
	} catch (e) {
		console.log(e);
		alert("Could not verify app ID.");
		return;
	}

	emit('update:modelValue', currentApp.value);
	emit('save');
}

</script>
<template>
	<ModalContainer v-bind="modalProps" @close="emit('close')">
		<div class="p-3 text-base flex flex-col gap-3">
			<div class="flex flex-col gap-1">
				<SmallLabel>App ID</SmallLabel>
				<input type="text" v-model="currentApp.id" ref="inputRef" autofocus class="border border-neutral-200 rounded-md px-2 py-1 text-sm">
			</div>
			<div class="flex flex-col gap-1">
				<SmallLabel>Name</SmallLabel>
				<input type="text" v-model="currentApp.name" ref="inputRef" class="border border-neutral-200 rounded-md px-2 py-1 text-sm">
			</div>
			<div class="flex flex-col gap-1">
				<SmallLabel>App URL</SmallLabel>
				<input type="text" v-model="currentApp.url" class="border border-neutral-200 rounded-md px-2 py-1 text-sm">
			</div>
			<div class="flex flex-col gap-1">
				<SmallLabel>Signing Key</SmallLabel>
				<input type="password" v-model="currentApp.signingKey" class="border border-neutral-200 rounded-md px-2 py-1 text-sm">
			</div>
			<div class="flex flex-col gap-1">
				<SmallLabel>API Key</SmallLabel>
				<input type="password" v-model="currentApp.apiKey" class="border border-neutral-200 rounded-md px-2 py-1 text-sm">
			</div>
			<div class="flex justify-end">
				<button type="button" class="button"  @click="saveSource">Save App</button>
			</div>
		</div>
	</ModalContainer>
</template>
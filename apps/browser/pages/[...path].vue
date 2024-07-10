<script setup lang="ts">
import type {File} from "~/types/file";
import {leadingSlash, trailingSlash} from "@foxyimg/utils";
import {useStorage} from "@vueuse/core";
import Icon from "~/components/Icon.vue";
import Folder from "~/components/Folder.vue";
import FilePreview from "~/components/FilePreview.vue";
import {useShoppingListStore} from "~/stores/shopping-list-store";
import ShoppingList from "~/components/ShoppingList.vue";

const {selectedFiles} = storeToRefs(useShoppingListStore());

const route = useRoute();
const path = computed(() => {
	let p = Array.isArray(route.params.path) ? route.params.path.join('/') : route.params.path;
	p = p === "" ? "/" : p;

	console.log('path', p);

	return leadingSlash(trailingSlash(p));
});

const { data: allFiles, refresh } = await useAsyncData<File[]>('files', () => {
	console.log('fetching', path.value);
	return $fetch(`/api/files${path.value}`)
}, {
	watch: [path]
});

const folders = computed(() => {
	if (!allFiles.value || !Array.isArray(allFiles.value)) {
		return [];
	}

	return allFiles.value.filter((file) => file.type === 'dir');
});

const files = computed(() => {
	if (!allFiles.value || !Array.isArray(allFiles.value)) {
		console.log('no files', allFiles.value);
		return [];
	}

	return allFiles.value.filter((file) => file.type === 'file');
});

const parentFolder = computed(() => {
	if (path.value === '/') {
		return '/';
	}

	const parts = path.value.split('/').filter(val => val.trim().length > 0);
	console.log('parts', parts);
	if (parts.length === 1) {
		return '/';
	}

	const url = parts.slice(0, -1).join('/')+'/';
	console.log('parent', path.value, url);
	return leadingSlash(url);
});

const columns = useStorage('foxy-browser-columns', 5);
const reversedColumns = computed({
	get: () => 13 - columns.value,
	set: (value) => columns.value = 13 - value,
});

const showPreviewModal = ref(false);
const previewFileIndex = ref(0);

function showPreview(fileIndex:number) {
	previewFileIndex.value = fileIndex;
	showPreviewModal.value = true;
}
</script>
<template>
	<div class="fixed inset-0 flex" v-auto-animate>
		<div class="flex-1 relative h-full flex flex-col" key="browser">
			<div class="p-3 flex items-center gap-3 border-b border-neutral-200 bg-neutral-100">
				<NuxtLink v-if="path !== '/'" :to="parentFolder" class="flex items-center gap-1 text-xs">
					<Icon name="next" class="w-auto h-3 fill-black rotate-180" />
					<div>Back</div>
				</NuxtLink>
				<div class="flex-1 flex items-center border rounded-md border-neutral-200 px-2 py-1.5 text-xs bg-white">
					{{ path}}
				</div>
			</div>
			<div class="flex-1 w-full relative">
				<div class="absolute inset-0 overflow-x-hidden overflow-y-auto p-1.5">
					<div class="grid w-full" :style="`grid-template-columns: repeat(${columns}, minmax(0, 1fr))`">
						<Folder v-for="folder in folders" :key="folder.path" :folder="folder" :columns="columns" />
						<FilePreview v-for="(file, idx) in files" :key="file.path" :file="file" :columns="columns"  @click="showPreview(idx)" />
					</div>
				</div>
			</div>
			<div class="p-3 flex items-center w-full border-t text-xs bg-neutral-100">
				<div class="flex-1 flex items-center">
					<span v-if="allFiles">{{ allFiles.length }} files</span>
				</div>
				<div class="flex-1 flex justify-end items-center">
					<input type="range" min="1" max="12" v-model="reversedColumns" class="range w-48" />
				</div>
			</div>
		</div>
		<ShoppingList v-if="selectedFiles.length > 0" key="shopping-list" />
	</div>

	<FadeTransition>
		<PreviewModal v-if="showPreviewModal && allFiles" :file-index="previewFileIndex" :files="allFiles" @close="showPreviewModal = false"></PreviewModal>
	</FadeTransition>
</template>
<script setup lang="ts">
import type {File} from "~/types/file";
import {leadingSlash, trailingSlash} from "@foxyimg/utils";
import {useStorage} from "@vueuse/core";
import Icon from "~/components/Icon.vue";
import Folder from "~/components/Folder.vue";
import FilePreview from "~/components/FilePreview.vue";
import {useShoppingListStore} from "~/stores/shopping-list-store";
import ShoppingList from "~/components/ShoppingList.vue";
import {useStorageClampedRef} from "../../../packages/vue-utils";
import PreviewModal from "~/components/PreviewModal.vue";

const {selectedFiles} = storeToRefs(useShoppingListStore());
const {selectFile, deselectFile} = useShoppingListStore();

const route = useRoute();
const path = computed(() => {
	let p = Array.isArray(route.params.path) ? route.params.path.join('/') : route.params.path;
	p = p === "" ? "/" : p;

	return leadingSlash(trailingSlash(p));
});

const { data: allFiles, refresh } = await useAsyncData<File[]>('files', () => {
	return $fetch(`/api/files${path.value}`)
}, {
	watch: [path]
});

const filter = useStorage<null|"images"|"videos">('foxy-browser-filter', null);
const search = useStorage<string>('foxy-browser-search', "");
const sort = useStorage<string>('foxy-browser-sort', "name-asc");

const folders = computed(() => {
	if (!allFiles.value || !Array.isArray(allFiles.value)) {
		return [];
	}

	return allFiles.value.filter((file) => file.type === 'dir').filter(dir => {
		if (filter.value === 'images') {
			return dir.images! > 0 || dir.subdirs! > 0;
		}

		if (filter.value === 'videos') {
			return dir.videos! > 0 || dir.subdirs! > 0;
		}

		return true;
	}).filter(dir => {
		if (search.value.trim().length === 0) {
			return true;
		}

		return dir.path.toLowerCase().includes(search.value.toLowerCase());
	}).filter(dir => {
		return dir.subdirs! > 0 || dir.images! > 0 || dir.videos! > 0;
	}).sort((a, b) => {
		if (sort.value === 'name-asc') {
			return a.name.localeCompare(b.name);
		} else if (sort.value === 'date-asc') {
			return a.created.localeCompare(b.created);
		} else {
			return b.created.localeCompare(a.created);
		}
	});
});

const files = computed(() => {
	if (!allFiles.value || !Array.isArray(allFiles.value)) {
		return [];
	}

	return allFiles.value.filter((file) => file.type === 'file').filter(file => {
		if (filter.value === 'images') {
			return file.mimeType && file.mimeType.startsWith('image');
		}

		if (filter.value === 'videos') {
			return file.mimeType && file.mimeType.startsWith('video');
		}

		return true;
	}).filter(file => {
		if (search.value.trim().length === 0) {
			return true;
		}

		return file.path.toLowerCase().includes(search.value.toLowerCase());
	}).sort((a, b) => {
		if (sort.value === 'name-asc') {
			return a.name.localeCompare(b.name);
		} else if (sort.value === 'date-asc') {
			return a.created.localeCompare(b.created);
		} else {
			return b.created.localeCompare(a.created);
		}
	});
});

const parentFolder = computed(() => {
	if (path.value === '/') {
		return '/';
	}

	const parts = path.value.split('/').filter(val => val.trim().length > 0);
	if (parts.length === 1) {
		return '/';
	}

	const url = parts.slice(0, -1).join('/')+'/';
	return leadingSlash(url);
});

const previewSize = useStorageClampedRef('foxy-browser-preview-size', 256, 96, 1080);

const showPreviewModal = ref(false);
const previewFileIndex = ref(0);

function showPreview(fileIndex:number) {
	previewFileIndex.value = fileIndex;
	showPreviewModal.value = true;
}

function selectAll() {
	if (!allFiles.value) {
		return;
	}

	for(const file of allFiles.value) {
		selectFile(file);
	}
}

function selectNone() {
	if (!allFiles.value) {
		return;
	}

	for(const file of allFiles.value) {
		deselectFile(file);
	}
}

useHead({
	title: "Browser - "+path.value,
})
</script>
<template>
	<div class="fixed inset-0 flex" v-auto-animate>
		<div class="flex-1 relative h-full flex flex-col" key="browser">
			<div class="p-3 flex items-center gap-3 border-b border-neutral-200 bg-neutral-100">
				<NuxtLink v-if="path !== '/'" :to="parentFolder" class="flex items-center gap-1 text-xs group">
					<Icon name="next" class="w-auto h-3 fill-black group-hover:fill-blue-600 rotate-180" />
					<div class="group-hover:text-blue-600">Back</div>
				</NuxtLink>
				<div class="flex-1 flex items-center border rounded-md border-neutral-200 px-2 py-1.5 text-xs bg-neutral-50 gap-1.5">
					<Icon name="folder" class="w-auto h-3.5" />
					{{ path}}
				</div>
				<input v-model="search" type="search" class="border border-neutral-200 rounded-md px-2 py-1.5 text-xs bg-white" placeholder="Search..." />
				<select v-model="filter" class="border border-neutral-200 rounded-md px-2 py-1.5 text-xs bg-white">
					<option :value="null">All</option>
					<option value="images">Images</option>
					<option value="videos">Videos</option>
				</select>
				<select v-model="sort" class="border border-neutral-200 rounded-md px-2 py-1.5 text-xs bg-white">
					<option value="name-asc">Name</option>
					<option value="date-asc">Oldest</option>
					<option value="date-desc">Newest</option>
				</select>
			</div>
			<div class="flex-1 w-full relative">
				<div class="absolute inset-0 overflow-x-hidden overflow-y-auto p-1.5">
					<div class="grid w-full" :style="`grid-template-columns: repeat(auto-fill, minmax(${previewSize}px, 1fr))`">
						<Folder v-for="folder in folders" :key="folder.path" :folder="folder" :preview-size="previewSize!" />
						<template v-for="(file, idx) in files" :key="files[idx].path" >
							<FilePreview v-model="files[idx]" :preview-size="previewSize!"  @click="showPreview(idx)" />
						</template>
					</div>
				</div>
			</div>
			<div class="px-3 py-2 flex items-center w-full border-t text-xs bg-neutral-100">
				<div class="flex-1 flex items-center">
					<span v-if="allFiles">{{ allFiles.length }} files</span>
				</div>
				<div class="flex-1 flex justify-end items-center gap-6">
					<div class="flex items-center gap-1.5">
						<button type="button" class="button alt small" @click="selectAll">Select All</button>
						<button type="button" class="button alt small" @click="selectNone">Select None</button>
					</div>
					<div class="flex items-center gap-2">
						<button @click="previewSize! -= 64" type="button"><Icon name="zoom-out" class="w-auto h-4 fill-neutral-600 hover:fill-blue-700" /></button>
						<input type="range" min="96" max="1080" v-model.number="previewSize" class="range w-48" />
						<button @click="previewSize! += 64" type="button"><Icon name="zoom-in" class="w-auto h-4 fill-neutral-600 hover:fill-blue-700" /></button>
					</div>
				</div>
			</div>
		</div>
		<ShoppingList v-if="selectedFiles.length > 0" key="shopping-list" />
	</div>

	<FadeTransition>
		<PreviewModal v-if="showPreviewModal && files" :file-index="previewFileIndex" :files="files" @close="showPreviewModal = false"></PreviewModal>
	</FadeTransition>
</template>
<style>
.button.alt {
	@apply bg-transparent text-neutral-600 border-neutral-300 border rounded-md px-2 py-1 hover:bg-blue-600 hover:text-white hover:border-transparent;
}
</style>
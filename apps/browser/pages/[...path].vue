<script setup lang="ts">
import type {File} from "~/types/file";
//@ts-ignore
import FolderIcon from "~/assets/icons/folder.svg";
//@ts-ignore
import FileIcon from "~/assets/icons/file.svg";
//@ts-ignore
import NextIcon from "~/assets/icons/next.svg";
//@ts-ignore
import VideoIcon from "~/assets/icons/video.svg";

import {leadingSlash, trailingSlash} from "@foxyimg/utils";
import copy from "copy-to-clipboard";
import {useStorage} from "@vueuse/core";

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
</script>
<template>
	<div class="fixed inset-0 flex">
		<div class="flex-1 relative h-full flex flex-col">
			<div class="p-3 flex items-center gap-3 border-b border-neutral-200 bg-neutral-100">
				<NuxtLink v-if="path !== '/'" :to="parentFolder" class="flex items-center gap-1 text-xs">
					<NextIcon class="w-auto h-3 fill-black rotate-180" />
					<div>Back</div>
				</NuxtLink>
				<div class="flex-1 flex items-center border rounded-md border-neutral-200 px-2 py-1.5 text-xs bg-white">
					{{ path}}
				</div>
			</div>
			<div class="flex-1 w-full relative">
				<div class="absolute inset-0 overflow-x-hidden overflow-y-auto p-1.5">
					<div class="grid w-[100vw] max-w-[100vw]" :style="`grid-template-columns: repeat(${columns}, minmax(0, 1fr))`">
						<NuxtLink v-for="folder in folders" :key="folder.path" :to="`${leadingSlash(folder.path)}`" class="cursor-pointer flex flex-col items-center justify-center gap-3 text-xs p-3">
							<div class="w-full relative aspect-square">
								<div v-if="folder.folderPreviews" class="grid gap-1 drop-shadow-lg" :style="`grid-template-columns: repeat(2, minmax(0, 1fr))`">
									<div v-for="preview in folder.folderPreviews" :key="preview.large" class="relative w-full">
										<img v-if="columns <= 3" :key="preview.xl" :src="preview.xl" class="w-full aspect-square object-cover bg-neutral-500" />
										<img v-else :src="preview.large" class="w-full aspect-square object-cover bg-neutral-500" />
										<VideoIcon v-if="preview.mimeType && preview.mimeType.startsWith('video')" class="absolute right-1 bottom-1 w-3 h-auto fill-white" />
									</div>
								</div>
								<FolderIcon v-else class="w-full h-auto" />
							</div>
							<div class="overflow-hidden w-full text-center">
								<div class="max-w-full truncate">{{ folder.name }}</div>
							</div>
						</NuxtLink>
						<div v-for="file in files" :key="file.path" class="cursor-pointer flex flex-col items-center justify-center gap-3 text-xs p-3" @click="copy(file.path)">
							<div class="w-full bg-checkered">
								<div v-if="file.preview" class="relative w-full aspect-square">
									<img v-if="columns <= 2" loading="lazy" :src="file.preview.xl" class="w-full aspect-square object-cover" />
									<img v-else-if="columns <= 4" loading="lazy" :src="file.preview.large" class="w-full aspect-square object-cover" />
									<img v-else :src="file.preview.small" loading="lazy" class="w-full aspect-square object-cover" />
									<VideoIcon v-if="file.mimeType && file.mimeType.startsWith('video')" class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-auto fill-white drop-shadow-sm" />
								</div>
								<div v-else class="w-full h-auto">
									<FileIcon class="w-full h-auto" />
								</div>
							</div>
							<div class="overflow-hidden w-full text-center">
								<div class="max-w-full truncate">{{ file.name }}</div>
							</div>
						</div>
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
	</div>
</template>
<script setup lang="ts">
import {leadingSlash} from "@foxyimg/utils";
import type {File} from "~/types/file";

defineProps<{
	folder: File,
	columns: number,
}>()
</script>
<template>
	<NuxtLink :to="`${leadingSlash(folder.path)}`" class="cursor-pointer flex flex-col items-center justify-center gap-3 text-xs p-3">
		<div class="w-full relative aspect-square">
			<div v-if="folder.folderPreviews" class="grid gap-1 drop-shadow-lg" :style="`grid-template-columns: repeat(2, minmax(0, 1fr))`">
				<div v-for="preview in folder.folderPreviews" :key="preview.large" class="relative w-full">
					<img v-if="columns <= 3" :key="preview.xl" :src="preview.xl" class="w-full aspect-square object-cover bg-neutral-500" />
					<img v-else :src="preview.large" class="w-full aspect-square object-cover bg-neutral-500" />
					<Icon v-if="preview.mimeType && preview.mimeType.startsWith('video')" name="video" class="absolute right-1 bottom-1 w-3 h-auto fill-white" />
				</div>
			</div>
			<Icon v-else name="folder" class="w-full h-auto" />
		</div>
		<div class="overflow-hidden w-full text-center">
			<div class="max-w-full truncate">{{ folder.name }}</div>
		</div>
	</NuxtLink>
</template>
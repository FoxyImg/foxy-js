<script setup lang="ts">
import {leadingSlash} from "@foxyimg/utils";
import type {File, PreviewUrls} from "~/types/file";

const props = defineProps<{
	folder: File,
	previewSize: number,
}>()

const previewImages = computed(() => {
	if (props.folder.folderPreviews) {
		if (props.folder.folderPreviews.length <= 4) {
			return props.folder.folderPreviews;
		}

		const idx1 = Math.floor(props.folder.folderPreviews.length / 3);
		const idx2 = (props.folder.folderPreviews.length - 1) - idx1;

		const previews:PreviewUrls[] = [
			props.folder.folderPreviews[0],
			props.folder.folderPreviews[idx1],
			props.folder.folderPreviews[idx2],
			props.folder.folderPreviews[props.folder.folderPreviews.length - 1],
		];

		return previews;
	}

	return [];
});

const gridStyle = computed(() => {
	if (previewImages.value.length == 1) {
		return `grid-template-columns: repeat(1, minmax(0, 1fr))`;
	} else {
		return `grid-template-columns: repeat(2, minmax(0, 1fr))`;
	}
});

const imageClasses = computed(() => {
	if (previewImages.value.length == 2) {
		return 'aspect-[1/2]';
	} else {
		return 'aspect-square';
	}
});
</script>
<template>
	<NuxtLink :to="`${leadingSlash(folder.path)}`" class="cursor-pointer flex flex-col items-center justify-center gap-3 text-xs p-3">
		<div class="w-full relative aspect-square">
			<template v-if="previewImages.length > 0" >
				<div class="grid gap-1 shadow shadow-black/25 rounded-lg overflow-hidden" :style="gridStyle">
					<div v-for="preview in previewImages" :key="`folder-${folder.path}`" class="relative w-full">
						<img v-if="previewSize <= 64" :key="preview.small" :src="preview.small" class="w-full  object-cover bg-neutral-500" :class="imageClasses" />
						<img v-else-if="previewSize <= 128" :key="preview.large" :src="preview.large" class="w-full object-cover bg-neutral-500" :class="imageClasses" />
						<img v-else :src="preview.xl" :key="preview.xl" class="w-full object-cover bg-neutral-500" :class="imageClasses" />
						<Icon v-if="preview.mimeType && preview.mimeType.startsWith('video')" name="video" class="absolute right-1 bottom-1 w-3 h-auto fill-white" />
					</div>
				</div>
				<div class="absolute left-1 bottom-1 p-2 backdrop-blur-sm bg-white/25 rounded-lg">
					<Icon name="folder" class="w-5 h-auto" />
				</div>
			</template>
			<Icon v-else name="folder" class="w-full h-auto" />
		</div>
		<div class="overflow-hidden w-full text-center">
			<div class="max-w-full truncate">{{ folder.name }}</div>
		</div>
	</NuxtLink>
</template>
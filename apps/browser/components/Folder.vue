<script setup lang="ts">
import {leadingSlash} from "@foxyimg/utils";
import type {File, PreviewUrls} from "~/types/file";
import FolderPreviewImage from "~/components/FolderPreviewImage.vue";

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
		<div class="w-full relative aspect-square flex items-center justify-center">
			<template v-if="previewImages.length > 0" >
				<div class="grid gap-1 shadow shadow-black/25 rounded-lg overflow-hidden w-full" :style="gridStyle">
					<FolderPreviewImage v-for="preview in previewImages" :key="`folder-${folder.path}`" :preview-size="previewSize" :preview :image-classes="imageClasses" />
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
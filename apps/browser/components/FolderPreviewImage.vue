<script setup lang="ts">
import type {PreviewUrls} from "~/types/file";
import {useElementVisibility} from "@vueuse/core";

import FoxyImage from "~/components/FoxyImage.vue";

defineProps<{
	previewSize: number,
	preview: PreviewUrls,
	imageClasses: string,
}>();

const imageRef = ref<HTMLImageElement | null>(null);
const isVisible = useElementVisibility(imageRef);
const wasVisible = ref(isVisible.value);
watch(isVisible, currValue => {
	wasVisible.value = wasVisible.value || currValue;
	if (wasVisible.value) {
		console.log('visible');
	}
});
</script>
<template>
	<div class="relative min-w-full w-full" :class="imageClasses">
		<div ref="imageRef" class="max-h-[0px] h-[0px]"></div>
		<template v-if="wasVisible">
			<FoxyImage v-if="previewSize <= 64" :key="preview.small" :src="preview.small" loading="lazy" class="w-full  object-cover bg-neutral-100" :class="imageClasses" />
			<FoxyImage v-else-if="previewSize <= 128" :key="preview.large" :src="preview.large" loading="lazy" class="w-full object-cover bg-neutral-100" :class="imageClasses" />
			<FoxyImage v-else :src="preview.xl" :key="preview.xl" loading="lazy" class="w-full object-cover bg-neutral-100" :class="imageClasses" />
			<Icon v-if="preview.mimeType && preview.mimeType.startsWith('video')" name="video" class="absolute right-1 bottom-1 w-3 h-auto fill-white" />
		</template>
		<div v-else class="w-full"></div>
	</div>
</template>
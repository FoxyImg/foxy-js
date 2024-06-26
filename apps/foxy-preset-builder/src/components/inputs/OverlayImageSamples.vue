<script setup lang="ts">
import {computed, inject, ref, watch} from "vue";
import {DefaultImageParams} from "@foxy/url-builder";
import { hideAllPoppers } from "floating-vue";
import type {URLBuilder} from "@/types/url-builder";
import {CloseIcon} from "@foxy/vue-ui";

const buildUrl:URLBuilder = inject("buildUrl") as URLBuilder;

const props = defineProps<{
	modelValue: string|null,
	overlayImages: string[],
}>();

const emit = defineEmits<{
	(e: 'update:modelValue', value: string|null): void;
	(e: 'removeOverlayImage', value: string): void;
}>();

const loadedImages = ref<{ [key:string]:string }>({});
watch(() => props.overlayImages, async () => {
	loadedImages.value = {};
	for(const sampleImage of props.overlayImages) {
		buildUrl(sampleImage, {sizing: { crop: ['fit'], width: 256, height: 256}}).then((url) => {
			if (url) {
				loadedImages.value[sampleImage]=url;
			}
		});
	}
}, {immediate: true});

const currentValue = computed({
	get: () => props.modelValue,
	set: (value) => emit('update:modelValue', value),
});

const imageParams = JSON.parse(JSON.stringify(DefaultImageParams));
imageParams.crop = ['fit'];
imageParams.width = 256;
imageParams.height = 256;

function selectImage(image: string) {
	currentValue.value = image;
	hideAllPoppers();
}

</script>
<template>
	<div>
		<div v-if="Object.keys(loadedImages).length === 0" class="px-10 py-5 text-center text-xs">
			No sample images.
		</div>
		<div v-else class="w-[384px] aspect-square relative">
			<div class="absolute inset-0 bg-neutral-100 overflow-y-auto p-1.5">
				<div class="grid grid-cols-3 gap-1">
					<div v-for="(imageUrl, imageKey, index) in loadedImages" :key="index" class="cursor-pointer relative">
						<img :src="imageUrl" @click="selectImage(imageKey as string)">
						<div class="absolute right-1 top-1 rounded-full bg-white/50 backdrop-blur p-1 cursor-pointer" @click="emit('removeOverlayImage', imageKey as string)">
							<CloseIcon class="fill-current w-1.5 h-auto" />
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
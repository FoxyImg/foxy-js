<script setup lang="ts">
import {type URLBuilder} from "@foxyimg/vue-ui";
import SampleImages from "~/data/sample-images.json";
import {useImageParamsStore} from "~/stores/image-params-store";

const hideAllPoppers = inject<() => void>("hideAllPoppers");
const buildUrl = inject("buildUrl") as URLBuilder;
const {
	imageKey,
} = storeToRefs(useImageParamsStore());

const loadedImages = ref<{ [key:string]:string }>({});
for(const sampleImage of SampleImages) {
	buildUrl(sampleImage, {sizing: { crop: ['crop'], width: 256, height: 256}}).then((url) => {
		if (url) {
			loadedImages.value[sampleImage] = url;
		}
	});
}

function selectImage(key:string) {
	imageKey.value = key;
	if (hideAllPoppers) {
		hideAllPoppers();
	}
}
</script>
<template>
	<div>
		<div v-if="SampleImages.length === 0" class="px-10 py-5 text-center text-xs">
			No sample images.
		</div>
		<div v-else class="w-[384px] relative flex flex-col">
			<div class="flex-1 relative aspect-square">
				<div class="absolute inset-0 bg-neutral-100 overflow-y-auto p-1.5">
					<div class="grid grid-cols-3 gap-1">
						<div v-for="(imageUrl, imgKey, index) in loadedImages" :key="index" class="cursor-pointer relative bg-checkered">
							<img :src="imageUrl" @click="selectImage(imgKey as string)" class="cursor-pointer object-contain w-full h-full bg-black/25 aspect-square">
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
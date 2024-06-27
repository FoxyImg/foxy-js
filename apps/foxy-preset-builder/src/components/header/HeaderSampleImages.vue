<script setup lang="ts">
import {computed, inject, ref, watch} from "vue";
import {DefaultImageParams} from "@foxy/url-builder";
import {CloseIcon} from "@foxy/vue-ui";
import {useFileDialog} from "@vueuse/core";
import {buildUrl} from "@/composables/build-url";

const hideAllPoppers = inject<() => void>("hideAllPoppers");

const props = defineProps<{
	host:string,
	accessKey:string|null,
	secret:string,
	modelValue: string|null,
	imgixMode:boolean,
	sampleImages: string[],
}>();


const emit = defineEmits<{
	(e: 'update:modelValue', value: string|null): void;
	(e: 'removeSampleImage', value: string): void;
	(e: 'importSampleImages', value: string[]): void;
}>();

const loadedImages = ref<{ [key:string]:string }>({});
for(const sampleImage of props.sampleImages) {
	buildUrl(sampleImage, {sizing: { crop: ['crop'], width: 256, height: 256}}).then((url) => {
		if (url) {
			loadedImages.value[sampleImage] = url;
		}

		console.log('loadedImages', loadedImages.value);
	});
}

const currentValue = computed({
	get: () => props.modelValue,
	set: (value) => emit('update:modelValue', value),
});

const { files, open } = useFileDialog({
	accept: ".json",
	multiple: false,
});

watch(files, (newFiles:FileList|null) => {
	if (!newFiles || newFiles.length === 0) {
		return;
	}

	const reader = new FileReader();
	reader.onload = (e) => {
		const json = JSON.parse(e.target?.result as string);
		if (Array.isArray(json)) {
			console.log(json);
			emit('importSampleImages', json);
		}
	};
	reader.readAsText(newFiles[0]);
});

const imageParams = JSON.parse(JSON.stringify(DefaultImageParams));
imageParams.crop = ['fill'];
imageParams.width = 256;
imageParams.height = 256;

function selectImage(image: string) {
	currentValue.value = image;
	if (hideAllPoppers) {
		hideAllPoppers();
	}
}

function removeImage(image: string) {
	// props.sampleImages.value = sampleImages.value.filter((i) => i !== image);
	emit('removeSampleImage', image);
}

function exportSampleImages() {
	const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(props.sampleImages));
	const downloadAnchorNode = document.createElement('a');
	downloadAnchorNode.setAttribute("href",     dataStr);
	downloadAnchorNode.setAttribute("download", "samples.json");
	document.body.appendChild(downloadAnchorNode); // required for firefox
	downloadAnchorNode.click();
	downloadAnchorNode.remove();
}
</script>
<template>
<div>
	<div v-if="sampleImages.length === 0" class="px-10 py-5 text-center text-xs">
		No sample images.
	</div>
	<div v-else class="w-[384px] relative flex flex-col">
		<div class="flex-1 relative aspect-square">
			<div class="absolute inset-0 bg-neutral-100 overflow-y-auto p-1.5">
				<div class="grid grid-cols-3 gap-1">
					<div v-for="(imageUrl, imageKey, index) in loadedImages" :key="index" class="cursor-pointer relative bg-checkered">
						<img :src="imageUrl" @click="selectImage(imageKey as string)" class="cursor-pointer object-contain w-full h-full bg-black/25 aspect-square">
						<div class="absolute right-1 top-1 rounded-full bg-white/50 backdrop-blur p-1 cursor-pointer" @click="removeImage(imageKey as string)">
							<CloseIcon class="fill-current w-1.5 h-auto" />
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="flex items-center justify-center gap-3 text-xs p-3">
			<button class="px-2 py-1" type="button" @click="exportSampleImages">Export ...</button>
			<button class="px-2 py-1" type="button" @click="open()">Import ...</button>
		</div>
	</div>
</div>
</template>
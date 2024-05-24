<script setup lang="ts">
import {computed, onMounted, reactive, ref, watch} from "vue";
import pDebounce from 'p-debounce';

import HeaderTextInput from "@/components/header/HeaderTextInput.vue";
import HeaderImageKeyInput from "@/components/header/HeaderImageKeyInput.vue";
import SelectParam from "@/components/editors/SelectParam.vue";
import SliderParam from "@/components/editors/SliderParam.vue";
import VueJsonPretty from 'vue-json-pretty';

import 'vue-json-pretty/lib/styles.css';
import Tabs from "@/components/UI/Tabs.vue";
import Tab from "@/components/UI/Tab.vue";

import {CropOptions, HGravityOptions, InterestingOptions, VGravityOptions} from "@/types/options";
import EditorPanel from "@/components/editors/EditorPanel.vue";
import {useStorage} from "@vueuse/core";
import Icon from "@/components/UI/Icon.vue";
import LoaderFeedback from "@/components/UI/LoaderFeedback.vue";
import useImageLoader from "@/composables/image-loader";
import ToggleParam from "@/components/editors/ToggleParam.vue";
import SmallLabel from "@/components/UI/SmallLabel.vue";
import signHMAC256 from "@/utils/sign";
import TagsParam from "@/components/editors/TagsParam.vue";
import ColorParam from "@/components/editors/ColorParam.vue";
import {DefaultImageParams, type ImageParams} from "@/types/params";
import buildUrl from "@/utils/url-builder";
import SampleImages from "@/data/sample-images.json";

const url = useStorage('foxy_url', 'http://localhost:8080');
const accessKey = useStorage('foxy_access_key', 'c8emk0kejqj8rkpn');
const secret = useStorage('foxy_secret', 'Jxs4mwG6oJXSxDNLE6JWnMieNxBGqSD4');
const imageKey = useStorage('foxy_image_key', 'XXM03026.JPG');

const currentTab = ref<"preview"|"metadata">("preview");

const currentImageUrl = ref<string|null>(null);
const sampleImages = useStorage<string[]>('foxy_sample_images', SampleImages);


onMounted(async () => {
	buildImageUrl();
	await fetchImageMeta();
});

const imageParams = reactive<ImageParams>(JSON.parse(JSON.stringify(DefaultImageParams)));
const imageMeta = ref<any>(null);


const faceCount = computed(() => {
	if (!imageMeta.value) {
		return 0;
	}

	return imageMeta.value.faces.length;
});

const peopleCount = computed(() => {
	if (!imageMeta.value) {
		return 0;
	}

	return imageMeta.value.people.length;
});

async function fetchImageMeta() {
	if (!url.value || !accessKey.value || !secret.value || !imageKey.value) {
		imageMeta.value = null;
		return;
	}

	let encodedKey = btoa('/'+imageKey.value);
	let metaUrl = `/${accessKey.value}/${encodedKey}/meta`;

	const sig = await signHMAC256(secret.value, metaUrl);

	const response = await fetch(url.value + metaUrl + "?s="+sig);
	if (!response.ok) {
		imageMeta.value = null;
		return;
	}

	imageMeta.value = await response.json();
}
const debouncedFetchImageMeta = pDebounce(fetchImageMeta, 500);

function buildImageUrl() {
	if (!url.value || !accessKey.value || !secret.value || !imageKey.value) {
		currentImageUrl.value = null;
		return;
	}

	currentImageUrl.value = buildUrl(url.value, accessKey.value, secret.value, imageKey.value, imageParams);
}

const debouncedBuildImageUrl = pDebounce(buildImageUrl, 500);

watch(imageParams, async () => {
	await debouncedBuildImageUrl();
}, { deep: true });

watch([url, imageKey, secret, accessKey], async () => {
	imageMeta.value = null;
	await debouncedBuildImageUrl();
	await debouncedFetchImageMeta();
}, { deep: true });

const {
	isLoading,
	isLoaded,
	error,
	size,
	loadTime,
} = useImageLoader(currentImageUrl);

watch(isLoaded, () => {
	if (isLoaded.value && currentImageUrl.value) {
		if (!sampleImages.value.includes(imageKey.value)) {
			sampleImages.value.unshift(imageKey.value);
		}
	}
});
</script>
<template>
<div class="fixed inset-0 flex flex-col">
	<div class="p-3 grid grid-cols-4 gap-5">
		<HeaderTextInput label="Foxy URL" v-model="url" />
		<HeaderTextInput label="Access Key" v-model="accessKey" />
		<HeaderTextInput label="Secret" type="password" v-model="secret" />
		<HeaderImageKeyInput label="Image Key" v-model="imageKey" :host="url" :access-key="accessKey" :secret="secret" />
	</div>
	<div class="flex-1 flex">
		<div class="flex-1 flex flex-col">
			<Tabs>
				<Tab v-model="currentTab" value="preview">Preview</Tab>
				<Tab v-if="imageMeta" v-model="currentTab" value="metadata">Metadata</Tab>
			</Tabs>
			<div class="bg-neutral-100 p-0.5"></div>
			<div class="flex-1 relative">
				<template v-if="currentTab === 'preview' || !imageMeta">
					<div class="group absolute left-0 top-0 right-0 bottom-0 flex items-center justify-center preview-area">
						<div v-if="error" class="absolute left-1/2 top-1/2 -translate-x-1/2 flex flex-col items-center justify-center bg-white/15 p-2 rounded-lg backdrop-blur overflow-hidden transform-gpu">
							<Icon name="broken" class="fill-red-600 w-16 h-auto" />
							<div class="font-bold">Oops.</div>
						</div>
						<template v-else-if="currentImageUrl">
							<img
								alt="Preview Image"
								class="max-w-full max-h-full"
								:src="currentImageUrl">
						</template>
						<div v-if="isLoading" class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
							<LoaderFeedback class=""/>
						</div>
					</div>
					<div class="absolute left-0 bottom-0 right-0 flex items-center p-1.5">
						<div class="flex-1 flex items-center justify-start gap-3">
							<div v-if="size.width > 0" class="text-xxs font-bold text-neutral-600 bg-white/50 hover:bg-white backdrop-blur-lg px-1.5 py-0.5 rounded-md">{{size.width}} x {{size.height}}, {{Math.floor(loadTime)}}ms</div>
						</div>
						<div class="flex-1 flex items-center justify-end gap-3 ">
							<div class="cursor-pointer aspect-square rounded-full bg-white/50 hover:bg-white backdrop-blur-lg p-1.5" @click="buildImageUrl">
								<Icon name="reload" class="fill-current w-4 h-auto" />
							</div>
							<div>
								<VDropdown>
									<div class="cursor-pointer aspect-square rounded-full bg-white/50 hover:bg-white backdrop-blur-lg p-1.5">
										<Icon name="debug" class="fill-current w-4 h-auto" />
									</div>
									<template #popper>
										<div class="p-3 rounded-lg bg-neutral-100 flex flex-col gap-3">
										<SmallLabel>Debug Options</SmallLabel>
										<EditorPanel title="Image Recognition" class="w-[400px]">
											<div class="grid grid-cols-2 gap-3">
												<ToggleParam title="Outline Faces" v-model="imageParams.debugFaces" />
												<ToggleParam title="Outline All Faces" v-model="imageParams.debugAllFaces" />
												<ToggleParam title="Outline People" v-model="imageParams.debugPeople" />
												<ToggleParam title="Outline All People" v-model="imageParams.debugAllPeople" />
												<ToggleParam title="Outline Other Labels" v-model="imageParams.debugOtherLabels" />
											</div>
										</EditorPanel>
										<EditorPanel title="Caching" class="w-[400px]">
											<div class="grid grid-cols-2 gap-3">
												<ToggleParam title="Disable Source Cache" v-model="imageParams.disableSourceCache" />
												<ToggleParam title="Disable Meta Cache" v-model="imageParams.disableMetaCache" />
												<ToggleParam title="Disable Render Cache" v-model="imageParams.disableRenderCache" />
											</div>
										</EditorPanel>
										</div>
									</template>
								</VDropdown>
							</div>
							<a v-if="currentImageUrl" :href="currentImageUrl" target="_blank" class="aspect-square rounded-full bg-white/50 hover:bg-white backdrop-blur-lg p-1.5">
								<Icon name="link" class="fill-current w-4 h-auto" />
							</a>
						</div>
					</div>
				</template>
				<template v-else-if="currentTab === 'metadata'">
					<div class="absolute left-0 top-0 right-0 bottom-0 overflow-y-auto px-3 py-1.5">
						<VueJsonPretty :data="imageMeta" :showLineNumber="true" :showIcon="true" :showDoubleQuotes="false" :showLength="true" />
					</div>
				</template>
			</div>
		</div>
		<div class="relative min-w-[400px]">
			<div class="absolute top-0 left-0 w-full h-full overflow-y-auto bg-neutral-100">
				<div class="p-3 flex flex-col gap-5">
					<EditorPanel title="Cropping / Resizing">
						<TagsParam title="Crop Mode" :options="CropOptions" v-model="imageParams.crop" placeholder="Select 1 or more crop modes" />
						<SliderParam v-if="imageParams.crop.includes('face') && faceCount > 0" title="Face Index" v-model="imageParams.faceIndex" :min="-1" :max="faceCount - 1" :step="1" :default="-1" default-label="All Faces" />
						<SliderParam v-if="imageParams.crop.includes('person') && faceCount > 0" title="Person Index" v-model="imageParams.personIndex" :min="-1" :max="peopleCount -1" :step="1" :default="-1" default-label="All People" />
						<SelectParam v-if="imageParams.crop.includes('smart')" title="Smart Crop Mode" v-model="imageParams.smartMode" :default="null" :options="InterestingOptions" />
						<SliderParam title="Width" v-model="imageParams.width" :min="0" :max="3840" :step="1" :default="0" default-label="None" suffix="px" />
						<SliderParam title="Height" v-model="imageParams.height" :min="0" :max="3840" :step="1" :default="0" default-label="None" suffix="px" />
						<SliderParam v-if="imageParams.crop.length > 0" title="Aspect Ratio Width" v-model="imageParams.aspectRatioWidth" :min="0" :max="128" :step="1" :default="0" default-label="None" />
						<SliderParam v-if="imageParams.crop.length > 0" title="Aspect Ratio Height" v-model="imageParams.aspectRatioHeight" :min="0" :max="128" :step="1" :default="0" default-label="None" />
						<SliderParam v-if="imageParams.crop.length > 0" title="Zoom" v-model="imageParams.zoom" :min="1" :max="10" :step="0.01" :default="1" default-label="None" suffix="x" />
						<div v-if="imageParams.crop.includes('fill')" class="grid grid-cols-2 gap-3">
							<SelectParam title="Horizontal Gravity" v-model="imageParams.hGravity" default="center" :allow-null="false" :options="HGravityOptions" />
							<SelectParam title="Vertical Gravity" v-model="imageParams.vGravity" default="center" :allow-null="false" :options="VGravityOptions" />
						</div>
					</EditorPanel>
					<EditorPanel title="Image Attributes">
						<ColorParam title="Background Color" v-model="imageParams.backgroundColor" :default="null" />
					</EditorPanel>
				</div>
			</div>
		</div>
	</div>

</div>
</template>
<style>
.preview-area {
	background-image: url("data:image/svg+xml, %3Csvg%20width=%2216%22%20height=%2216%22%20viewBox=%220%200%2016%2016%22%20fill=%22none%22%20xmlns=%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%3Crect%20width=%228%22%20height=%228%22%20fill=%22%23AEAEAE%22%2F%3E%0A%3Crect%20x=%228%22%20y=%228%22%20width=%228%22%20height=%228%22%20fill=%22%23AEAEAE%22%2F%3E%0A%3Crect%20x=%228%22%20width=%228%22%20height=%228%22%20fill=%22%23D9D9D9%22%2F%3E%0A%3Crect%20y=%228%22%20width=%228%22%20height=%228%22%20fill=%22%23D9D9D9%22%2F%3E%0A%3C%2Fsvg%3E%0A");
}
</style>
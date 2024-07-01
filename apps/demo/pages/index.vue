<script setup lang="ts">
import SampleImages from "@/data/sample-images.json";
import OverlayImages from "@/data/overlay-images.json";
import {buildUrl} from "@/utils/build-url";
import {
	DominantColors, ImageActions,
	ImageInfo,
	ImageSearchIcon,
	JSONViewer, OverlaysEditor, ParamsEditor,
	PreviewImage,
	SmallLabel,
	Tab,
	Tabs,
	useImageLoader
} from "@foxyimg/vue-ui";
import SampleImageSelector from "~/components/ui/SampleImageSelector.vue";
import {useImageParamsStore} from "~/stores/image-params-store";

provide("buildUrl", buildUrl);
const ariaId = useId();

const {
	presets,
	currentPresetId,
	currentPreset,

	currentPresetChanged,
	paramsEditorMode,
	currentImageUrl,

	imageKey,
	imageParams,
	imageMeta,
	currentPresetJSONObject,

	gradientMapPresets,
	fontPresets,

	faceCount,
	peopleCount,
} = storeToRefs(useImageParamsStore());

const {
	buildImageUrl,
	debouncedBuildImageUrl,

	fetchImageMeta,
	debouncedFetchImageMeta,

	fetchCurrentPresetJSONObject,
	debouncedFetchCurrentPresetJSONObject,

	reload,
	resetParams,
} = useImageParamsStore();

const {
	isLoading,
	isLoaded,
	error,
	size,
	loadTime,
} = useImageLoader(currentImageUrl);

const currentTab = ref<"preview"|"metadata"|"preset">("preview");

onMounted(async () => {
	await buildImageUrl();
	await fetchCurrentPresetJSONObject();
	await fetchImageMeta();
});

const previewImage = ref<HTMLImageElement|null>(null);
</script>
<template>
	<div class="fixed inset-0 flex flex-col">
		<div class="px-5 py-3 flex items-center gap-5">
			<img src="/logo.png" class="w-auto max-h-12" />
			<div class="flex-1 flex flex-col gap-1">
				<SmallLabel>Source Image</SmallLabel>
				<div class="flex items-center gap-2">
					<ClientOnly>
						<input type="text" :value="imageKey" disabled class="border border-neutral-200 rounded-md px-2 py-1 text-sm flex-1" />
						<template #fallback>
							<input type="text" disabled class="border border-neutral-200 rounded-md px-2 py-1 text-sm flex-1" />
						</template>
					</ClientOnly>
					<VDropdown :aria-id="ariaId">
						<div class="w-4 aspect-square cursor-pointer"><ImageSearchIcon class="w-auto h-4" /></div>
						<template #popper>
							<SampleImageSelector />
						</template>
					</VDropdown>
				</div>
			</div>
		</div>
		<div class="flex-1 flex">
			<div class="flex-1 flex flex-col">
				<Tabs>
					<Tab v-model="currentTab" value="preview">Preview</Tab>
					<Tab v-if="imageMeta" v-model="currentTab" value="metadata">Metadata</Tab>
					<Tab v-if="currentPresetJSONObject" v-model="currentTab" value="preset">Preset</Tab>
				</Tabs>
				<div class="bg-neutral-100 p-0.5"></div>
				<div class="flex-1 relative flex flex-col border-4 border-t-0 border-neutral-100">
					<template v-if="currentTab === 'preview' || !imageMeta">
						<PreviewImage :current-image-url="currentImageUrl" :error="error" :is-loading="isLoading" class="!absolute left-0 top-0 right-0 bottom-0" v-model="previewImage" />
						<DominantColors :image-meta="imageMeta" :is-loaded="isLoaded" class="absolute left-0 top-0" />
						<div class="absolute left-0 bottom-0 right-0 flex items-center p-1.5">
							<ImageInfo :size="size" :preview-image="previewImage" :load-time="loadTime" :image-meta="imageMeta" :face-count="faceCount" :people-count="peopleCount" :is-loaded="isLoaded" class="flex-1 justify-start" />
							<ImageActions :image-params="imageParams" :current-image-url="currentImageUrl" :current-preset-image-url="null" :show-caching="false" @reload="reload" class="flex-1 justify-end" />
						</div>
					</template>
					<template v-else-if="currentTab === 'metadata'">
						<JSONViewer :json-object="imageMeta" class="absolute left-0 top-0 right-0 bottom-0" />
					</template>
					<template v-else-if="currentTab === 'preset'">
						<JSONViewer :json-object="currentPresetJSONObject" class="absolute left-0 top-0 right-0 bottom-0" />
					</template>
				</div>
			</div>
			<div class="min-w-[400px] flex flex-col border-l-8 border-neutral-200">
				<Tabs>
					<Tab v-model="paramsEditorMode" value="params">Parameters</Tab>
					<Tab v-model="paramsEditorMode" value="overlays">Overlays</Tab>
				</Tabs>
				<div class="flex-1 relative">
					<ParamsEditor
						v-show="paramsEditorMode === 'params'"
						class="absolute top-0 left-0 w-full h-full overflow-y-auto overscroll-contain bg-neutral-100"
						:image-params="imageParams"
						:image-key="imageKey"
						:image-meta="imageMeta"
						:face-count="faceCount"
						:people-count="peopleCount"
						:sample-images="SampleImages"
						:overlay-images="OverlayImages"
						@reset-image-params="resetParams" />
					<OverlaysEditor
						v-show="paramsEditorMode === 'overlays'"
						v-model="imageParams"
						:overlay-images="OverlayImages"
						:image-meta="imageMeta"
						class="absolute top-0 left-0 w-full h-full overflow-y-auto overscroll-contain bg-neutral-100" />
					<div v-show="paramsEditorMode === 'presets'" class="absolute top-0 left-0 w-full h-full overflow-y-auto overscroll-contain bg-neutral-100">
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
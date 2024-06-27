<script setup lang="ts">
import {onMounted, provide, ref, watch} from "vue";
import {storeToRefs} from "pinia";

import {
	Tabs,
	Tab,
	JSONViewer,
	ParamsEditor,
	OverlaysEditor,

	PreviewImage,
	DominantColors,
	ImageInfo,
	ImageActions,

	useImageLoader,
} from "@foxy/vue-ui";

import HeaderImageKeyInput from "@/components/header/HeaderImageKeyInput.vue";
import SourceEditModal from "@/components/modals/SourceEditModal.vue";
import FoxySourceSelector from "@/components/header/FoxySourceSelector.vue";
import FoxyAppSelector from "@/components/header/FoxyAppSelector.vue";
import FoxyAppEditModal from "@/components/modals/FoxyAppEditModal.vue";

import useFoxySourceEditor from "@/composables/foxy-source-editor";
import useFoxyAppEditor from "@/composables/foxy-app-editor";

import {useFoxyAppStore} from "@/stores/foxy-app-store";
import {useImageParamsStore} from "@/stores/image-params-store";
import useFoxyPresetEditor from "@/composables/foxy-preset-editor";
import FoxyPresetSelector from "@/components/header/FoxyPresetSelector.vue";
import FoxyPresetEditModal from "@/components/modals/FoxyPresetEditModal.vue";
import {buildUrl} from "@/composables/build-url";

const {
	apps,
	currentAppId,
	currentApp,
	currentSources,
	currentSourceId,
	currentSource,
	sampleImages,
	imageKey,
	currentPresetId,
	currentPresets,
	currentPresetChanged,
} = storeToRefs(useFoxyAppStore());

const {
	addSampleImage,
	removeSampleImage,
	addOverlayImage,
	removeOverlayImage,
} = useFoxyAppStore();

const {
	imageParams,
	currentImageUrl,
	currentPresetImageUrl,
	imageMeta,
	faceCount,
	peopleCount,
	currentPresetJSONObject,
	paramsEditorMode,
} = storeToRefs(useImageParamsStore());

const {
	buildImageUrl,
	fetchImageMeta,
	fetchCurrentPresetJSONObject,
	reload,
	resetParams
} = useImageParamsStore();

const {
	editingFoxyApp,
	showFoxyAppEditor,
	foxyAppEditorMode,

	newFoxyApp,
	editFoxyApp,
	saveFoxyApp,
	deleteFoxyApp,
} = useFoxyAppEditor();

const {
	editingFoxySource,
	showFoxySourceEditor,
	foxyEditorMode,

	newFoxySource,
	editFoxySource,
	saveFoxySource,
	deleteFoxySource,
} = useFoxySourceEditor();

const {
		foxyPresetName,
		showFoxyPresetEditor,
		foxyPresetEditorMode,

		saveFoxyPreset,
		updateCurrentFoxyPreset,
		editFoxyPreset,
		newFoxyPreset,
		deleteFoxyPreset,
		syncFoxyPresets,
} = useFoxyPresetEditor();

provide("buildUrl", buildUrl);

onMounted(async () => {
	await buildImageUrl();
	await fetchCurrentPresetJSONObject();
	await fetchImageMeta();
});

const currentTab = ref<"preview"|"metadata"|"preset">("preview");

const {
	isLoading,
	isLoaded,
	error,
	size,
	loadTime,
} = useImageLoader(currentImageUrl);

watch(isLoaded, () => {
	if (isLoaded.value && currentImageUrl.value && !error.value && imageKey.value) {
		if (!sampleImages.value.includes(imageKey.value)) {
			sampleImages.value.unshift(imageKey.value);
		}
	}
});

const previewImage = ref<HTMLImageElement|null>(null);
</script>
<template>
	<div class="fixed inset-0 flex flex-col">
		<div class="px-5 py-3 flex items-center gap-5">
			<FoxyAppSelector :apps="apps" v-model="currentAppId" @add-app="newFoxyApp" @edit-app="editFoxyApp" @delete-app="deleteFoxyApp" />
			<FoxySourceSelector v-if="currentApp" :sources="currentSources" v-model="currentSourceId" @new-source="newFoxySource" @edit-source="editFoxySource" @save-source="saveFoxySource" @delete-source="deleteFoxySource" />
			<HeaderImageKeyInput v-if="currentApp && currentSource" class="flex-1" label="Image Key" v-model="imageKey" :host="currentApp?.url" :access-key="currentSource?.key" :secret="currentApp?.signingKey" :imgix-mode="currentSource!.imgixMode" :sample-images="sampleImages" @remove-sample-image="removeSampleImage" @import-sample-images="sampleImages = $event" />
			<FoxyPresetSelector v-if="currentApp && currentSource" :presets="currentPresets" v-model="currentPresetId" :preset-changed="currentPresetChanged" @new-preset="newFoxyPreset" @edit-preset="editFoxyPreset" @delete-preset="deleteFoxyPreset" @sync-presets="syncFoxyPresets" @update-preset="updateCurrentFoxyPreset" />
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
							<ImageActions :image-params="imageParams" :current-image-url="currentImageUrl" :current-preset-image-url="currentPresetImageUrl" @reload="reload" class="flex-1 justify-end" />
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
						:sample-images="currentSource?.sampleImages ?? []"
						:overlay-images="currentSource?.overlayImages ?? []"
						@remove-sample-image="removeSampleImage"
						@add-sample-image="addSampleImage"
						@add-overlay-image="addOverlayImage"
						@remove-overlay-image="removeOverlayImage"
						@reset-image-params="resetParams" />
					<OverlaysEditor
						v-show="paramsEditorMode === 'overlays'"
						v-model="imageParams"
						:overlay-images="currentSource?.overlayImages ?? []"
						:image-meta="imageMeta"
						class="absolute top-0 left-0 w-full h-full overflow-y-auto overscroll-contain bg-neutral-100" />
					<div v-show="paramsEditorMode === 'presets'" class="absolute top-0 left-0 w-full h-full overflow-y-auto overscroll-contain bg-neutral-100">
					</div>
				</div>
			</div>
		</div>
	</div>

	<teleport to="#modals">
		<fade-transition>
			<FoxyAppEditModal v-if="showFoxyAppEditor" v-model="editingFoxyApp" :editing="foxyAppEditorMode === 'edit'" @close="showFoxyAppEditor = false" @save="saveFoxyApp" />
		</fade-transition>
		<fade-transition>
			<SourceEditModal v-if="showFoxySourceEditor" v-model="editingFoxySource" :editing="foxyEditorMode === 'edit'" @close="showFoxySourceEditor = false" @save="saveFoxySource" />
		</fade-transition>
		<fade-transition>
			<FoxyPresetEditModal v-if="showFoxyPresetEditor" v-model="foxyPresetName" :editing="foxyPresetEditorMode === 'edit'" @close="showFoxyPresetEditor = false" @save="saveFoxyPreset" />
		</fade-transition>
	</teleport>
</template>
<style>
</style>
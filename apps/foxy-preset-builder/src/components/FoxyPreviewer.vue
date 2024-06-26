<script setup lang="ts">
import {computed, onMounted, provide, reactive, ref, watch} from "vue";
import {storeToRefs} from "pinia";

import HeaderImageKeyInput from "@/components/header/HeaderImageKeyInput.vue";
import EditorPanel from "@/components/values/EditorPanel.vue";
import {Tabs, Tab} from "@foxy/vue-ui";
import {BrokenIcon, DebugIcon, FaceIcon, PersonIcon, ReloadIcon} from "@foxy/vue-ui";
import {LoaderFeedback} from "@foxy/vue-ui";
import ToggleParam from "@/components/values/ToggleValue.vue";
import {SmallLabel} from "@foxy/vue-ui";
import SourceEditModal from "@/components/modals/SourceEditModal.vue";
import FoxySourceSelector from "@/components/header/FoxySourceSelector.vue";
import StatusInfo from "@/components/UI/StatusInfo.vue";
import FoxyAppSelector from "@/components/header/FoxyAppSelector.vue";
import FoxyAppEditModal from "@/components/modals/FoxyAppEditModal.vue";

import useImageLoader from "@/composables/image-loader";
import useFoxySourceEditor from "@/composables/foxy-source-editor";
import useFoxyAppEditor from "@/composables/foxy-app-editor";

import {useFoxyAppStore} from "@/stores/foxy-app-store";
import {useImageParamsStore} from "@/stores/image-params-store";
import {JSONViewer} from "@foxy/vue-ui";
import useFoxyPresetEditor from "@/composables/foxy-preset-editor";
import FoxyPresetSelector from "@/components/header/FoxyPresetSelector.vue";
import FoxyPresetEditModal from "@/components/modals/FoxyPresetEditModal.vue";
import {ImageLink} from "@foxy/vue-ui";
import ParamsEditor from "@/components/editors/ParamsEditor.vue";
import OverlaysEditor from "@/components/editors/OverlaysEditor.vue";
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
const windowSize = reactive({
	width: 0,
	height: 0,
});

const imageSizeText = computed(() => {
	if (!size.value || size.value.width === 0 || size.value.height === 0 || windowSize.width === 0) {
		return null;
	}

	if (previewImage.value) {
		const scale = Math.floor(((previewImage.value.clientWidth * previewImage.value.clientHeight) / (size.value.width * size.value.height)) * 100.0);
		return `${size.value.width} x ${size.value.height} (${scale}%)`;
	} else {
		return `${size.value.width} x ${size.value.height}`;
	}
});

onMounted(() => {
	windowSize.width = window.innerWidth;
	windowSize.height = window.innerHeight;

	window.addEventListener("resize", () => {
		windowSize.width = window.innerWidth;
		windowSize.height = window.innerHeight;
	});
});
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
						<div class="group absolute left-0 top-0 right-0 bottom-0 flex items-center justify-center bg-checkered">
							<div v-if="error" class="absolute left-1/2 top-1/2 -translate-x-1/2 flex flex-col items-center justify-center bg-white/15 p-2 rounded-lg backdrop-blur overflow-hidden transform-gpu">
								<BrokenIcon class="fill-red-600 w-16 h-auto" />
								<div class="font-bold">Oops.</div>
							</div>
							<template v-else-if="currentImageUrl">
								<img
									alt="Preview Image"
									class="max-w-full max-h-full"
									ref="previewImage"
									:src="currentImageUrl">
							</template>
							<div v-if="isLoading" class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
								<LoaderFeedback class=""/>
							</div>
						</div>
						<div v-if="imageMeta && isLoaded && imageMeta.dominantColors.colors.length > 0" class="absolute left-0 top-0 flex items-center">
							<div class="aspect-square w-3 h-3" :style="`background-color: rgb(${imageMeta.dominantColors.colors[0].r}, ${imageMeta.dominantColors.colors[0].g}, ${imageMeta.dominantColors.colors[0].b})`"></div>
							<div v-if="imageMeta.dominantColors.lightest" class="aspect-square w-3 h-3" :style="`background-color: rgb(${imageMeta.dominantColors.lightest.r}, ${imageMeta.dominantColors.lightest.g}, ${imageMeta.dominantColors.lightest.b})`"></div>
							<div v-if="imageMeta.dominantColors.darkest" class="aspect-square w-3 h-3" :style="`background-color: rgb(${imageMeta.dominantColors.darkest.r}, ${imageMeta.dominantColors.darkest.g}, ${imageMeta.dominantColors.darkest.b})`"></div>
							<div class="w-2"></div>
							<div v-for="color in imageMeta.dominantColors.colors" class="aspect-square w-3 h-3" :style="`background-color: rgb(${color.r}, ${color.g}, ${color.b})`"></div>
						</div>
						<div class="absolute left-0 bottom-0 right-0 flex items-center p-1.5">
							<div class="flex-1 flex items-center justify-start gap-3">
								<StatusInfo v-if="imageSizeText">{{imageSizeText}}, {{Math.floor(loadTime)}}ms</StatusInfo>
								<StatusInfo v-tooltip="`${faceCount} faces found.`" v-if="imageMeta && isLoaded" class="cursor-pointer"><FaceIcon class="fill-black w-3 h-auto" /> {{ faceCount }}</StatusInfo>
								<StatusInfo v-tooltip="`${peopleCount} people found.`" v-if="imageMeta && isLoaded" class="cursor-pointer"><PersonIcon class="fill-black w-3 h-auto"/> {{ peopleCount }}</StatusInfo>
							</div>
							<div class="flex-1 flex items-center justify-end gap-3 ">
								<div class="cursor-pointer aspect-square rounded-full bg-white/50 hover:bg-white backdrop-blur-lg p-1.5" @click="reload">
									<ReloadIcon class="fill-current w-4 h-auto" />
								</div>
								<div>
									<VDropdown>
										<div class="cursor-pointer aspect-square rounded-full bg-white/50 hover:bg-white backdrop-blur-lg p-1.5">
											<DebugIcon class="fill-current w-4 h-auto" />
										</div>
										<template #popper>
											<div class="p-3 rounded-lg bg-neutral-100 flex flex-col gap-3">
											<SmallLabel>Debug Options</SmallLabel>
											<EditorPanel title="Image Recognition" class="w-[400px]" collapse-key="debug-recognition">
												<div class="grid grid-cols-2 gap-3">
													<ToggleParam title="Outline Faces" v-model="imageParams.debug.faces" />
													<ToggleParam title="Outline All Faces" v-model="imageParams.debug.allFaces" />
													<ToggleParam title="Outline People" v-model="imageParams.debug.people" />
													<ToggleParam title="Outline All People" v-model="imageParams.debug.allPeople" />
													<ToggleParam title="Outline Other Labels" v-model="imageParams.debug.otherLabels" />
												</div>
											</EditorPanel>
											<EditorPanel title="Caching" class="w-[400px]" collapse-key="debug-caching">
												<div class="grid grid-cols-2 gap-3">
													<ToggleParam title="Disable Source Cache" v-model="imageParams.debug.disableSourceCache" />
													<ToggleParam title="Disable Meta Cache" v-model="imageParams.debug.disableMetaCache" />
													<ToggleParam title="Disable Render Cache" v-model="imageParams.debug.disableRenderCache" />
												</div>
											</EditorPanel>
											</div>
										</template>
									</VDropdown>
								</div>
								<ImageLink v-if="currentImageUrl" :image-url="currentImageUrl" action-title="Copy Image URL" icon-name="link" />
								<ImageLink v-if="currentPresetImageUrl" :image-url="currentPresetImageUrl" action-title="Copy Preset Image URL" icon-name="bookmark" />
							</div>
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
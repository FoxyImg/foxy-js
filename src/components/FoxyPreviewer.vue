<script setup lang="ts">
import {computed, onMounted, ref, watch} from "vue";
import copy from "copy-to-clipboard";
import {storeToRefs} from "pinia";
import {useStorage} from "@vueuse/core";

import HeaderImageKeyInput from "@/components/header/HeaderImageKeyInput.vue";
import SelectParam from "@/components/editors/SelectParam.vue";
import SliderParam from "@/components/editors/SliderParam.vue";
import EditorPanel from "@/components/editors/EditorPanel.vue";
import Tabs from "@/components/UI/Tabs.vue";
import Tab from "@/components/UI/Tab.vue";
import Icon from "@/components/UI/Icon.vue";
import LoaderFeedback from "@/components/UI/LoaderFeedback.vue";
import ToggleParam from "@/components/editors/ToggleParam.vue";
import SmallLabel from "@/components/UI/SmallLabel.vue";
import TagsParam from "@/components/editors/TagsParam.vue";
import ColorParam from "@/components/editors/ColorParam.vue";
import ObjectSelectParam from "@/components/editors/ObjectSelectParam.vue";
import SourceEditModal from "@/components/modals/SourceEditModal.vue";
import FoxySourceSelector from "@/components/header/FoxySourceSelector.vue";
import StatusInfo from "@/components/UI/StatusInfo.vue";
import FocalPointParam from "@/components/editors/FocalPointParam.vue";
import FoxyAppSelector from "@/components/header/FoxyAppSelector.vue";
import FoxyAppEditModal from "@/components/modals/FoxyAppEditModal.vue";

import {CropOptions, HGravityOptions, InterestingOptions, VGravityOptions} from "@/types/options";

import useImageLoader from "@/composables/image-loader";
import useFoxySourceEditor from "@/composables/foxy-source-editor";
import useFoxyAppEditor from "@/composables/foxy-app-editor";

import {useFoxyAppStore} from "@/stores/foxy-app-store";
import {useImageParamsStore} from "@/stores/image-params-store";
import JSONViewer from "@/components/UI/JSONViewer.vue";
import useFoxyPresetEditor from "@/composables/foxy-preset-editor";
import FoxyPresetSelector from "@/components/header/FoxyPresetSelector.vue";
import FoxyPresetEditModal from "@/components/modals/FoxyPresetEditModal.vue";
import ImageLink from "@/components/UI/ImageLink.vue";

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
	currentPreset,
	currentPresetChanged,
} = storeToRefs(useFoxyAppStore());

const {
	removeSampleImage
} = useFoxyAppStore();

const {
	currentImageUrl,
	currentPresetImageUrl,
	imageParams,
	debugParams,
	imageMeta,
	faceCount,
	peopleCount,
	currentPresetJSONObject,
} = storeToRefs(useImageParamsStore());

const {
	buildImageUrl,
	fetchImageMeta,
	fetchCurrentPresetJSONObject,
	reload,
	resetParams,
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

onMounted(async () => {
	buildImageUrl();
	await fetchCurrentPresetJSONObject();
	await fetchImageMeta();
});

const currentTab = ref<"preview"|"metadata"|"preset">("preview");
const constrainDimensions = useStorage('foxy_constrain_dimensions', false);

watch(() => [imageParams.value.width, imageParams.value.height], (newVal, oldVal) => {
	if (!constrainDimensions.value) {
		return;
	}

	if (oldVal[0] !== newVal[0]) {
		if (imageParams.value.height !== newVal[0]) {
			imageParams.value.height = newVal[0];
		}
	} else if (oldVal[1] !== newVal[1]) {
		if (imageParams.value.width !== newVal[1]) {
			imageParams.value.width = newVal[1];
		}
	}
});

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

const personOptions = computed(() => {
	const options = [
		{ label: 'Smallest Person', value: -3 },
		{ label: 'Largest Person', value: -2 },
		{ label: 'All People', value: -1 },
	];

	if (imageMeta.value) {
		options.push(...imageMeta.value.people.map((person:any, index:number) => ({
			label: `Person ${index + 1} - ${person.name}`,
			value: index,
		})));
	}

	return options;
});

const faceOptions = computed(() => {
	const options = [
		{ label: 'Smallest Face', value: -3 },
		{ label: 'Largest Face', value: -2 },
		{ label: 'All Faces', value: -1 },
	];

	if (imageMeta.value) {
		options.push(...imageMeta.value.faces.map((face:any, index:number) => ({
			label: `Face #${index + 1}`,
			value: index,
		})));
	}

	return options;
});
</script>
<template>
	<div class="fixed inset-0 flex flex-col">
		<div class="p-3 flex items-center gap-3">
			<FoxyAppSelector :apps="apps" v-model="currentAppId" @add-app="newFoxyApp" @edit-app="editFoxyApp" @delete-app="deleteFoxyApp" />
			<FoxySourceSelector :sources="currentSources" v-model="currentSourceId" @new-source="newFoxySource" @edit-source="editFoxySource" @save-source="saveFoxySource" @delete-source="deleteFoxySource" />
			<HeaderImageKeyInput class="flex-1" label="Image Key" v-model="imageKey" :host="currentApp?.url" :access-key="currentSource?.key" :secret="currentApp?.secret" :sample-images="sampleImages" @remove-sample-image="removeSampleImage" />
			<FoxyPresetSelector :presets="currentPresets" v-model="currentPresetId" :preset-changed="currentPresetChanged" @new-preset="newFoxyPreset" @edit-preset="editFoxyPreset" @delete-preset="deleteFoxyPreset" @sync-presets="syncFoxyPresets" @update-preset="updateCurrentFoxyPreset" />
		</div>
		<div class="flex-1 flex">
			<div class="flex-1 flex flex-col">
				<Tabs>
					<Tab v-model="currentTab" value="preview">Preview</Tab>
					<Tab v-if="imageMeta" v-model="currentTab" value="metadata">Metadata</Tab>
					<Tab v-if="currentPresetJSONObject" v-model="currentTab" value="preset">Preset</Tab>
				</Tabs>
				<div class="bg-neutral-100 p-0.5"></div>
				<div class="flex-1 relative flex flex-col">
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
								<StatusInfo v-if="size.width > 0">{{size.width}} x {{size.height}}, {{Math.floor(loadTime)}}ms</StatusInfo>
								<StatusInfo v-tooltip="`${faceCount} faces found.`" v-if="imageMeta && isLoaded" class="cursor-pointer"><Icon name="face" class="fill-black w-3 h-auto" /> {{ faceCount }}</StatusInfo>
								<StatusInfo v-tooltip="`${peopleCount} people found.`" v-if="imageMeta && isLoaded" class="cursor-pointer"><Icon name="person" class="fill-black w-3 h-auto"/> {{ peopleCount }}</StatusInfo>
							</div>
							<div class="flex-1 flex items-center justify-end gap-3 ">
								<div class="cursor-pointer aspect-square rounded-full bg-white/50 hover:bg-white backdrop-blur-lg p-1.5" @click="reload">
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
													<ToggleParam title="Outline Faces" v-model="debugParams.faces" />
													<ToggleParam title="Outline All Faces" v-model="debugParams.allFaces" />
													<ToggleParam title="Outline People" v-model="debugParams.people" />
													<ToggleParam title="Outline All People" v-model="debugParams.allPeople" />
													<ToggleParam title="Outline Other Labels" v-model="debugParams.otherLabels" />
												</div>
											</EditorPanel>
											<EditorPanel title="Caching" class="w-[400px]">
												<div class="grid grid-cols-2 gap-3">
													<ToggleParam title="Disable Source Cache" v-model="debugParams.disableSourceCache" />
													<ToggleParam title="Disable Meta Cache" v-model="debugParams.disableMetaCache" />
													<ToggleParam title="Disable Render Cache" v-model="debugParams.disableRenderCache" />
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
			<div class="relative min-w-[400px]">
				<div class="absolute top-0 left-0 w-full h-full overflow-y-auto overscroll-contain bg-neutral-100">
					<div class="p-3 flex flex-col gap-5">
						<EditorPanel title="Cropping / Resizing">
							<TagsParam title="Crop Mode" :options="CropOptions" v-model="imageParams.crop" placeholder="Select 1 or more crop modes" />
							<SelectParam v-if="imageParams.crop.includes('smart')" title="Smart Crop Mode" v-model="imageParams.smartMode" :default="null" :options="InterestingOptions" />
							<div class="flex items-center gap-1">
								<div class="flex-1 flex flex-col gap-3">
									<SliderParam title="Width" v-model="imageParams.width" :min="0" :max="3840" :step="1" :default="0" default-label="None" suffix="px" />
									<SliderParam title="Height" v-model="imageParams.height" :min="0" :max="3840" :step="1" :default="0" default-label="None" suffix="px" />
								</div>
								<div class="flex flex-col items-center justify-center gap-1">
									<Icon name="contrain-line" class="w-3 h-auto stroke-neutral-500" />
									<div class="cursor-pointer border border-neutral-300 rounded-lg p-1" :class="{'bg-neutral-300': constrainDimensions}" @click="constrainDimensions = !constrainDimensions">
										<Icon name="constrain" class="fill-black w-3 h-auto" />
									</div>
									<Icon name="contrain-line" class="w-3 h-auto stroke-neutral-500 rotate-180 -scale-x-100" />
								</div>
							</div>
							<SliderParam v-if="imageParams.crop.length > 0" title="Aspect Ratio Width" v-model="imageParams.aspectRatioWidth" :min="0" :max="128" :step="1" :default="0" default-label="None" />
							<SliderParam v-if="imageParams.crop.length > 0" title="Aspect Ratio Height" v-model="imageParams.aspectRatioHeight" :min="0" :max="128" :step="1" :default="0" default-label="None" />
							<SliderParam v-if="imageParams.crop.length > 0" title="Zoom" v-model="imageParams.zoom" :min="1" :max="10" :step="0.01" :default="1" default-label="None" suffix="x" />
							<div v-if="imageParams.crop.includes('crop')" class="grid grid-cols-2 gap-3">
								<SelectParam title="Horizontal Gravity" v-model="imageParams.hGravity" default="center" :allow-null="false" :options="HGravityOptions" />
								<SelectParam title="Vertical Gravity" v-model="imageParams.vGravity" default="center" :allow-null="false" :options="VGravityOptions" />
							</div>
						</EditorPanel>
						<EditorPanel v-if="imageParams.crop.includes('focus') && imageKey" title="Focal Point">
							<FocalPointParam v-model="imageParams.focalPoint"/>
							<SliderParam title="Focal Point Zoom" v-model="imageParams.focalPointZoom" :min="0" :max="200" :step="1" :default="0" suffix="%" />
						</EditorPanel>
						<EditorPanel v-if="imageParams.crop.includes('face') && faceCount > 0" title="Face Crop Options">
							<ObjectSelectParam title="Face Index" v-model="imageParams.face.index" :default="-1" :allow-null="false" :options="faceOptions" />
							<SliderParam title="Face Padding" v-model="imageParams.face.padding" :min="0" :max="256" :step="1" :default="8" suffix="px" />
							<SliderParam title="Face Zoom" v-model="imageParams.face.zoom" :min="0" :max="200" :step="1" :default="0" suffix="%" />
							<div class="grid grid-cols-2 gap-3">
								<SelectParam title="Face Horizontal Gravity" v-model="imageParams.face.hGravity" default="center" :allow-null="false" :options="HGravityOptions" />
								<SelectParam title="Face Vertical Gravity" v-model="imageParams.face.vGravity" default="top" :allow-null="false" :options="VGravityOptions" />
							</div>
							<ToggleParam title="Focus Face" v-model="imageParams.face.focus" />
						</EditorPanel>
						<EditorPanel v-if="imageParams.crop.includes('person') && peopleCount > 0" title="Person Crop Options">
							<ObjectSelectParam title="Person Index" v-model="imageParams.person.index" :default="-1" :allow-null="false" :options="personOptions" />
							<SliderParam title="Person Padding" v-model="imageParams.person.padding" :min="0" :max="256" :step="1" :default="0" suffix="px" />
							<SliderParam title="Person Zoom" v-model="imageParams.person.zoom" :min="0" :max="200" :step="1" :default="0" suffix="%" />
							<div class="grid grid-cols-2 gap-3">
								<SelectParam title="Person Horiz. Gravity" v-model="imageParams.person.hGravity" default="center" :allow-null="false" :options="HGravityOptions" />
								<SelectParam title="Person Vertical Gravity" v-model="imageParams.person.vGravity" default="center" :allow-null="false" :options="VGravityOptions" />
							</div>
						</EditorPanel>
						<EditorPanel title="Image Attributes">
							<ColorParam title="Background Color" v-model="imageParams.backgroundColor" :default="null" />
						</EditorPanel>
						<EditorPanel>
							<div class="flex items-center justify-center">
								<div @click="resetParams" class="cursor-pointer text-xs hover:text-blue-900">Reset All</div>
							</div>
						</EditorPanel>
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
.preview-area {
	background-image: url("data:image/svg+xml, %3Csvg%20width=%2216%22%20height=%2216%22%20viewBox=%220%200%2016%2016%22%20fill=%22none%22%20xmlns=%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%3Crect%20width=%228%22%20height=%228%22%20fill=%22%23AEAEAE%22%2F%3E%0A%3Crect%20x=%228%22%20y=%228%22%20width=%228%22%20height=%228%22%20fill=%22%23AEAEAE%22%2F%3E%0A%3Crect%20x=%228%22%20width=%228%22%20height=%228%22%20fill=%22%23D9D9D9%22%2F%3E%0A%3Crect%20y=%228%22%20width=%228%22%20height=%228%22%20fill=%22%23D9D9D9%22%2F%3E%0A%3C%2Fsvg%3E%0A");
}
</style>
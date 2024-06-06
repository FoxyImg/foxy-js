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
import RedactRegionParam from "@/components/editors/RedactRegionParam.vue";
import {
	BlendModeOptions,
	BlendModes,
	DefaultImageParams,
	ExportFormatOptions,
	RotationModeOptions,
	StylizeOrderOptions, WatermarkRotationOptions, WatermarkTypeOptions
} from "@/types/params";
import GradientMapParam from "@/components/editors/GradientMapParam.vue";
import TextParam from "@/components/editors/TextParam.vue";
import FontParam from "@/components/editors/FontParam.vue";
import WatermarkImageParam from "@/components/editors/WatermarkImageParam.vue";

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
	paramsEditorMode,
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
const constrainPadding = useStorage('foxy_constrain_padding', true);
const constrainBorder = useStorage('foxy_constrain_border', true);
const constrainWatermarkPadding = useStorage('foxy_constrain_watermark_padding', true);

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

watch(() => [imageParams.value.watermark.hPadding, imageParams.value.watermark.vPadding], (newVal, oldVal) => {
	if (!constrainWatermarkPadding.value) {
		return;
	}

	if (oldVal[0] !== newVal[0]) {
		if (imageParams.value.watermark.vPadding !== newVal[0]) {
			imageParams.value.watermark.vPadding = newVal[0];
		}
	} else if (oldVal[1] !== newVal[1]) {
		if (imageParams.value.watermark.hPadding !== newVal[1]) {
			imageParams.value.watermark.hPadding = newVal[1];
		}
	}
});

watch(() => [imageParams.value.padding.top, imageParams.value.padding.left, imageParams.value.padding.right, imageParams.value.padding.bottom], (newVal, oldVal) => {
	if (!constrainPadding.value) {
		return;
	}

	if (oldVal[0] !== newVal[0]) {
		imageParams.value.padding.left = newVal[0];
		imageParams.value.padding.right = newVal[0];
		imageParams.value.padding.bottom = newVal[0];
	} else if (oldVal[1] !== newVal[1]) {
		imageParams.value.padding.top = newVal[1];
		imageParams.value.padding.right = newVal[1];
		imageParams.value.padding.bottom = newVal[1];
	} else if (oldVal[2] !== newVal[2]) {
		imageParams.value.padding.top = newVal[2];
		imageParams.value.padding.left = newVal[2];
		imageParams.value.padding.bottom = newVal[2];
	} else if (oldVal[3] !== newVal[3]) {
		imageParams.value.padding.top = newVal[3];
		imageParams.value.padding.left = newVal[3];
		imageParams.value.padding.right = newVal[3];
	}
});

watch(() => [imageParams.value.border.top, imageParams.value.border.left, imageParams.value.border.right, imageParams.value.border.bottom], (newVal, oldVal) => {
	if (!constrainBorder.value) {
		return;
	}

	if (oldVal[0] !== newVal[0]) {
		imageParams.value.border.left = newVal[0];
		imageParams.value.border.right = newVal[0];
		imageParams.value.border.bottom = newVal[0];
	} else if (oldVal[1] !== newVal[1]) {
		imageParams.value.border.top = newVal[1];
		imageParams.value.border.right = newVal[1];
		imageParams.value.border.bottom = newVal[1];
	} else if (oldVal[2] !== newVal[2]) {
		imageParams.value.border.top = newVal[2];
		imageParams.value.border.left = newVal[2];
		imageParams.value.border.bottom = newVal[2];
	} else if (oldVal[3] !== newVal[3]) {
		imageParams.value.border.top = newVal[3];
		imageParams.value.border.left = newVal[3];
		imageParams.value.border.right = newVal[3];
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

	if (imageMeta.value && imageMeta.value.people && imageMeta.value.people.length > 0) {
		options.push(...imageMeta.value.people.map((person:any, index:number) => ({
			label: `Person ${index + 1} - ${person.name}`,
			value: index,
		})));
	}

	return options;
});

const redactPersonOptions = computed(() => {
	const options = [
		{ label: 'All People', value: 'all' },
	];

	if (imageMeta.value && imageMeta.value.people && imageMeta.value.people.length > 0) {
		options.push(...imageMeta.value.people.map((person:any, index:number) => ({
			label: `Person ${index + 1} - ${person.name}`,
			value: `${index}`,
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

	if (imageMeta.value && imageMeta.value.faces && imageMeta.value.faces.length > 0) {
		options.push(...imageMeta.value.faces.map((face:any, index:number) => ({
			label: `Face #${index + 1}`,
			value: index,
		})));
	}

	return options;
});

const redactFaceOptions = computed(() => {
	const options = [
		{ label: 'All Faces', value: "all" },
	];

	if (imageMeta.value && imageMeta.value.faces && imageMeta.value.faces.length > 0) {
		options.push(...imageMeta.value.faces.map((face:any, index:number) => ({
			label: `Face #${index + 1}`,
			value: `${index}`,
		})));
	}

	return options;
});
</script>
<template>
	<div class="fixed inset-0 flex flex-col">
		<div class="px-5 py-3 flex items-center gap-5">
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
				<div class="flex-1 relative flex flex-col border-4 border-t-0 border-neutral-100">
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
											<EditorPanel title="Image Recognition" class="w-[400px]" collapse-key="debug-recognition">
												<div class="grid grid-cols-2 gap-3">
													<ToggleParam title="Outline Faces" v-model="debugParams.faces" />
													<ToggleParam title="Outline All Faces" v-model="debugParams.allFaces" />
													<ToggleParam title="Outline People" v-model="debugParams.people" />
													<ToggleParam title="Outline All People" v-model="debugParams.allPeople" />
													<ToggleParam title="Outline Other Labels" v-model="debugParams.otherLabels" />
												</div>
											</EditorPanel>
											<EditorPanel title="Caching" class="w-[400px]" collapse-key="debug-caching">
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
			<div class="min-w-[400px] flex flex-col border-l-8 border-neutral-200">
				<Tabs>
					<Tab v-model="paramsEditorMode" value="params">Parameters</Tab>
					<Tab v-if="error && size === 666" v-model="paramsEditorMode" value="presets">Presets</Tab>
				</Tabs>
				<div class="flex-1 relative">
					<div v-show="paramsEditorMode === 'params'" class="absolute top-0 left-0 w-full h-full overflow-y-auto overscroll-contain bg-neutral-100">
						<div class="p-3 flex flex-col gap-3">
							<EditorPanel title="Cropping / Resizing" collapse-key="crop-editor" v-model="imageParams.enableCrop" :show-toggle="true" :disabled="!imageParams.enableCrop">
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
							<EditorPanel v-if="imageParams.crop.includes('focus') && imageKey" collapse-key="focal-point-editor" title="Focal Point"  :disabled="!imageParams.enableCrop">
								<FocalPointParam v-model="imageParams.focalPoint"/>
								<SliderParam title="Focal Point Zoom" v-model="imageParams.focalPointZoom" :min="0" :max="200" :step="1" :default="0" suffix="%" />
							</EditorPanel>
							<EditorPanel v-if="imageParams.crop.includes('face') && faceCount > 0" title="Face Crop Options" collapse-key="face-crop-options"  :disabled="!imageParams.enableCrop">
								<ObjectSelectParam title="Face Index" v-model="imageParams.face.index" :default="-1" :allow-null="false" :options="faceOptions" />
								<SliderParam title="Face Padding" v-model="imageParams.face.padding" :min="0" :max="256" :step="1" :default="8" suffix="px" />
								<SliderParam title="Face Zoom" v-model="imageParams.face.zoom" :min="0" :max="200" :step="1" :default="0" suffix="%" />
								<div class="grid grid-cols-2 gap-3">
									<SelectParam title="Face Horizontal Gravity" v-model="imageParams.face.hGravity" default="center" :allow-null="false" :options="HGravityOptions" />
									<SelectParam title="Face Vertical Gravity" v-model="imageParams.face.vGravity" default="top" :allow-null="false" :options="VGravityOptions" />
								</div>
								<ToggleParam title="Focus Face" v-model="imageParams.face.focus" />
							</EditorPanel>
							<EditorPanel v-if="imageParams.crop.includes('person') && peopleCount > 0" title="Person Crop Options" collapse-key="person-crop-options"  :disabled="!imageParams.enableCrop">
								<ObjectSelectParam title="Person Index" v-model="imageParams.person.index" :default="-1" :allow-null="false" :options="personOptions" />
								<SliderParam title="Person Padding" v-model="imageParams.person.padding" :min="0" :max="256" :step="1" :default="0" suffix="px" />
								<SliderParam title="Person Zoom" v-model="imageParams.person.zoom" :min="0" :max="200" :step="1" :default="0" suffix="%" />
								<div class="grid grid-cols-2 gap-3">
									<SelectParam title="Person Horiz. Gravity" v-model="imageParams.person.hGravity" default="center" :allow-null="false" :options="HGravityOptions" />
									<SelectParam title="Person Vertical Gravity" v-model="imageParams.person.vGravity" default="center" :allow-null="false" :options="VGravityOptions" />
								</div>
							</EditorPanel>
							<EditorPanel title="Image Attributes" collapse-key="image-attributes">
								<ColorParam title="Background Color" v-model="imageParams.backgroundColor" :default="null" />
							</EditorPanel>
							<EditorPanel title="Rotation" collapse-key="rotation-editor" v-model="imageParams.enabledRotation" :show-toggle="true" :disabled="!imageParams.enabledRotation">
								<SliderParam title="Rotation" v-model="imageParams.rotation.rotation" :min="0" :max="360" :step="1" :default="0" suffix="°" />
								<ObjectSelectParam title="Rotation Mode" v-model="imageParams.rotation.mode" :default="0" :allow-null="false" :options="RotationModeOptions" />
							</EditorPanel>
							<EditorPanel title="Adjustments" collapse-key="adjustments-editor"  v-model="imageParams.enableAdjustments" :show-toggle="true" :disabled="!imageParams.enableAdjustments">
								<SliderParam title="Brightness" v-model="imageParams.adjustments.brightness" :min="0" :max="200" :step="1" :default="100" suffix="%" />
								<SliderParam title="Saturation" v-model="imageParams.adjustments.saturation" :min="0" :max="200" :step="1" :default="100" suffix="%" />
								<SliderParam title="Vibrance" v-model="imageParams.adjustments.vibrance" :min="0" :max="100" :step="1" :default="0" default-label="None" />
								<SliderParam title="Contrast" v-model="imageParams.adjustments.contrast" :min="0" :max="3" :step="0.01" :default="1" />
								<SliderParam title="Exposure" v-model="imageParams.adjustments.exposure" :min="-3" :max="3" :step="0.01" :default="0" />
								<SliderParam title="Gamma" v-model="imageParams.adjustments.gamma" :min="0.01" :max="10" :step="0.01" :default="1" />
								<SliderParam title="Texture" v-model="imageParams.adjustments.texture" :min="0" :max="50" :step="0.1" :default="0" default-label="None" />
								<SliderParam title="Texture Density" v-model="imageParams.adjustments.textureDensity" :min="0" :max="100" :step="1" :default="100" suffix="%" />
								<SliderParam title="Hue" v-model="imageParams.adjustments.hue" :min="-360" :max="360" :step="1" :default="0" suffix="°" />
								<ToggleParam title="Invert" v-model="imageParams.adjustments.invert" />
							</EditorPanel>
							<EditorPanel title="Stylize" collapse-key="stylize-editor"  v-model="imageParams.enableStylize" :show-toggle="true" :disabled="!imageParams.enableStylize">
								<TagsParam title="Stylize Order" :options="StylizeOrderOptions" v-model="imageParams.stylize.order" placeholder="Order to process stylize operations" />
								<SliderParam title="Blur" v-model="imageParams.stylize.blur" :min="0" :max="512" :step="1" :default="0" default-label="None" suffix="px" />
								<SliderParam title="Pixelate" v-model="imageParams.stylize.pixelate" :min="0" :max="512" :step="1" :default="0" default-label="None" suffix="px" />
							</EditorPanel>
							<EditorPanel title="Gradient Map" collapse-key="gradient-map-editor"  v-model="imageParams.enableGradientMap" :show-toggle="true" :disabled="!imageParams.enableGradientMap">
								<GradientMapParam title="Gradient Map" :default="DefaultImageParams.gradientMap.stops" v-model="imageParams.gradientMap.stops" :enabled="imageParams.gradientMap.opacity > 0" />
								<SliderParam title="Gradient Map Opacity" v-model="imageParams.gradientMap.opacity" :min="0" :max="100" :step="1" :default="0" default-label="Disabled" suffix="%" />
								<ObjectSelectParam title="Gradient Map Mode" v-model="imageParams.gradientMap.blendMode" :default="BlendModes.BlendModeOver" :allow-null="false" :options="BlendModeOptions" />
								<SliderParam title="Blur" v-model="imageParams.gradientMap.blur" :min="0" :max="320" :step="1" :default="0" default-label="None" suffix="px" />
								<ToggleParam title="Map Monochrome Image" v-model="imageParams.gradientMap.monochrome" />
							</EditorPanel>
							<EditorPanel title="Padding" collapse-key="padding-editor"  v-model="imageParams.enablePadding" :show-toggle="true" :disabled="!imageParams.enablePadding">
								<ColorParam title="Padding Color" v-model="imageParams.padding.color" :default="null" />
								<div class="flex items-center gap-1">
									<div class="flex-1 flex flex-col gap-3">
										<SliderParam title="Top Padding" v-model="imageParams.padding.top" :min="0" :max="512" :step="1" :default="0" default-label="None" suffix="px" />
										<SliderParam title="Right Padding" v-model="imageParams.padding.right" :min="0" :max="512" :step="1" :default="0" default-label="None" suffix="px" />
										<SliderParam title="Bottom Padding" v-model="imageParams.padding.bottom" :min="0" :max="512" :step="1" :default="0" default-label="None" suffix="px" />
										<SliderParam title="Left Padding" v-model="imageParams.padding.left" :min="0" :max="512" :step="1" :default="0" default-label="None" suffix="px" />
									</div>
									<div class="flex flex-col items-center justify-center gap-[8px]">
										<Icon name="constraint-line-long" class="w-[11px] h-auto stroke-neutral-300" />
										<div class="cursor-pointer border border-neutral-300 rounded-lg p-1" :class="{'bg-neutral-300': constrainPadding}" @click="constrainPadding = !constrainPadding">
											<Icon name="constrain" class="fill-black w-3 h-auto" />
										</div>
										<Icon name="constraint-line-long" class="w-[11px] h-auto stroke-neutral-300 rotate-180 -scale-x-100" />
									</div>
								</div>
							</EditorPanel>
							<EditorPanel title="Border" collapse-key="border-editor" v-model="imageParams.enableBorder" :show-toggle="true" :disabled="!imageParams.enableBorder">
								<ColorParam title="Border Color" v-model="imageParams.border.color" :default="null" />
								<div class="flex items-center gap-1">
									<div class="flex-1 flex flex-col gap-3">
										<SliderParam title="Top Border" v-model="imageParams.border.top" :min="0" :max="512" :step="1" :default="0" default-label="None" suffix="px" />
										<SliderParam title="Right Border" v-model="imageParams.border.right" :min="0" :max="512" :step="1" :default="0" default-label="None" suffix="px" />
										<SliderParam title="Bottom Border" v-model="imageParams.border.bottom" :min="0" :max="512" :step="1" :default="0" default-label="None" suffix="px" />
										<SliderParam title="Left Border" v-model="imageParams.border.left" :min="0" :max="512" :step="1" :default="0" default-label="None" suffix="px" />
									</div>
									<div class="flex flex-col items-center justify-center gap-[8px]">
										<Icon name="constraint-line-long" class="w-[11px] h-auto stroke-neutral-300" />
										<div class="cursor-pointer border border-neutral-300 rounded-lg p-1" :class="{'bg-neutral-300': constrainBorder}" @click="constrainBorder = !constrainBorder">
											<Icon name="constrain" class="fill-black w-3 h-auto" />
										</div>
										<Icon name="constraint-line-long" class="w-[11px] h-auto stroke-neutral-300 rotate-180 -scale-x-100" />
									</div>
								</div>
							</EditorPanel>
							<EditorPanel title="Watermark" collapse-key="watermark-editor" v-model="imageParams.enabledWatermark" :show-toggle="true" :disabled="!imageParams.enabledWatermark">
								<ObjectSelectParam title="Watermark Type" v-model="imageParams.watermark.type" default="text" :allow-null="false" :options="WatermarkTypeOptions" />
								<TextParam v-if="imageParams.watermark.type === 'text'" title="Watermark Text" default="" v-model="imageParams.watermark.text" />
								<FontParam v-if="imageParams.watermark.type === 'text'" title="Watermark Font" default="" v-model="imageParams.watermark.font" />
								<ColorParam v-if="imageParams.watermark.type === 'text'" title="Color" v-model="imageParams.watermark.color" default="#FFFFFF" />
								<WatermarkImageParam v-if="imageParams.watermark.type === 'image'" title="Watermark Image Key" default="" v-model="imageParams.watermark.imageKey" />
								<div class="grid grid-cols-2 gap-3">
									<SelectParam title="Horizontal Align" v-model="imageParams.watermark.hAlign" default="right" :allow-null="false" :options="HGravityOptions" />
									<SelectParam title="Vertical Align" v-model="imageParams.watermark.vAlign" default="bottom" :allow-null="false" :options="VGravityOptions" />
								</div>
								<SliderParam title="Width" v-model="imageParams.watermark.width" :min="1" :max="100" :step="1" :default="80" suffix="%" />
								<SliderParam title="Height" v-model="imageParams.watermark.height" :min="1" :max="100" :step="1" :default="6" suffix="%" />
								<SliderParam title="Opacity" v-model="imageParams.watermark.opacity" :min="0" :max="100" :step="1" :default="100" suffix="%" />
								<ObjectSelectParam title="Rotation" v-model="imageParams.watermark.rotate" :default="0" :allow-null="false" :options="WatermarkRotationOptions" />
								<div class="flex items-center gap-1">
									<div class="flex-1 flex flex-col gap-3">
										<SliderParam title="Horizontal Padding" v-model="imageParams.watermark.hPadding" :min="0" :max="256" :step="1" :default="18" suffix="px" />
										<SliderParam title="Vertical Padding" v-model="imageParams.watermark.vPadding" :min="0" :max="256" :step="1" :default="18" suffix="px" />
									</div>
									<div class="flex flex-col items-center justify-center gap-1">
										<Icon name="contrain-line" class="w-3 h-auto stroke-neutral-500" />
										<div class="cursor-pointer border border-neutral-300 rounded-lg p-1" :class="{'bg-neutral-300': constrainWatermarkPadding}" @click="constrainWatermarkPadding = !constrainWatermarkPadding">
											<Icon name="constrain" class="fill-black w-3 h-auto" />
										</div>
										<Icon name="contrain-line" class="w-3 h-auto stroke-neutral-500 rotate-180 -scale-x-100" />
									</div>
								</div>
								<EditorPanel v-if="imageParams.watermark.type === 'text'" title="Watermark Drop Shadow" collapse-key="watermark-drop-shadow-editor" v-model="imageParams.watermark.dropShadow.enabled" :show-toggle="true" :disabled="!imageParams.watermark.dropShadow.enabled">
									<SliderParam title="Opacity" v-model="imageParams.watermark.dropShadow.opacity" :min="0" :max="100" :step="1" :default="100" suffix="%" />
									<SliderParam title="Blur" v-model="imageParams.watermark.dropShadow.blur" :min="0" :max="100" :step="1" :default="3" suffix="px" />
									<ColorParam title="Color" v-model="imageParams.watermark.dropShadow.color" default="#000000" />
									<div class="grid grid-cols-2 gap-3">
										<SliderParam title="Offset X" v-model="imageParams.watermark.dropShadow.offsetX" :min="0" :max="100" :step="1" :default="1" suffix="px" />
										<SliderParam title="Offset Y" v-model="imageParams.watermark.dropShadow.offsetX" :min="0" :max="100" :step="1" :default="1" suffix="px" />
									</div>
								</EditorPanel>
							</EditorPanel>
							<EditorPanel title="Redact" collapse-key="redact-editor" v-model="imageParams.enableRedact" :show-toggle="true" :disabled="!imageParams.enableRedact">
								<TagsParam title="Faces" :options="redactFaceOptions" v-model="imageParams.redact.faces" placeholder="Faces to redact" />
								<TagsParam title="People" :options="redactPersonOptions" v-model="imageParams.redact.people" placeholder="People to redact" />
								<RedactRegionParam v-model="imageParams.redact.regions" />
								<SliderParam title="Blur" v-model="imageParams.redact.blur" :min="0" :max="512" :step="1" :default="0" default-label="None" suffix="" />
								<SliderParam title="Pixelate" v-model="imageParams.redact.pixelate" :min="0" :max="512" :step="1" :default="0" default-label="None" suffix="px" />
								<ToggleParam title="Use Fill Color" v-model="imageParams.redact.useColor" />
								<ColorParam v-if="imageParams.redact.useColor" title="Fill Color" v-model="imageParams.redact.color" :default="null" />
								<SliderParam title="Blur Mask" v-model="imageParams.redact.blurMask" :min="0" :max="512" :step="1" :default="0" default-label="None" suffix="" />
								<SliderParam title="Expand Mask" v-model="imageParams.redact.expandMask" :min="0" :max="200" :step="1" :default="0" default-label="None" suffix="%" />
								<SliderParam title="Pixelate Mask" v-model="imageParams.redact.pixelateMask" :min="0" :max="512" :step="1" :default="0" default-label="None" suffix="px" />
							</EditorPanel>
							<EditorPanel title="Format" collapse-key="format-editor">
								<ObjectSelectParam title="File Format" v-model="imageParams.export.format" default="webp" :allow-null="false" :options="ExportFormatOptions" />
								<SliderParam title="Quality" v-model="imageParams.export.quality" :min="0" :max="100" :step="1" :default="85" />
								<SliderParam v-if="imageParams.export.format === 'webp'" title="Reduction Effort" v-model="imageParams.export.reductionEffort" :min="0" :max="6" :step="1" :default="4" />
								<ToggleParam title="Lossless" v-model="imageParams.export.lossless" />
								<ToggleParam title="Near Lossless" v-model="imageParams.export.nearLossless" />
							</EditorPanel>
							<EditorPanel collapse-key="debug-editor">
								<div class="flex items-center justify-center">
									<div @click="resetParams" class="cursor-pointer text-xs hover:text-blue-600">Reset All</div>
								</div>
							</EditorPanel>
						</div>
					</div>
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
.preview-area {
	background-image: url("data:image/svg+xml, %3Csvg%20width=%2216%22%20height=%2216%22%20viewBox=%220%200%2016%2016%22%20fill=%22none%22%20xmlns=%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%3Crect%20width=%228%22%20height=%228%22%20fill=%22%23AEAEAE%22%2F%3E%0A%3Crect%20x=%228%22%20y=%228%22%20width=%228%22%20height=%228%22%20fill=%22%23AEAEAE%22%2F%3E%0A%3Crect%20x=%228%22%20width=%228%22%20height=%228%22%20fill=%22%23D9D9D9%22%2F%3E%0A%3Crect%20y=%228%22%20width=%228%22%20height=%228%22%20fill=%22%23D9D9D9%22%2F%3E%0A%3C%2Fsvg%3E%0A");
}
</style>
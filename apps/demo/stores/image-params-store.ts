import {defineStore, storeToRefs} from "pinia";
import {computed, ref, watch} from "vue";
import pDebounce from "p-debounce";
import SecureLS from "secure-ls";
import {
	type ImageParams,
	type ImageMeta,
	type GradientMapParams,
	DefaultImageParams,
	base64,
	type FoxyImageParams, ImageParamsSchema
} from "@foxyimg/url-builder";

import {importFoxyImageParams} from "@foxyimg/url-builder";

import {buildUrl} from "@/utils/build-url";
import {useStorage} from "@vueuse/core";
import SampleImages from "~/data/sample-images.json";

type PresetList = {
	[key:string]: FoxyImageParams
}

export const useImageParamsStore = defineStore("foxy-image-demo-params-store", () => {
	const presets = ref<PresetList>({});
	const currentPresetId = ref<string|null>(null);
	const currentPreset = computed(() => {
		if (!currentPresetId.value || !presets.value[currentPresetId.value]) {
			return null;
		}

		return presets.value[currentPresetId.value];
	});

	const currentPresetChanged = ref(false);
	const paramsEditorMode = ref<"params"|"overlays"|"presets">("params");
	const currentImageUrl = ref<string|null>(null);

	const imageKey = ref<string|null>(SampleImages.length > 0 ? SampleImages[0] : null);
	const imageParams = ref<ImageParams>(JSON.parse(JSON.stringify(DefaultImageParams)));
	const imageMeta = ref<ImageMeta|null>(null);
	const currentPresetJSONObject = ref<any|null>(null);

	const gradientMapPresets = ref<GradientMapParams[]>([]);
	const fontPresets = ref<string[]>([]);

	const faceCount = computed(() => {
		if (!imageMeta.value) {
			return 0;
		}

		return imageMeta.value.faces.length;
	});

	const peopleCount = computed(() => {
		if (!imageMeta.value || !imageMeta.value.people) {
			return 0;
		}

		return imageMeta.value.people.length;
	});

	async function buildImageUrl() {
		if (!imageKey.value || imageKey.value.trim().length === 0) {
			currentImageUrl.value = null;
			return;
		}

		currentImageUrl.value = await buildUrl(imageKey.value, imageParams.value);
	}
	const debouncedBuildImageUrl = pDebounce(buildImageUrl, 1000);

	async function fetchImageMeta() {
		if (!imageKey.value) {
			imageMeta.value = null;
			return;
		}

		const metaUrl = await buildUrl(imageKey.value, {metaOnly: true})
		if (metaUrl) {
			const response = await fetch(metaUrl);
			if (!response.ok) {
				imageMeta.value = null;
				return;
			}

			imageMeta.value = await response.json();
		}
	}
	const debouncedFetchImageMeta = pDebounce(fetchImageMeta, 1000);

	async function fetchCurrentPresetJSONObject() {
		if (!imageKey.value) {
			currentPresetJSONObject.value = null;
			return;
		}

		const presetUrl = await buildUrl(imageKey.value, { ...imageParams.value, showPreset: true });
		if (presetUrl) {
			const response = await fetch(presetUrl);
			if (!response.ok) {
				currentPresetJSONObject.value = null;
				return;
			}

			const presetObj = await response.json();
			for(const key of Object.keys(presetObj)) {
				if (typeof presetObj[key] === 'object' && Object.keys(presetObj[key]).length === 0) {
					delete presetObj[key];
				}
			}
			currentPresetJSONObject.value = presetObj;
		}
	}
	const debouncedFetchCurrentPresetJSONObject = pDebounce(fetchCurrentPresetJSONObject, 1000);

	async function reload() {
		await buildImageUrl();
		await fetchCurrentPresetJSONObject();
		await fetchImageMeta();
	}

	function resetParams() {
		imageParams.value = JSON.parse(JSON.stringify(DefaultImageParams));
	}

	watch(imageKey, async () => {
		imageMeta.value = null;
		await debouncedBuildImageUrl();
		await debouncedFetchCurrentPresetJSONObject();
		await debouncedFetchImageMeta();
	}, { deep: true });

	watch(imageParams, async () => {
		currentPresetChanged.value = true;
		await debouncedBuildImageUrl();
	}, {deep: true});

	watch(currentPresetId, () => {
		if (currentPresetId.value === null || currentPreset.value === null) {
			return;
		}

		imageParams.value = importFoxyImageParams(currentPreset.value);
	});

	return {
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

		buildImageUrl,
		debouncedBuildImageUrl,

		fetchImageMeta,
		debouncedFetchImageMeta,

		fetchCurrentPresetJSONObject,
		debouncedFetchCurrentPresetJSONObject,

		reload,
		resetParams,
	}
}, {
	persist: {
		storage: {
			getItem: key => {
				return new SecureLS({ encodingType: "aes", isCompression: true }).get(key);
			},
			setItem: (key, value) => {
				new SecureLS({ encodingType: "aes", isCompression: true }).set(key, value);
			},
		},
	},

});
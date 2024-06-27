import {defineStore, storeToRefs} from "pinia";
import {computed, ref, watch} from "vue";
import {useFoxyAppStore} from "@/stores/foxy-app-store";
import pDebounce from "p-debounce";
import SecureLS from "secure-ls";
import calcAspectRatio from "@/utils/aspect-ratio";
import exists from "@/utils/exists";
import {
	type ImageParams,
	type ImageMeta,
	type GradientMapParams,
	type BoxCropParams,
	DefaultImageParams,
	base64
} from "@foxy/url-builder";

import {buildUrl} from "@/composables/build-url";
import {importFoxyImageParams} from "@foxy/url-builder";

export const useImageParamsStore = defineStore("foxy-image-params-store", () => {
	const {
		currentApp,
		currentSource,
		imageKey,
		currentPresetChanged,
		currentPresetId,
		currentPreset,
	} = storeToRefs(useFoxyAppStore());

	const paramsEditorMode = ref<"params"|"overlays"|"presets">("params");
	const currentImageUrl = ref<string|null>(null);
	const currentPresetImageUrl = computed(() => {
		if (!currentApp.value || !currentSource.value || !currentPresetId.value) {
			return null;
		}
		let encodedKey = base64('/'+imageKey.value, true);
		return `${currentApp.value.url}/${currentSource.value.key}/${encodedKey}/@${currentPresetId.value}`;
	});

	const imageParams = ref<ImageParams>(JSON.parse(JSON.stringify(DefaultImageParams)));

	const gradientMapPresets = ref<GradientMapParams[]>([]);
	const fontPresets = ref<string[]>([]);
	const watermarkImageSamples = ref<string[]>([]);

	const imageMeta = ref<ImageMeta|null>(null);
	const currentPresetJSONObject = ref<any|null>(null);

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
		console.log(currentSource.value, currentApp.value);
		if (!currentSource.value || !currentApp.value || !currentSource.value.key || !currentApp.value.signingKey || !currentApp.value.url || !imageKey.value) {
			currentImageUrl.value = null;
			return;
		}

		currentImageUrl.value = await buildUrl(imageKey.value, imageParams.value);
	}
	const debouncedBuildImageUrl = pDebounce(buildImageUrl, 1000);

	async function fetchImageMeta() {
		if (!currentSource.value || !currentApp.value || !currentSource.value.key || !currentApp.value.signingKey || !currentApp.value.url || !imageKey.value) {
			imageMeta.value = null;
			return;
		}

		const metaUrl = await buildUrl(imageKey.value, {metaOnly: true})
		console.log(metaUrl);
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
		if (!currentSource.value || !currentApp.value || !currentSource.value.key || !currentApp.value.signingKey || !currentApp.value.url || !imageKey.value) {
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
			console.log("presetObj", presetObj);
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
		if (confirm("Are you sure you want to reset all image parameters?")) {
			imageParams.value = JSON.parse(JSON.stringify(DefaultImageParams));
		}
	}

	watch(currentSource, async () => {
		imageMeta.value = null;
		imageKey.value = currentSource.value?.sampleImages[0] ?? null;
		await debouncedBuildImageUrl();
		await debouncedFetchCurrentPresetJSONObject();
		await debouncedFetchImageMeta();
	}, { deep: true });

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

		imageParams.value = importFoxyImageParams(currentPreset.value.params);
	});

	return {
		imageParams,
		currentImageUrl,
		imageMeta,
		faceCount,
		peopleCount,
		currentPresetJSONObject,
		currentPresetImageUrl,
		gradientMapPresets,
		fontPresets,
		watermarkImageSamples,
		paramsEditorMode,

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

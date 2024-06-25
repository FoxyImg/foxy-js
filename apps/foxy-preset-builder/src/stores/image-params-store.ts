import {defineStore, storeToRefs} from "pinia";
import {computed, ref, watch} from "vue";
import {useFoxyAppStore} from "@/stores/foxy-app-store";
import pDebounce from "p-debounce";
import SecureLS from "secure-ls";
import {type FoxyBoundsPreset, type FoxyPreset} from "@/types/foxy-preset";
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

import buildUrl from "@/composables/build-url";

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

	function buildImageUrl() {
		console.log(currentSource.value, currentApp.value);
		if (!currentSource.value || !currentApp.value || !currentSource.value.key || !currentApp.value.signingKey || !currentApp.value.url || !imageKey.value) {
			currentImageUrl.value = null;
			return;
		}

		currentImageUrl.value = buildUrl(imageKey.value, imageParams.value);
	}
	const debouncedBuildImageUrl = pDebounce(buildImageUrl, 1000);

	async function fetchImageMeta() {
		if (!currentSource.value || !currentApp.value || !currentSource.value.key || !currentApp.value.signingKey || !currentApp.value.url || !imageKey.value) {
			imageMeta.value = null;
			return;
		}

		const metaUrl = buildUrl(imageKey.value, {metaOnly: true})
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

		const presetUrl = buildUrl(imageKey.value, { ...imageParams.value, showPreset: true });
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
		buildImageUrl();
		await fetchCurrentPresetJSONObject();
		await fetchImageMeta();
	}

	function resetParams() {
		if (confirm("Are you sure you want to reset all image parameters?")) {
			imageParams.value = JSON.parse(JSON.stringify(DefaultImageParams));
		}
	}

	function foxyPresetToImageParams(foxyPreset: FoxyPreset) {
		const params = JSON.parse(JSON.stringify(DefaultImageParams));

		const ifExists = <T, N>(value: T|undefined|null, defaultValue: N): N  =>{
			return exists(value) ? value as N : defaultValue;
		}

		const processBoxParams = (foxyBox:FoxyBoundsPreset, paramsBox:BoxCropParams) => {
			let index = ifExists(foxyBox.index, paramsBox.index);
			if (exists(foxyBox.largest)) {
				index = foxyBox.largest! ? -2 : index;
			} else if (exists(foxyBox.smallest)) {
				index = foxyBox.smallest! ? -3 : index;
			}

			paramsBox.index = index;
			paramsBox.padding = ifExists(foxyBox.padding, paramsBox.padding);
			paramsBox.zoom = foxyBox.zoom ? foxyBox.zoom * 100 : paramsBox.zoom;
			paramsBox.hGravity = ifExists(foxyBox.hGravity, paramsBox.hGravity);
			paramsBox.vGravity = ifExists(foxyBox.vGravity, paramsBox.vGravity);
			paramsBox.focus = ifExists(foxyBox.focus, paramsBox.focus);
		}

		if (exists(foxyPreset.size)) {
			if (exists(foxyPreset.size!.crop) && foxyPreset.size!.crop!.length > 0) {
				params.crop = foxyPreset.size!.crop!;
			}

			params.width = ifExists(foxyPreset.size!.width, params.width);
			params.height = ifExists(foxyPreset.size!.height, params.height);

			if (exists(foxyPreset.size!.aspectRatio)) {
				const ar = calcAspectRatio(foxyPreset.size!.aspectRatio!, 50);
				params.aspectRatioWidth = ar[0];
				params.aspectRatioHeight = ar[1];
			}

			params.zoom = ifExists(foxyPreset.size!.zoom, params.zoom);
			params.smartMode = ifExists(foxyPreset.size!.interesting, params.smartMode);
			params.hGravity = ifExists(foxyPreset.size!.hGravity, params.hGravity);
			params.vGravity = ifExists(foxyPreset.size!.vGravity, params.vGravity);

			if (exists(foxyPreset.size!.focalPoint)) {
				params.focalPoint = {
					x: ifExists(foxyPreset.size!.focalPoint!.x, params.focalPoint.x),
					y: ifExists(foxyPreset.size!.focalPoint!.y, params.focalPoint.y),
				};

				params.focalPointZoom = ifExists(foxyPreset.size!.focalPoint!.zoom, params.focalPointZoom);
			}

			if (exists(foxyPreset.size!.face)) {
				processBoxParams(foxyPreset.size!.face!, params.face);
			}

			if (exists(foxyPreset.size!.person)) {
				processBoxParams(foxyPreset.size!.person!, params.person);
			}
		}

		if (exists(foxyPreset.padding)) {
			params.padding.color = ifExists(foxyPreset.padding!.color, params.padding.color);
			params.padding.left = ifExists(foxyPreset.padding!.left, params.padding.left);
			params.padding.top = ifExists(foxyPreset.padding!.top, params.padding.top);
			params.padding.right = ifExists(foxyPreset.padding!.right, params.padding.right);
			params.padding.bottom = ifExists(foxyPreset.padding!.bottom, params.padding.bottom);
		}

		if (exists(foxyPreset.border)) {
			params.border.color = ifExists(foxyPreset.border!.color, params.border.color);
			params.border.left = ifExists(foxyPreset.border!.left, params.border.left);
			params.border.top = ifExists(foxyPreset.border!.top, params.border.top);
			params.border.right = ifExists(foxyPreset.border!.right, params.border.right);
			params.border.bottom = ifExists(foxyPreset.border!.bottom, params.border.bottom);
		}

		if (exists(foxyPreset.redact)) {
			params.redact.faces = foxyPreset.redact!.faces ? foxyPreset.redact!.faces.map((face) => face === -1 ? 'all' : `${face}`) : params.redact.faces;
			params.redact.people = foxyPreset.redact!.people ? foxyPreset.redact!.people.map((person) => person === -1 ? 'all' : `${person}`) : params.redact.people;
			params.redact.regions = ifExists(foxyPreset.redact!.regions, params.redact.regions);
			params.redact.blur = ifExists(foxyPreset.redact!.blur, params.redact.blur);
			params.redact.expandMask = ifExists(foxyPreset.redact!.expandMask, params.redact.expandMask);
			params.redact.blurMask = ifExists(foxyPreset.redact!.blurMask, params.redact.blurMask);
			params.redact.pixelateMask = ifExists(foxyPreset.redact!.pixelateMask, params.redact.pixelateMask);
			params.redact.useColor = ifExists(foxyPreset.redact!.useColor, params.redact.useColor);
			params.redact.color = ifExists(foxyPreset.redact!.color, params.redact.color);
			params.redact.pixelate = ifExists(foxyPreset.redact!.pixelate, params.redact.pixelate);
		}

		if (exists(foxyPreset.background)) {
			const color = ifExists(foxyPreset.background!.color, '#00000000');
			params.backgroundColor = color.startsWith('#') ? color.substring(1) : color;
		}

		return params;
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

	watch(imageParams, () => {
		currentPresetChanged.value = true;
	}, {deep: true});

	watch(currentPresetId, () => {
		if (currentPresetId.value === null || currentPreset.value === null) {
			return;
		}

		imageParams.value = foxyPresetToImageParams(currentPreset.value);
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

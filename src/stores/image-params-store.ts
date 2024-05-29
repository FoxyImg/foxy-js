import {defineStore, storeToRefs} from "pinia";
import {computed, reactive, ref, watch} from "vue";
import type {BoxCropParams, DebugParams, ImageParams} from "@/types/params";
import {DefaultImageParams} from "@/types/params";
import {useFoxyAppStore} from "@/stores/foxy-app-store";
import buildUrl from "@/utils/url-builder";
import pDebounce from "p-debounce";
import type {ImageMeta} from "@/types/image-meta";
import signHMAC256 from "@/utils/sign";
import SecureLS from "secure-ls";
import {DefaultFoxyPreset, type FoxyBoundsPreset, type FoxyFullPreset, type FoxyPreset} from "@/types/foxy-preset";
import {extractChanges} from "@/utils/extract-changes";
import calcAspectRatio from "@/utils/aspect-ratio";
import exists from "@/utils/exists";

export const useImageParamsStore = defineStore("foxy-image-params-store", () => {
	const {
		currentApp,
		currentSource,
		imageKey,
		currentPresetChanged,
		currentPresetId,
		currentPreset,
	} = storeToRefs(useFoxyAppStore());

	const currentImageUrl = ref<string|null>(null);
	const currentPresetImageUrl = computed(() => {
		if (!currentApp.value || !currentSource.value || !currentPresetId.value) {
			return null;
		}
		const encodedKey = btoa('/'+imageKey.value);
		return `${currentApp.value.url}/${currentSource.value.key}/${encodedKey}/@${currentPresetId.value}`;
	});

	const imageParams = ref<ImageParams>(JSON.parse(JSON.stringify(DefaultImageParams)));
	const debugParams = ref<DebugParams>({
		faces: false,
		allFaces: false,
		people: false,
		allPeople: false,
		otherLabels: false,

		disableSourceCache: false,
		disableMetaCache: false,
		disableRenderCache: false,
	});

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
		if (!currentSource.value || !currentApp.value || !currentSource.value.key || !currentApp.value.secret || !currentApp.value.url || !imageKey.value) {
			currentImageUrl.value = null;
			return;
		}

		currentImageUrl.value = buildUrl(currentApp.value.url, currentSource.value.key, currentApp.value.secret, imageKey.value, imageParams.value, debugParams.value);
	}
	const debouncedBuildImageUrl = pDebounce(buildImageUrl, 500);

	async function fetchImageMeta() {
		if (!currentSource.value || !currentApp.value || !currentSource.value.key || !currentApp.value.secret || !currentApp.value.url || !imageKey.value) {
			imageMeta.value = null;
			return;
		}

		let encodedKey = btoa('/'+imageKey.value);
		let metaUrl = `/${currentSource.value.key}/${encodedKey}/meta`;

		const sig = signHMAC256(currentApp.value.secret, metaUrl);

		const response = await fetch(currentApp.value.url + metaUrl + "?s="+sig);
		if (!response.ok) {
			imageMeta.value = null;
			return;
		}

		imageMeta.value = await response.json();
	}
	const debouncedFetchImageMeta = pDebounce(fetchImageMeta, 500);

	async function fetchCurrentPresetJSONObject() {
		if (!currentSource.value || !currentApp.value || !currentSource.value.key || !currentApp.value.secret || !currentApp.value.url || !imageKey.value) {
			currentPresetJSONObject.value = null;
			return;
		}

		const presetUrl = buildUrl(currentApp.value.url, currentSource.value.key, currentApp.value.secret, imageKey.value, imageParams.value, null, true);
		console.log(presetUrl);
		const response = await fetch(presetUrl);
		if (!response.ok) {
			currentPresetJSONObject.value = null;
			return;
		}

		const presetObj = await response.json() as FoxyFullPreset;
		const diffed = extractChanges(presetObj, DefaultFoxyPreset, ["vision"]);
		currentPresetJSONObject.value = diffed ?? presetObj;
	}
	const debouncedFetchCurrentPresetJSONObject = pDebounce(fetchCurrentPresetJSONObject, 500);

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

		if (exists(foxyPreset.crop) && foxyPreset.crop!.length > 0) {
			params.crop = foxyPreset.crop!;
		}

		const ifExists = <T, N>(value: T|undefined|null, defaultValue: N): N  =>{
			return exists(value) ? value as N : defaultValue;
		}

		params.width = ifExists(foxyPreset.width, params.width);
		params.height = ifExists(foxyPreset.height, params.height);

		if (exists(foxyPreset.aspectRatio)) {
			const ar = calcAspectRatio(foxyPreset.aspectRatio!, 50);
			params.aspectRatioWidth = ar[0];
			params.aspectRatioHeight = ar[1];
		}

		params.zoom = ifExists(foxyPreset.zoom, params.zoom);
		params.smartMode = ifExists(foxyPreset.interesting, params.smartMode);
		params.hGravity = ifExists(foxyPreset.hGravity, params.hGravity);
		params.vGravity = ifExists(foxyPreset.vGravity, params.vGravity);

		if (exists(foxyPreset.focalPoint)) {
			params.focalPoint = {
				x: ifExists(foxyPreset.focalPoint!.x, params.focalPoint.x),
				y: ifExists(foxyPreset.focalPoint!.y, params.focalPoint.y),
			};

			params.focalPointZoom = ifExists(foxyPreset.focalPoint!.zoom, params.focalPointZoom);
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

		if (exists(foxyPreset.face)) {
			processBoxParams(foxyPreset.face!, params.face);
		}

		if (exists(foxyPreset.person)) {
			processBoxParams(foxyPreset.person!, params.person);
		}

		if (exists(foxyPreset.bgColor)) {
			params.backgroundColor = foxyPreset.bgColor!.startsWith('#') ? foxyPreset.bgColor!.substring(1) : foxyPreset.bgColor!;
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

	watch([imageParams, debugParams], async () => {
		await debouncedBuildImageUrl();
		await debouncedFetchCurrentPresetJSONObject();
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
		debugParams,
		currentImageUrl,
		imageMeta,
		faceCount,
		peopleCount,
		currentPresetJSONObject,
		currentPresetImageUrl,

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

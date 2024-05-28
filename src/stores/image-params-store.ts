import {defineStore, storeToRefs} from "pinia";
import {computed, reactive, ref, watch} from "vue";
import type {DebugParams, ImageParams} from "@/types/params";
import {DefaultImageParams} from "@/types/params";
import {useFoxyAppStore} from "@/stores/foxy-app-store";
import buildUrl from "@/utils/url-builder";
import pDebounce from "p-debounce";
import type {ImageMeta} from "@/types/image-meta";
import signHMAC256 from "@/utils/sign";
import SecureLS from "secure-ls";

export const useImageParamsStore = defineStore("foxy-image-params-store", () => {
	const {
		currentApp,
		currentSource,
		imageKey,
	} = storeToRefs(useFoxyAppStore());

	const currentImageUrl = ref<string|null>(null);

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

		currentPresetJSONObject.value = await response.json();
	}
	const debouncedFetchCurrentPresetJSONObject = pDebounce(fetchCurrentPresetJSONObject, 500);

	async function reload() {
		buildImageUrl();
		await fetchCurrentPresetJSONObject();
		await fetchImageMeta();
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

	return {
		imageParams,
		debugParams,
		currentImageUrl,
		imageMeta,
		faceCount,
		peopleCount,
		currentPresetJSONObject,

		buildImageUrl,
		debouncedBuildImageUrl,
		fetchImageMeta,
		debouncedFetchImageMeta,
		fetchCurrentPresetJSONObject,
		debouncedFetchCurrentPresetJSONObject,
		reload,
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

import {defineStore} from "pinia";
import {type FoxyApp} from "@/types/foxy-app";
import {computed, ref, watch} from "vue";
import SecureLS from "secure-ls";

export const useFoxyAppStore = defineStore("foxy-app-store", () => {
	const apps = ref<FoxyApp[]>([]);
	const currentAppId = ref<string|null>(null);
	const imageKey = ref<string|null>('XXM03026.JPG');
	const currentApp = computed(() => {
		if (!currentAppId.value) {
			return null;
		}

		return apps.value.find((app) => app.id === currentAppId.value) ?? null;
	});

	const currentSourceId = ref<string|null>(null);
	const currentSource = computed(() => {
		if (!currentSourceId.value || !currentApp.value) {
			return null;
		}

		return currentApp.value.sources.find((source) => source.key === currentSourceId.value) ?? null;
	});
	const currentSources = computed(() => {
		if (!currentApp.value) {
			return [];
		}

		return currentApp.value.sources;
	});

	const sampleImages = computed({
		get: () => currentSource.value?.sampleImages ?? [],
		set: (value) => {
			console.log('setting sample images', value);
			if (currentSource.value) {
				currentSource.value.sampleImages = value
			}
		},
	})

	const overlayImages = computed({
		get: () => currentSource.value?.overlayImages ?? [],
		set: (value) => {
			console.log('setting overlay images', value);
			if (currentSource.value) {
				currentSource.value.overlayImages = value
			}
		},
	})

	const currentPresetChanged = ref(false);
	const currentPresetId = ref<string|null>(null);
	const currentPreset = computed(() => {
		if (!currentPresetId.value || !currentApp.value) {
			return null;
		}

		if (!currentApp.value.presets[currentPresetId.value]) {
			return null;
		}

		return currentApp.value.presets[currentPresetId.value];
	});
	const currentPresets = computed(() => {
		if (!currentApp.value) {
			return {};
		}

		return currentApp.value.presets;
	});

	function removeSampleImage(imageKey:string) {
		const idx = sampleImages.value.indexOf(imageKey);
		if (idx === -1) {
			return;
		}

		sampleImages.value.splice(idx, 1);
	}

	function addSampleImage(imageKey:string) {
		if (!sampleImages.value.includes(imageKey)) {
			sampleImages.value.push(imageKey);
		}
	}

	function removeOverlayImage(imageKey:string) {
		const idx = overlayImages.value.indexOf(imageKey);
		if (idx === -1) {
			return;
		}

		overlayImages.value.splice(idx, 1);
	}

	function addOverlayImage(imageKey:string) {
		if (!overlayImages.value.includes(imageKey)) {
			overlayImages.value.push(imageKey);
		}
	}

	watch(currentAppId, () => {
		currentPresetChanged.value = false;
	});

	return {
		apps,
		currentAppId,
		currentApp,
		imageKey,

		currentSourceId,
		currentSource,
		currentSources,
		sampleImages,

		currentPresetChanged,
		currentPresetId,
		currentPreset,
		currentPresets,

		addSampleImage,
		removeSampleImage,
		addOverlayImage,
		removeOverlayImage,
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
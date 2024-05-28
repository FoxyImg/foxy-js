import {defineStore} from "pinia";
import {type FoxyApp} from "@/types/foxy-app";
import {computed, ref} from "vue";
import {useStorage} from "@vueuse/core";
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

	const currentSourceId = useStorage<string|null>('foxy_current_source_id', null);
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

	const sampleImages = computed(() => {
		if (currentSource.value === null) {
			return [];
		}

		return currentSource.value!.sampleImages;
	});

	const currentPresetId = useStorage<string|null>('foxy_current_preset_id', null);
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

	return {
		apps,
		currentAppId,
		currentApp,
		imageKey,

		currentSourceId,
		currentSource,
		currentSources,
		sampleImages,

		currentPresetId,
		currentPreset,
		currentPresets,

		removeSampleImage
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
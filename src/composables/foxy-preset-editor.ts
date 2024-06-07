import {storeToRefs} from "pinia";
import {useFoxyAppStore} from "@/stores/foxy-app-store";
import {ref} from "vue";
import {useImageParamsStore} from "@/stores/image-params-store";
import {properCase} from "@/utils/ucfirst";
import slugify from "slugify";

export default function useFoxyPresetEditor() {
	const {
		currentApp,
		currentPresetId,
		currentPresets,
		currentPreset,
	} = storeToRefs(useFoxyAppStore());

	const {
		currentPresetJSONObject,
	} = storeToRefs(useImageParamsStore());

	const foxyPresetName = ref<string|null>(null);
	const showFoxyPresetEditor = ref(false);
	const foxyPresetEditorMode = ref<"create"|"edit">("create");

	const saveFoxyPreset = async () => {
		if (!foxyPresetName.value || foxyPresetName.value.length === 0) {
			return;
		}

		if (foxyPresetEditorMode.value === "create") {
			await saveNewFoxyPreset();
			return;
		}

		if (!currentApp.value || !currentPreset.value || !currentPresetId.value) {
			return;
		}

		const existingPreset = JSON.parse(JSON.stringify(currentPreset.value));
		const newSlug = slugify(foxyPresetName.value, {
			lower: true,
			strict: true,
			replacement: '-',
		});


		const deletePresetResponse = await fetch(`${currentApp.value.url}/presets/${currentApp.value.id}/${currentPresetId.value}`, {
			method: "DELETE",
			headers: {
				'Authorization': `Bearer ${currentApp.value.apiKey}`,
			},
		});

		if (!deletePresetResponse.ok) {
			console.error("Could not delete preset");
			return;
		}

		delete currentPresets.value[currentPresetId.value];

		const newPresetResponse = await fetch(`${currentApp.value.url}/presets/${currentApp.value.id}/${newSlug}`, {
			method: "POST",
			headers: {
				'Authorization': `Bearer ${currentApp.value.apiKey}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(existingPreset),
		});

		if (newPresetResponse.ok) {
			currentPresets.value[newSlug] = existingPreset;
			currentPresetId.value = newSlug;
		}
	}

	const saveNewFoxyPreset = async () => {
		if (!currentApp.value || !foxyPresetName.value || foxyPresetName.value.length === 0) {
			return;
		}

		const newSlug = slugify(foxyPresetName.value, {
			lower: true,
			strict: true,
			replacement: '-',
		});

		const newPresetResponse = await fetch(`${currentApp.value.url}/presets/${currentApp.value.id}/${newSlug}`, {
			method: "POST",
			headers: {
				'Authorization': `Bearer ${currentApp.value.apiKey}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(currentPresetJSONObject.value),
		});

		if (newPresetResponse.ok) {
			currentPresets.value[newSlug] = JSON.parse(JSON.stringify(currentPresetJSONObject.value));
			currentPresetId.value = newSlug;
		}
	}

	const updateCurrentFoxyPreset = async () => {
		if (!currentApp.value || !currentPresetId.value) {
			return;
		}

		const newPresetResponse = await fetch(`${currentApp.value.url}/presets/${currentApp.value.id}/${currentPresetId.value}`, {
			method: "PUT",
			headers: {
				'Authorization': `Bearer ${currentApp.value.apiKey}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(currentPresetJSONObject.value),
		});

		if (newPresetResponse.ok) {
			currentPresets.value[currentPresetId.value] = JSON.parse(JSON.stringify(currentPresetJSONObject.value));
		}
	}

	const deleteFoxyPreset = async () => {
		if (!currentApp.value || !currentPresetId.value) {
			return;
		}

		const deletePresetResponse = await fetch(`${currentApp.value.url}/presets/${currentApp.value.id}/${currentPresetId.value}`, {
			method: "DELETE",
			headers: {
				'Authorization': `Bearer ${currentApp.value.apiKey}`,
			},
		});

		if (deletePresetResponse.ok) {
			delete currentPresets.value[currentPresetId.value];
			currentPresetId.value = null;
		}
	}

	const syncFoxyPresets = async () => {
		if (currentApp.value === null) {
			return;
		}

		const presetsResponse = await fetch(`${currentApp.value.url}/presets/${currentApp.value.id}`, {
			headers: {
				'Authorization': `Bearer ${currentApp.value.apiKey}`,
			}
		});

		if (!presetsResponse.ok) {
			console.error("Could not fetch presets", presetsResponse.status, presetsResponse.statusText);
		} else {
			const presets = await presetsResponse.json();
			currentApp.value.presets = presets;
		}
	}

	const editFoxyPreset = () => {
		if (!currentPresetId.value) {
			return;
		}

		foxyPresetName.value = properCase(currentPresetId.value.replaceAll(/[-_]/g, " "));
		foxyPresetEditorMode.value = "edit";
		showFoxyPresetEditor.value = true;
	}

	const newFoxyPreset = () => {
		foxyPresetName.value = null;
		foxyPresetEditorMode.value = "create";
		showFoxyPresetEditor.value = true;
	}

	return {
		foxyPresetName,
		showFoxyPresetEditor,
		foxyPresetEditorMode,

		saveFoxyPreset,
		updateCurrentFoxyPreset,
		editFoxyPreset,
		newFoxyPreset,
		deleteFoxyPreset,
		syncFoxyPresets,
	}
};
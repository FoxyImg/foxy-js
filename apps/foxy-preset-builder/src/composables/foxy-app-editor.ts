import {ref} from "vue";
import {DefaultFoxyApp, type FoxyApp} from "@/types/foxy-app";
import {useFoxyAppStore} from "@/stores/foxy-app-store";
import {storeToRefs} from "pinia";
import type {FoxyPreset} from "@foxy/url-builder";
import type {FoxySource} from "@/types/foxy-source";

export default function useFoxyAppEditor() {
	const {
		apps,
		currentAppId,
		currentApp,
	} = storeToRefs(useFoxyAppStore());

	const editingFoxyApp = ref<FoxyApp>(JSON.parse(JSON.stringify(DefaultFoxyApp)));
	const showFoxyAppEditor = ref(false);
	const foxyAppEditorMode = ref<"create"|"edit">("create");

	type AppVerificationResult = {
		sources: FoxySource[],
		presets: { [key:string]: FoxyPreset },
	}

	const verifyAppId = async(id:string, url:string, secret:string):Promise<AppVerificationResult> => {
		const sourcesResponse = await fetch(`${url}/sources/${id}`, {
			headers: {
				'Authorization': `Bearer ${secret}`,
			}
		});

		if (!sourcesResponse.ok) {
			throw new Error("Could not fetch sources");
		}

		const presetsResponse = await fetch(`${url}/presets/${id}`, {
			headers: {
				'Authorization': `Bearer ${secret}`,
			}
		});

		if (!presetsResponse.ok) {
			throw new Error("Could not fetch presets");
		}

		return {
			sources: await sourcesResponse.json(),
			presets: await presetsResponse.json(),
		}
	}

	const saveFoxyApp = () => {
		if (editingFoxyApp.value.id === null || editingFoxyApp.value.url === null || editingFoxyApp.value.signingKey === null) {
			return;
		}

		const idx = apps.value.findIndex((app) => app.id === editingFoxyApp.value.id);
		if (idx === -1) {
			apps.value.push(editingFoxyApp.value);
		} else {
			apps.value[idx] = editingFoxyApp.value;
		}

		showFoxyAppEditor.value = false;
	}

	const editFoxyApp = () => {
		console.log(currentApp.value);

		if (currentAppId.value === null || currentApp.value === null) {
			return;
		}

		editingFoxyApp.value = JSON.parse(JSON.stringify(currentApp.value));
		foxyAppEditorMode.value = "edit";
		showFoxyAppEditor.value = true;
	}

	const newFoxyApp = () => {
		editingFoxyApp.value = JSON.parse(JSON.stringify(DefaultFoxyApp))
		console.log(editingFoxyApp.value);
		foxyAppEditorMode.value = "create";
		showFoxyAppEditor.value = true;
	}

	const deleteFoxyApp = () => {
		if (currentAppId.value === null) {
			return;
		}

		if (confirm("Are you sure you want to delete this app?")) {
			apps.value = apps.value.filter((app) => app.id !== currentAppId.value);
			currentAppId.value = null;
		}
	}

	return {
		editingFoxyApp,
		showFoxyAppEditor,
		foxyAppEditorMode,
		verifyAppId,
		newFoxyApp,
		editFoxyApp,
		saveFoxyApp,
		deleteFoxyApp,
	}
}
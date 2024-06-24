import {storeToRefs} from "pinia";
import {useFoxyAppStore} from "@/stores/foxy-app-store";
import {ref, toRaw} from "vue";
import {DefaultFoxySource, type FoxySource} from "@/types/foxy-source";

export default function useFoxySourceEditor() {
	const {
		currentSourceId,
		currentSource,
		currentSources,
	} = storeToRefs(useFoxyAppStore());

	const editingFoxySource = ref<FoxySource>(JSON.parse(JSON.stringify(DefaultFoxySource)));
	const showFoxySourceEditor = ref(false);
	const foxyEditorMode = ref<"create"|"edit">("create");

	const saveFoxySource = () => {
		if (editingFoxySource.value.key === null) {
			return;
		}

		const idx = currentSources.value.findIndex((source) => source.key === editingFoxySource.value.key);
		if (idx === -1) {
			currentSources.value.push(editingFoxySource.value);
		} else {
			currentSources.value[idx] = editingFoxySource.value;
		}

		showFoxySourceEditor.value = false;
	}

	const editFoxySource = () => {
		if (currentSource.value === null) {
			return;
		}

		editingFoxySource.value = JSON.parse(JSON.stringify(currentSource.value));
		foxyEditorMode.value = "edit";
		showFoxySourceEditor.value = true;
	}

	const newFoxySource = () => {
		editingFoxySource.value = JSON.parse(JSON.stringify(DefaultFoxySource));
		foxyEditorMode.value = "create";
		showFoxySourceEditor.value = true;
	}

	const deleteFoxySource = () => {
		if (confirm("Are you sure you want to delete this source?")) {
			const idx = currentSources.value.findIndex((source) => source.key === currentSourceId.value);
			if (idx === -1) {
				return;
			}

			currentSources.value.splice(idx, 1);
			currentSourceId.value = null;
		}
	}

	return {
		currentSourceId,
		currentSource,
		currentSources,

		editingFoxySource,
		showFoxySourceEditor,
		foxyEditorMode,
		newFoxySource,
		editFoxySource,
		saveFoxySource,
		deleteFoxySource,
	}
};
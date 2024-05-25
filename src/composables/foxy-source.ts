import {useStorage} from "@vueuse/core";
import type {FoxySource} from "@/types/options";
import {computed, ref} from "vue";

export default function useFoxySource() {
	const currentSources = useStorage<FoxySource[]>('foxy_sources', []);
	const currentSourceId = useStorage<string|null>('foxy_current_source_id', null);

	const currentSource = computed(() => {
		if (!currentSourceId.value) {
			return null;
		}

		return currentSources.value.find((source) => source.key === currentSourceId.value) ?? null;
	});

	const DefaultFoxySource: FoxySource = {
		type: "s3",
		name: "Default",
		url: null,
		key: null,
		secret: null,
		sampleImages: [],
	}

	const editingFoxySource = ref<FoxySource>(JSON.parse(JSON.stringify(DefaultFoxySource)));
	const showFoxySourceEditor = ref(false);
	const foxyEditorMode = ref<"create"|"edit">("create");

	const saveFoxySource = () => {
		if (editingFoxySource.value.key === null || editingFoxySource.value.url === null || editingFoxySource.value.secret === null) {
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
			currentSources.value = currentSources.value.filter((source) => source.key !== currentSourceId.value);
			currentSourceId.value = null;
		}
	}


	return {
		currentSources,
		currentSourceId,
		currentSource,

		editingFoxySource,
		showFoxySourceEditor,
		foxyEditorMode,
		newFoxySource,
		editFoxySource,
		saveFoxySource,
		deleteFoxySource,
	}
}
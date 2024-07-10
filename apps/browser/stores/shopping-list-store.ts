import {defineStore} from "pinia";
import {ref} from "vue";
import type {File} from "~/types/file";

export const useShoppingListStore = defineStore("foxy-browser-shopping-list", () => {
	const selectedFiles = ref<File[]>([]);
	const selectedFilePaths = computed(() => {
			return selectedFiles.value.map(file => file.path);
	});

	function isFileSelected(file:File) {
		return selectedFilePaths.value.includes(file.path);
	}

	function toggleFileSelection(file:File) {
		if (isFileSelected(file)) {
			selectedFiles.value = selectedFiles.value.filter(f => f.path !== file.path);
		} else {
			selectedFiles.value.push(file);
		}
	}

	function resetShoppingList() {
		selectedFiles.value = [];
	}

	return {
		selectedFiles,

		isFileSelected,
		toggleFileSelection,
		resetShoppingList,
	}
}, {
	persist: {
		storage: localStorage,
	},

});

<script setup lang="ts">
import {computed, ref} from "vue";
import {useShoppingListStore} from "~/stores/shopping-list-store";
import {trailingSlash, leadingSlash} from "@foxyimg/utils";
const {selectedFiles} = storeToRefs(useShoppingListStore());
const {toggleFileSelection, resetShoppingList} = useShoppingListStore();

const showPreviewModal = ref(false);
const previewFileIndex = ref(0);

function showPreview(fileIndex:number) {
	previewFileIndex.value = fileIndex;
	showPreviewModal.value = true;
}

function reset() {
	if (confirm("Are you sure you want to reset the shopping list?")) {
		resetShoppingList();
	}
}

function exportList() {
	const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(selectedFiles.value.map(file => file.preview!.xl)));
	const downloadAnchorNode = document.createElement('a');
	downloadAnchorNode.setAttribute("href",     dataStr);
	downloadAnchorNode.setAttribute("download", "shopping-list.json");
	document.body.appendChild(downloadAnchorNode); // required for firefox
	downloadAnchorNode.click();
	downloadAnchorNode.remove();
}
</script>
<template>
	<div class="min-w-[320px] border-l border-neutral-200 bg-neutral-50 relative flex flex-col">
		<div class="flex-1 relative">
			<div class="absolute top-0 left-0 w-full h-full overflow-y-auto">
				<div class="flex flex-col gap-1" v-auto-animate>
					<div v-for="(file, idx) in selectedFiles" :key="file.path" class="flex items-center gap-2 p-3 bg-white hover:bg-blue-100 cursor-pointer group relative" @click="showPreview(idx)">
						<img :src="file.preview!.small" class="h-16 aspect-square object-cover border group-hover:border-blue-300 bg-white" />
						<div class="flex-1 flex-col text-xs w-full overflow-hidden" @click.stop.prevent>
							<div class="truncate">{{ file.name}}</div>
							<NuxtLink :to="leadingSlash(trailingSlash(file.dir!))" class="block truncate text-xxs text-neutral-600 hover:text-blue-800">{{ file.dir }}</NuxtLink>
						</div>
						<div class="absolute right-0 top-0 cursor-pointer p-2 group" @click.prevent.stop="toggleFileSelection(file)">
							<Icon name="close" class="w-2.5 h-auto fill-neutral-700 group-hover:fill-red-600" />
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="px-3 py-2 flex items-center justify-center gap-1.5 w-full border-t text-xs bg-neutral-100">
			<button type="button" class="button alt small" @click="exportList">Export List ...</button>
			<button type="button" class="button alt small" @click="reset">Reset List</button>
		</div>
	</div>


	<FadeTransition>
		<PreviewModal v-if="showPreviewModal" :file-index="previewFileIndex" :files="selectedFiles" @close="showPreviewModal = false" :show-selection="false"></PreviewModal>
	</FadeTransition>
</template>
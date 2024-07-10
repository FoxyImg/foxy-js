<script setup lang="ts">
import copy from "copy-to-clipboard";
import type {File} from "~/types/file";
import Icon from "~/components/Icon.vue";

import {useShoppingListStore} from "~/stores/shopping-list-store";

const {
	isFileSelected,
	toggleFileSelection,
} = useShoppingListStore();

const props = defineProps<{
	file: File,
	columns: number,
}>()

const isSelected = computed(() => isFileSelected(props.file));

</script>
<template>
	<div class="cursor-pointer flex flex-col items-center justify-center gap-3 text-xs p-3">
		<div class="w-full bg-checkered relative">
			<div v-if="file.preview" class="relative w-full aspect-square">
				<img v-if="columns <= 2" loading="lazy" :src="file.preview.xl" class="w-full aspect-square object-cover" />
				<img v-else-if="columns <= 4" loading="lazy" :src="file.preview.large" class="w-full aspect-square object-cover" />
				<img v-else :src="file.preview.small" loading="lazy" class="w-full aspect-square object-cover" />
				<Icon v-if="file.mimeType && file.mimeType.startsWith('video')" name="video" class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-auto fill-white drop-shadow-sm" />
			</div>
			<div v-else class="w-full h-auto">
				<Icon name="file" class="w-full h-auto" />
			</div>
			<div class="absolute right-1 top-1 flex flex-col gap-1.5">
				<div
					@click.stop.prevent="toggleFileSelection(props.file)"
					class="p-1 aspect-square rounded-full backdrop-blur-sm flex items-center justify-center border group shadow-lg shadow-black/25"
					:class="{
						'border-green-600 bg-green-200/50 hover:border-white hover:bg-white/10': isSelected,
						'border-white bg-white/10 hover:border-green-600 hover:bg-green-200/50': !isSelected
					}">
					<Icon name="check"
					      class="w-auto h-3"
					      :class="{ 'fill-green-600 group-hover:fill-white': isSelected, 'fill-white group-hover:fill-green-600': !isSelected }"
					/>
				</div>
				<div class="p-1.5 rounded-full border border-white backdrop-blur-sm cursor-pointer hover:bg-black/25 group shadow-lg shadow-black/25"  @click.stop.prevent="copy(file.path)"><Icon name="copy" class="w-3 h-auto fill-white group-hover:fill-white" /></div>
			</div>
		</div>
		<div class="overflow-hidden w-full text-center">
			<div class="max-w-full truncate">{{ file.name }}</div>
		</div>
	</div>
</template>
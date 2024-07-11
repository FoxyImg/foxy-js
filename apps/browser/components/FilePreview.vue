<script setup lang="ts">
import copy from "copy-to-clipboard";
import type {File} from "~/types/file";
import Icon from "~/components/Icon.vue";

import {useShoppingListStore} from "~/stores/shopping-list-store";
import prettyBytes from "pretty-bytes";
import useDateFormatter from "~/utils/date/date-formatter";

const {
	isFileSelected,
	toggleFileSelection,
} = useShoppingListStore();

const props = defineProps<{
	file: File,
	previewSize: number,
}>()

const isSelected = computed(() => isFileSelected(props.file));

const { dateTimeFormat } = useDateFormatter();

</script>
<template>
	<div class="cursor-pointer flex flex-col items-center justify-center gap-3 text-xs p-3">
		<div class="w-full relative rounded-md" :class="{'bg-blue-100': isSelected, 'bg-checkered': !isSelected}">
			<div v-if="file.preview" class="relative w-full aspect-square">
				<img v-if="previewSize <= 384" loading="lazy" :src="file.preview.small" class="w-full aspect-square object-cover" />
				<img v-else-if="previewSize <= 768" loading="lazy" :src="file.preview.large" class="w-full aspect-square object-cover" />
				<img v-else :src="file.preview.xl" loading="lazy" class="w-full aspect-square object-cover" />
				<Icon v-if="file.mimeType && file.mimeType.startsWith('video')" name="video" class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-auto fill-white drop-shadow-sm" />
			</div>
			<div v-else class="w-full h-auto">
				<Icon name="file" class="w-full h-auto" />
			</div>
			<div class="absolute right-1.5 top-1.5 flex flex-col gap-1.5">
				<div
					@click.stop.prevent="toggleFileSelection(props.file)"
					class="p-1 aspect-square rounded-full backdrop-blur-sm flex items-center justify-center border group shadow shadow-black/25"
					:class="{
						'border-blue-600 bg-blue-200/50 hover:border-white hover:bg-white/10': isSelected,
						'border-white bg-white/10 hover:border-blue-600 hover:bg-blue-200/50': !isSelected
					}">
					<Icon name="check"
					      class="w-auto h-3"
					      :class="{ 'fill-blue-600 group-hover:fill-white': isSelected, 'fill-white group-hover:fill-blue-600': !isSelected }"
					/>
				</div>
				<div class="p-1.5 rounded-full border border-white backdrop-blur-sm cursor-pointer hover:bg-black/25 group shadow shadow-black/25"  @click.stop.prevent="copy(file.path)"><Icon name="copy" class="w-3 h-auto fill-white group-hover:fill-white" /></div>
			</div>

			<div class="border-[2px] rounded-md absolute w-full h-full left-0 top-0 pointer-events-none" :class="{'border-transparent': !isSelected, 'border-blue-500': isSelected}"></div>
		</div>
		<div class="overflow-hidden w-full">
			<div class="flex items-center w-full overflow-hidden">
				<div class="flex-1 truncate">{{ file.name }}</div>
				<div class="font-bold text-neutral-400 text-xxs">{{ prettyBytes(file.size).toUpperCase() }}</div>
			</div>
			<div class="flex items-center w-full overflow-hidden">
				<div class="text-xxs flex flex-wrap gap-y-0 items-center gap-x-1 text-neutral-400 text-xxs">
					<span>{{file.mimeType}}</span>
					<span>&centerdot;</span>
					<span>{{dateTimeFormat(file.lastModified)}}</span>
				</div>
			</div>
		</div>
	</div>
</template>
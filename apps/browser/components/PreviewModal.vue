<script setup lang="ts">
import hotkeys from "hotkeys-js";
import {ModalContainer} from "@foxyimg/vue-ui";
import type {File} from "~/types/file";
import {useWritableWrappedRef} from "@foxyimg/vue-utils";
import copy from "copy-to-clipboard";
import Icon from "~/components/Icon.vue";
import {useShoppingListStore} from "~/stores/shopping-list-store";
import "media-chrome";

const props = withDefaults(defineProps<{
	fileIndex: number,
	files: File[],
	showSelection?: boolean,
}>(), {
	showSelection: true,
});

const currentIndex = useWritableWrappedRef(props.fileIndex, props.files.length);
const currentFile = computed(() => props.files && currentIndex.value !== null ? props.files[currentIndex.value] : null);

const modalProps = computed(() => {
	return {
		title: currentFile.value ? currentFile.value.name : "Preview",
		showTitle: true,
		showClose: true
	}
});

const emit = defineEmits<{
	(e: 'close'): void
}>();

const {
	isFileSelected,
	toggleFileSelection,
} = useShoppingListStore();

onMounted(() => {
	hotkeys('right', (e) => {
		e.preventDefault();

		if (currentIndex.value === null) {
			return;
		}

		currentIndex.value++;
	});

	hotkeys('left', (e) => {
		e.preventDefault();

		if (currentIndex.value === null) {
			return;
		}

		currentIndex.value--;
	});

	hotkeys('space', (e) => {
		e.preventDefault();

		if (currentFile.value === null) {
			return;
		}

		toggleFileSelection(currentFile.value);
	});

	hotkeys('escape', (e) => {
		e.preventDefault();
		emit('close');
	});
});

onUnmounted(() => {
	hotkeys.unbind('right');
	hotkeys.unbind('left');
	hotkeys.unbind('space');
	hotkeys.unbind('escape');
});

const isSelected = computed(() => currentFile.value && isFileSelected(currentFile.value));

</script>
<template>
	<ModalContainer v-bind="modalProps" @close="emit('close')" :full-screen="true">
		<template #extras>
			<div v-if="currentFile" class="flex gap-2 mr-3">
				<div class="flex items-center justify-center w-6 rounded-full aspect-square border border-neutral-200 backdrop-blur-sm cursor-pointer hover:bg-black/25 group"  @click.stop.prevent="copy(currentFile.path)"><Icon name="copy" class="w-3.5 h-auto fill-black group-hover:fill-white" /></div>
				<div
					v-if="showSelection"
					@click.stop.prevent="toggleFileSelection(currentFile)"
					class="cursor-pointer flex items-center justify-center w-6 aspect-square rounded-full backdrop-blur-sm border group"
					:class="{
						'border-green-600 bg-green-200/50 hover:border-white hover:bg-white/10': isSelected,
						'border-neutral-200 hover:border-green-600 hover:bg-green-200/50': !isSelected
					}">
					<Icon name="check"
					      class="w-auto h-3"
					      :class="{ 'fill-green-600 group-hover:fill-white': isSelected, 'fill-neutral-700 group-hover:fill-green-600': !isSelected }"
					/>
				</div>
			</div>
		</template>
		<div class="flex-1 relative bg-black rounded-b-lg">
			<template v-if="currentFile && currentFile.mimeType">
				<FadeTransition>
					<img v-if="currentFile.preview && currentFile.mimeType.startsWith('image')" key="image" :src="'/api/web/'+currentFile.path" class="absolute w-full h-full object-contain" />
					<media-controller v-else-if="currentFile.mimeType.startsWith('video')" key="video" class="absolute w-full h-full">
						<video slot="media" playsinline muted autoplay :src="'/api/web/'+currentFile.path" class="w-full h-full" />
						<media-control-bar>
							<media-play-button></media-play-button>
							<media-mute-button></media-mute-button>
							<media-volume-range></media-volume-range>
							<media-time-range></media-time-range>
							<media-airplay-button></media-airplay-button>
							<media-pip-button></media-pip-button>
							<media-fullscreen-button></media-fullscreen-button>
						</media-control-bar>
					</media-controller>
				</FadeTransition>
				<Icon v-if="currentIndex !== null" name="next" class="cursor-pointer z-10 absolute right-1 top-1/2 w-4 h-auto fill-white -translate-y-1/2" @click="currentIndex++" />
				<Icon v-if="currentIndex !== null" name="next" class="rotate-180 cursor-pointer z-10 absolute left-1 top-1/2 w-4 h-auto fill-white -translate-y-1/2" @click="currentIndex--" />
			</template>
		</div>
	</ModalContainer>
</template>
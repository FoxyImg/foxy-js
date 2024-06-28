<script setup lang="ts">
import {ref, watch} from "vue";
import { animations } from "@formkit/drag-and-drop";
import {useDragAndDrop} from "@formkit/drag-and-drop/vue";
import shortUUID from "short-uuid";
import {DefaultOverlayParams, type ImageMeta, type ImageParams} from "@foxyimg/url-builder";
import OverlayParam from "../params/OverlayParam.vue";

const props = defineProps<{
	modelValue: ImageParams,
	overlayImages: string[],
	imageMeta: ImageMeta|null,
}>();

const emit = defineEmits<{
	(e: 'update:modelValue', value: ImageParams): void
}>();

const [parent, overlays] = useDragAndDrop(props.modelValue.overlays.overlays ?? [], {
	dragHandle: ".drag-handle",
	plugins: [
		animations()
	]
});

watch(overlays, () => {
	emit('update:modelValue', {
		...props.modelValue,
		overlays: {
			...props.modelValue.overlays,
			overlays: overlays.value,
		}
	});
});

const overlayType = ref<"image"|"text"|"rect"|"ellipse">("image");

function addOverlay() {
	const newOverlay = JSON.parse(JSON.stringify(DefaultOverlayParams));
	newOverlay.id = shortUUID.generate();
	newOverlay.type = overlayType.value;
	overlays.value.push(newOverlay);
}

function removeOverlay(id:string) {
	if (confirm("Remove this overlay?")) {
		overlays.value = overlays.value.filter((overlay) => overlay.id !== id);
	}
}
</script>
<template>
	<div class="p-3 flex flex-col gap-3">
		<div class="p-3 rounded-lg shadow bg-white flex flex-col gap-3 border border-neutral-200 text-xs">
			<div class="flex items-center gap-1">
				<div>Add Overlay</div>
				<select v-model="overlayType" class="border border-neutral-200 text-xs flex-1 rounded-md py-1.5 px-1">
					<option value="image">Image</option>
					<option value="text">Text</option>
					<option value="rect">Rect</option>
					<option value="ellipse">Ellipse</option>
				</select>
				<button type="button" class="ml-2 button small" @click="addOverlay">Add</button>
			</div>
		</div>
		<div class="flex flex-col gap-3" ref="parent">
			<OverlayParam
				v-for="(overlay, index) in overlays"
				v-model="overlays[index]"
				:draggable="true"
				:overlay-images="overlayImages"
				:image-meta="imageMeta"
				:key="`overlay-${overlay.id}`" @remove="removeOverlay(overlay.id)" @remove-overlay-image="removeOverlay"  />
		</div>
	</div>
</template>

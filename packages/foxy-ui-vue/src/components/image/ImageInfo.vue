<script setup lang="ts">
import {computed, onMounted, reactive} from "vue";
import FaceIcon from "../icons/FaceIcon.vue"
import PersonIcon from "../icons/PersonIcon.vue"
import StatusInfo from "./StatusInfo.vue"
import type {ImageMeta} from "@foxy/url-builder";

const props = defineProps<{
	size: { width: number, height: number }|null,
	previewImage: HTMLImageElement|null,
	loadTime: number,
	imageMeta: ImageMeta|null,
	faceCount: number,
	peopleCount: number,
	isLoaded: boolean,
}>();


const windowSize = reactive({
	width: 0,
	height: 0,
});

onMounted(() => {
	windowSize.width = window.innerWidth;
	windowSize.height = window.innerHeight;

	window.addEventListener("resize", () => {
		windowSize.width = window.innerWidth;
		windowSize.height = window.innerHeight;
	});
});

const imageSizeText = computed(() => {
	if (!props.size || props.size.width === 0 || props.size.height === 0 || windowSize.width === 0) {
		return null;
	}

	if (props.previewImage) {
		const scale = Math.floor(((props.previewImage.clientWidth * props.previewImage.clientHeight) / (props.size.width * props.size.height)) * 100.0);
		return `${props.size.width} x ${props.size.height} (${scale}%)`;
	} else {
		return `${props.size.width} x ${props.size.height}`;
	}
});
</script>
<template>
	<div class="flex items-center gap-3">
		<StatusInfo v-if="imageSizeText">{{imageSizeText}}, {{Math.floor(loadTime)}}ms</StatusInfo>
		<StatusInfo v-tooltip="`${faceCount} faces found.`" v-if="imageMeta && isLoaded" class="cursor-pointer"><FaceIcon class="fill-black w-3 h-auto" /> {{ faceCount }}</StatusInfo>
		<StatusInfo v-tooltip="`${peopleCount} people found.`" v-if="imageMeta && isLoaded" class="cursor-pointer"><PersonIcon class="fill-black w-3 h-auto"/> {{ peopleCount }}</StatusInfo>
	</div>
</template>

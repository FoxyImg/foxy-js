<script setup lang="ts">
import {ImageMeta} from "@foxy/url-builder";

defineProps<{
	imageMeta: ImageMeta|null,
	isLoaded: boolean,
}>();
</script>
<template>
	<div v-if="imageMeta && isLoaded && imageMeta.dominantColors.colors.length > 0" class="flex items-center">
		<div class="aspect-square w-3 h-3" :style="`background-color: rgb(${imageMeta.dominantColors.colors[0].r}, ${imageMeta.dominantColors.colors[0].g}, ${imageMeta.dominantColors.colors[0].b})`"></div>
		<div v-if="imageMeta.dominantColors.lightest" class="aspect-square w-3 h-3" :style="`background-color: rgb(${imageMeta.dominantColors.lightest.r}, ${imageMeta.dominantColors.lightest.g}, ${imageMeta.dominantColors.lightest.b})`"></div>
		<div v-if="imageMeta.dominantColors.darkest" class="aspect-square w-3 h-3" :style="`background-color: rgb(${imageMeta.dominantColors.darkest.r}, ${imageMeta.dominantColors.darkest.g}, ${imageMeta.dominantColors.darkest.b})`"></div>
		<div class="w-2"></div>
		<div v-for="color in imageMeta.dominantColors.colors" class="aspect-square w-3 h-3" :style="`background-color: rgb(${color.r}, ${color.g}, ${color.b})`"></div>
	</div>
</template>

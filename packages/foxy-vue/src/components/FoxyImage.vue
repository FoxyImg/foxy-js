<script setup lang="ts">
import {computed, inject} from "vue";
import type {PartialImageParams} from "@foxy/url-builder";

const foxy = inject<(imageKey: string, params:PartialImageParams) => string>("foxy");

const props =defineProps<{
	src: string;
	params: PartialImageParams
}>();

const imageUrl = computed(() => {
	if (!props.src || !foxy) {
		return null;
	}

	const url = foxy(props.src, props.params);
	console.log("imageUrl", url);
	return url;
});
</script>
<template>
	<img v-if="imageUrl" :src="imageUrl" />
	<template v-else>
		<slot name="fallback"></slot>
	</template>
</template>

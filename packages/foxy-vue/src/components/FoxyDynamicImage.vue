<script setup lang="ts">
import {computed} from "vue";
import type {PartialImageParams} from "@foxy/url-builder";

import {foxy} from "@foxy/url-builder";

const props = withDefaults(defineProps<{
	host: string;
	sourceId: string;
	secret?: string;
	imageKey: string;
	params: PartialImageParams;
	imgixMode?: boolean;
	cacheBuster?: boolean;
}>(), {
	imgixMode: true,
	cacheBuster: false,
});

const imageUrl = computed(() => {
	if (!props.host || !props.sourceId || !props.imageKey) {
		return null;
	}

	return foxy(props.host, props.sourceId, props.secret, props.imgixMode, props.cacheBuster).buildUrl(props.imageKey, props.params);
});
</script>
<template>
	<img v-if="imageUrl" :src="imageUrl" />
	<template v-else>
		<slot name="fallback"></slot>
	</template>
</template>

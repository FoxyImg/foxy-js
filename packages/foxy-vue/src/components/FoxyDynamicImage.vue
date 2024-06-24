<script setup lang="ts">
import {computed} from "vue";
import type {PartialImageParams} from "@foxy/url-builder";

import {foxy} from "@foxy/url-builder";

const props = withDefaults(defineProps<{
	host: string;
	sourceId: string;
	imgixMode: boolean;
	imageKey: string;
	secret?: string;
	params: PartialImageParams
}>(), {
	imgixMode: true
});

const imageUrl = computed(() => {
	if (!props.host || !props.sourceId || !props.imageKey) {
		return null;
	}

	return foxy(props.host, props.sourceId, props.secret, props.imgixMode).buildUrl(props.imageKey, props.params);
});
</script>
<template>
	<img v-if="imageUrl" :src="imageUrl" />
	<template v-else>
		<slot name="fallback"></slot>
	</template>
</template>

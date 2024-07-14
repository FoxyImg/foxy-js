<script setup lang="ts">
import {LoaderFeedback, useImageLoader} from "@foxyimg/vue-ui";
const props = defineProps< {
	src: string,
}>();

const src = ref(props.src);
watch(() => props.src, (val) => src.value = val);

const { isLoaded, error } = useImageLoader(src);
</script>
<template>
	<img v-if="isLoaded" :src="src" />
	<div v-else-if="error">Oops.</div>
	<div v-else class="flex items-center justify-center">
		<div class="scale-75">
			<LoaderFeedback  />
		</div>
	</div>
</template>

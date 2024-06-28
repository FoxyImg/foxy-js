<script setup lang="ts">
import type {GradientStops} from "@foxyimg/url-builder";
import {computed, ref} from "vue";
import shortUUID from "short-uuid";

const props = defineProps<{
	stops: GradientStops[],
}>();

const sortedStops = computed(() => {
	return props.stops.sort((a, b) => a.stop - b.stop);
});

const gradId = ref('gradient-'+shortUUID.generate());

</script>
<template>
	<svg>
		<defs>
			<linearGradient :id="gradId" x1="0%" y1="0%" x2="100%" y2="0%">
				<template v-for="(stop, index) in sortedStops" :key="index">
					<stop v-if="stop.enabled" :offset="`${Math.floor(stop.stop)}%`" :stop-color="stop.color" />
				</template>
			</linearGradient>
		</defs>
		<rect width="100%" height="100%" :fill="`url(#${gradId})`" />
	</svg>
</template>

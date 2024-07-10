<script setup lang="ts">
import {
	ImageMeta,
	VideoFrameTypeOptions,
	VideoOutputModeOptions,
	VideoParams
} from "@foxyimg/url-builder";
import EditorPanel from "../inputs/EditorPanel.vue";
import ObjectSelectInput from "../inputs/ObjectSelectInput.vue";
import {computed} from "vue";
import SliderInput from "../inputs/SliderInput.vue";

const props = defineProps<{
	modelValue: VideoParams,
	imageMeta: ImageMeta|null,
}>();

const emit = defineEmits<{
	(e: 'update:modelValue', value: VideoParams): void;
}>();


const currentValue = computed({
	get: () => props.modelValue,
	set: (value) => emit('update:modelValue', value),
});

</script>
<template>
	<EditorPanel title="Video" collapse-key="video" v-model="currentValue.enabled" :show-toggle="true" :disabled="!currentValue.enabled">
		<ObjectSelectInput title="Output" v-model="currentValue.type" default="frame" :allow-null="false" :options="VideoOutputModeOptions" />
		<template v-if="currentValue.type === 'frame'">
			<ObjectSelectInput title="Frame Mode" v-model="currentValue.frameType" default="rel" :allow-null="false" :options="VideoFrameTypeOptions" />
			<SliderInput v-if="currentValue.frameType === 'rel'" title="Relative Time" v-model="currentValue.relativeTime" :min="0" :max="100" :step="1" :default="50" suffix="%" />
			<SliderInput v-if="imageMeta && imageMeta.video && currentValue.frameType === 'key'" title="Key Frame" v-model="currentValue.keyframe" :min="0" :max="imageMeta.video.keyframeCount" :step="1" :default="0" />
			<SliderInput v-if="imageMeta && imageMeta.video && currentValue.frameType === 'frame'" title="Frame" v-model="currentValue.frame" :min="0" :max="imageMeta.video.frameCount" :step="1" :default="0" />
			<SliderInput v-if="imageMeta && imageMeta.video && currentValue.frameType === 'time'" title="Time" v-model="currentValue.time" :min="0" :max="imageMeta.video.duration" :step="0.03" :default="0" />
		</template>
		<template v-else>
			<SliderInput title="Columns" v-model="currentValue.cols" :min="1" :max="12" :step="1" :default="10" />
			<SliderInput title="Rows" v-model="currentValue.rows" :min="1" :max="12" :step="1" :default="10" />
			<SliderInput title="Largest Dimension" v-model="currentValue.largestDimension" :min="1" :max="1024" :step="1" :default="256" />
		</template>
	</EditorPanel>
</template>

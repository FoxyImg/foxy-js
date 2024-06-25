<script setup lang="ts">
import {computed} from "vue";
import EditorPanel from "@/components/values/EditorPanel.vue";
import {DefaultChannelLevelsParams, type LevelsParams} from "@foxy/url-builder";
import LevelsValue from "@/components/values/LevelsValue.vue";

const props = defineProps<{
	modelValue: LevelsParams
}>();

const emit = defineEmits<{
	(e: 'update:modelValue', value: LevelsParams): void
}>();

const currentValue = computed({
	get: () => props.modelValue,
	set: (value) => emit('update:modelValue', value),
});
</script>
<template>
	<EditorPanel title="Levels" collapse-key="levels-editor" v-model="currentValue.enabled" :show-toggle="true" :disabled="!currentValue.enabled">
		<LevelsValue title="All Channels" :default="{...DefaultChannelLevelsParams}" v-model="currentValue.all" shadowColor="rgb(0,0,0)" mid-color="rgb(127,127,127)" highlight-color="rgb(255,255,255)" />
		<LevelsValue title="Red Channel" :default="{...DefaultChannelLevelsParams}" v-model="currentValue.red" shadowColor="rgb(0,0,0)" mid-color="rgb(127,0,0)" highlight-color="rgb(255,0,0)" />
		<LevelsValue title="Green Channel" :default="{...DefaultChannelLevelsParams}" v-model="currentValue.green" shadowColor="rgb(0,0,0)" mid-color="rgb(0,127,0)" highlight-color="rgb(0,255,0)" />
		<LevelsValue title="Blue Channel" :default="{...DefaultChannelLevelsParams}" v-model="currentValue.blue" shadowColor="rgb(0,0,0)" mid-color="rgb(0,0,127)" highlight-color="rgb(0,0,255)" />
	</EditorPanel>
</template>
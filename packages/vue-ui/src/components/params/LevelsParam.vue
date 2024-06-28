<script setup lang="ts">
import {computed} from "vue";
import EditorPanel from "../inputs/EditorPanel.vue";
import {DefaultChannelLevelsParams, type LevelsParams} from "@foxyimg/url-builder";
import LevelsInput from "../inputs/LevelsInput.vue";

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
		<LevelsInput title="All Channels" :default="{...DefaultChannelLevelsParams}" v-model="currentValue.all" shadowColor="rgb(0,0,0)" mid-color="rgb(127,127,127)" highlight-color="rgb(255,255,255)" />
		<LevelsInput title="Red Channel" :default="{...DefaultChannelLevelsParams}" v-model="currentValue.red" shadowColor="rgb(0,0,0)" mid-color="rgb(127,0,0)" highlight-color="rgb(255,0,0)" />
		<LevelsInput title="Green Channel" :default="{...DefaultChannelLevelsParams}" v-model="currentValue.green" shadowColor="rgb(0,0,0)" mid-color="rgb(0,127,0)" highlight-color="rgb(0,255,0)" />
		<LevelsInput title="Blue Channel" :default="{...DefaultChannelLevelsParams}" v-model="currentValue.blue" shadowColor="rgb(0,0,0)" mid-color="rgb(0,0,127)" highlight-color="rgb(0,0,255)" />
	</EditorPanel>
</template>

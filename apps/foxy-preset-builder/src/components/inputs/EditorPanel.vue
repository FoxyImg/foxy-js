<script setup lang="ts">
import {SmallLabel} from "@foxy/vue-ui";
import {DragHandleIcon, DownArrowIcon} from "@foxy/vue-ui";
import {computed, ref} from "vue";
import {Toggle} from "@foxy/vue-ui";
import {useStorage} from "@vueuse/core";

const props = withDefaults(defineProps< {
	title?: string
	modelValue?: boolean
	showToggle?: boolean
	disabled?: boolean
	collapseKey?: string
	draggable?: boolean
	initiallyExpanded?: boolean
}>(), {
	showToggle: false,
	disabled: false,
	draggable: false,
	initiallyExpanded: true,
});

const emit = defineEmits(['update:modelValue']);

const currentValue = computed({
	get: () => props.modelValue,
	set: (value) => emit('update:modelValue', value),
});

const expanded = props.collapseKey ? useStorage('editor-panel-collapsed-'+props.collapseKey, props.initiallyExpanded) : ref(props.initiallyExpanded);
</script>
<template>
	<div v-auto-animate class="editor-panel p-3 rounded-lg shadow bg-white flex flex-col gap-3 border border-neutral-200" :key="`Section ${title}`" :class="{'opacity-50': disabled}">
		<div v-if="title" class="flex items-center justify-start gap-1">
			<div class="flex-1 truncate flex items-center justify-start gap-1 cursor-pointer" @click="expanded = !expanded">
				<DragHandleIcon v-if="draggable" class="drag-handle w-3 h-auto fill-black"></DragHandleIcon>
				<DownArrowIcon class="w-3 h-auto fill-black transition-transform" :class="{'-rotate-90': !expanded }"></DownArrowIcon>
				<SmallLabel class="w-full truncate">{{ title }}</SmallLabel>
			</div>
			<div class="flex items-center gap-2">
				<slot name="extras-left"></slot>
				<div v-if="showToggle" class="flex items-center">
					<Toggle v-model="currentValue" size="sm" />
				</div>
				<slot name="extras-right"></slot>
			</div>
		</div>
		<div v-if="expanded" class="flex flex-col gap-3" :key="`Section ${title} Contents`">
			<slot></slot>
		</div>
	</div>
</template>
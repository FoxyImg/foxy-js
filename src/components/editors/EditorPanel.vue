<script setup lang="ts">
import SmallLabel from "@/components/UI/SmallLabel.vue";
import Icon from "@/components/UI/Icon.vue";
import {ref} from "vue";

defineProps< {
	title: string
}>();

const expanded = ref(true);
</script>
<template>
	<div v-auto-animate class="p-3 rounded-lg shadow bg-white flex flex-col gap-3 border border-neutral-200" :key="`Section ${title}`">
		<div class="flex items-center justify-start gap-1 cursor-pointer" @click="expanded = !expanded">
			<Icon name="down-arrow" class="w-3 h-auto fill-black transition-transform" :class="{'-rotate-90': !expanded }"></Icon>
			<SmallLabel>{{ title }}</SmallLabel>
		</div>
		<div v-if="expanded" class="flex flex-col gap-3" :key="`Section ${title} Contents`">
			<slot></slot>
		</div>
	</div>
</template>
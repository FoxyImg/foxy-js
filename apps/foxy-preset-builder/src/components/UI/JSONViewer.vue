<script setup lang="ts">
import 'vue-json-pretty/lib/styles.css';
import VueJsonPretty from "vue-json-pretty";
import Icon from "@/components/UI/Icon.vue";
import copy from "copy-to-clipboard";

const props = defineProps<{
	jsonObject: any|null,
}>();

function copyJson() {
	copy(JSON.stringify(props.jsonObject, null, 2));
}
</script>
<template>
	<div v-if="jsonObject">
		<div class="absolute left-0 top-0 right-0 bottom-0 overflow-y-auto px-3 py-1.5">
			<VueJsonPretty :data="jsonObject" :showLineNumber="true" :showIcon="true" :showDoubleQuotes="false" :showLength="true" />
		</div>
		<div @click="copyJson" class="cursor-pointer backdrop-blur absolute right-1 top-1 px-2 py-1 bg-black/10 rounded-lg text-xxs font-bold uppercase text-black flex items-center gap-0.5">
			<Icon name="copy-icon" class="fill-black w-3 h-auto" />
			Copy
		</div>
	</div>
</template>
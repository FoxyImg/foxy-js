<script setup lang="ts">
import copy from "copy-to-clipboard";
import Icon from "@/components/UI/Icon.vue";

import { hideAllPoppers } from "floating-vue";

defineProps<{
	imageUrl: string,
	actionTitle: string,
	iconName: string,
}>();

function copyUrl(url:string) {
	hideAllPoppers();
	copy(url);
}
</script>
<template>
	<div>
		<VMenu>
			<a :href="imageUrl" target="_blank" class="block aspect-square rounded-full bg-white/50 hover:bg-white backdrop-blur-lg p-1.5">
				<Icon :name="iconName" class="fill-current w-4 h-auto" />
			</a>
			<template #popper>
				<div @click="copyUrl(imageUrl)" class="cursor-pointer text-xs px-3 py-2 hover:text-blue-600 flex items-center gap-1">
					<Icon name="copy-icon" class="fill-black w-4 h-auto" />
					{{ actionTitle}}
				</div>
			</template>
		</VMenu>
	</div>
</template>
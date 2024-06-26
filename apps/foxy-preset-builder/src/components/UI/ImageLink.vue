<script setup lang="ts">
import copy from "copy-to-clipboard";
import {LinkIcon, BookmarkIcon} from "@foxy/vue-ui";
import {CopyIcon} from "@foxy/vue-ui";

import { hideAllPoppers } from "floating-vue";

defineProps<{
	imageUrl: string,
	actionTitle: string,
	iconName: "link"|"bookmark",
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
				<LinkIcon v-if="iconName === 'link'" class="fill-current w-4 h-auto" />
				<BookmarkIcon v-else class="fill-current w-4 h-auto" />
			</a>
			<template #popper>
				<div @click="copyUrl(imageUrl)" class="cursor-pointer text-xs px-3 py-2 hover:text-blue-600 flex items-center gap-1">
					<CopyIcon class="fill-black w-4 h-auto" />
					{{ actionTitle}}
				</div>
			</template>
		</VMenu>
	</div>
</template>
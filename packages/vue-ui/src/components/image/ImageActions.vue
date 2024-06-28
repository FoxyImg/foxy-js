<script setup lang="ts">
import DebugIcon from "../icons/DebugIcon.vue";
import ReloadIcon from "../icons/ReloadIcon.vue";
import ImageLink from "./ImageLink.vue";
import SmallLabel from "../ui/SmallLabel.vue";
import EditorPanel from "../inputs/EditorPanel.vue";
import ToggleInput from "../inputs/ToggleInput.vue";
import type {ImageMeta, ImageParams} from "@foxyimg/url-builder";

defineProps<{
	imageParams: ImageParams|null,
	currentImageUrl: string|null,
	currentPresetImageUrl: string|null,
}>();

const emit = defineEmits<{
	(e: 'reload'): void;
}>();

</script>
<template>
	<div v-if="imageParams" class="flex items-center gap-3 ">
		<div class="cursor-pointer aspect-square rounded-full bg-white/50 hover:bg-white backdrop-blur-lg p-1.5" @click="emit('reload')">
			<ReloadIcon class="fill-current w-4 h-auto" />
		</div>
		<div>
			<VDropdown>
				<div class="cursor-pointer aspect-square rounded-full bg-white/50 hover:bg-white backdrop-blur-lg p-1.5">
					<DebugIcon class="fill-current w-4 h-auto" />
				</div>
				<template #popper>
					<div class="p-3 rounded-lg bg-neutral-100 flex flex-col gap-3">
						<SmallLabel>Debug Options</SmallLabel>
						<EditorPanel title="Image Recognition" class="w-[400px]" collapse-key="debug-recognition">
							<div class="grid grid-cols-2 gap-3">
								<ToggleInput title="Outline Faces" v-model="imageParams.debug.faces" />
								<ToggleInput title="Outline All Faces" v-model="imageParams.debug.allFaces" />
								<ToggleInput title="Outline People" v-model="imageParams.debug.people" />
								<ToggleInput title="Outline All People" v-model="imageParams.debug.allPeople" />
								<ToggleInput title="Outline Other Labels" v-model="imageParams.debug.otherLabels" />
							</div>
						</EditorPanel>
						<EditorPanel title="Caching" class="w-[400px]" collapse-key="debug-caching">
							<div class="grid grid-cols-2 gap-3">
								<ToggleInput title="Disable Source Cache" v-model="imageParams.debug.disableSourceCache" />
								<ToggleInput title="Disable Meta Cache" v-model="imageParams.debug.disableMetaCache" />
								<ToggleInput title="Disable Render Cache" v-model="imageParams.debug.disableRenderCache" />
							</div>
						</EditorPanel>
					</div>
				</template>
			</VDropdown>
		</div>
		<ImageLink v-if="currentImageUrl" :image-url="currentImageUrl" action-title="Copy Image URL" icon-name="link" />
		<ImageLink v-if="currentPresetImageUrl" :image-url="currentPresetImageUrl" action-title="Copy Preset Image URL" icon-name="bookmark" />
	</div>
</template>

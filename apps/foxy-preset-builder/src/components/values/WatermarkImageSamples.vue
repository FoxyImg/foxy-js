<script setup lang="ts">
import {computed} from "vue";
import {DefaultImageParams} from "@foxy/url-builder";
import { hideAllPoppers } from "floating-vue";
import Icon from "@/components/UI/Icon.vue";
import {storeToRefs} from "pinia";
import {useImageParamsStore} from "@/stores/image-params-store";
import {useFoxyAppStore} from "@/stores/foxy-app-store";
import buildUrl from "@/composables/build-url";

const {
	currentApp,
	currentSource,
} = storeToRefs(useFoxyAppStore());

const {
	watermarkImageSamples,
} = storeToRefs(useImageParamsStore());

const props = defineProps<{
	modelValue: string|null,
}>();

const emit = defineEmits<{
	(e: 'update:modelValue', value: string|null): void;
}>();

const currentValue = computed({
	get: () => props.modelValue,
	set: (value) => emit('update:modelValue', value),
});

const imageParams = JSON.parse(JSON.stringify(DefaultImageParams));
imageParams.crop = ['fit'];
imageParams.width = 256;
imageParams.height = 256;

function selectImage(image: string) {
	currentValue.value = image;
	hideAllPoppers();
}

function removeImage(image: string) {
	watermarkImageSamples.value = watermarkImageSamples.value.filter((i) => i !== image);
}

</script>
<template>
	<div>
		<div v-if="watermarkImageSamples.length === 0" class="px-10 py-5 text-center text-xs">
			No sample images.
		</div>
		<div v-else-if="currentApp && currentSource && currentApp.url && currentSource.key && currentApp.signingKey" class="w-[384px] aspect-square relative">
			<div class="absolute inset-0 bg-neutral-100 overflow-y-auto p-1.5">
				<div class="grid grid-cols-3 gap-1">
					<div v-for="(image, index) in watermarkImageSamples" :key="index" class="cursor-pointer relative">
						<img :src="buildUrl(image, imageParams) ?? ''" @click="selectImage(image)">
						<div class="absolute right-1 top-1 rounded-full bg-white/50 backdrop-blur p-1 cursor-pointer" @click="removeImage(image)">
							<Icon name="close" class="fill-current w-1.5 h-auto" />
						</div>
					</div>
				</div>
			</div>
		</div>
		<div v-else class="px-10 py-5 text-center text-xs">
			App not configured correctly.
		</div>
	</div>
</template>
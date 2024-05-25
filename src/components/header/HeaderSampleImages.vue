<script setup lang="ts">
import {computed} from "vue";
import buildUrl from "@/utils/url-builder";
import {DefaultImageParams} from "@/types/params";
import { hideAllPoppers } from "floating-vue";
import Icon from "@/components/UI/Icon.vue";

const props = defineProps<{
	host:string,
	accessKey:string|null,
	secret:string,
	modelValue: string|null,
	sampleImages: string[],
}>();

const emit = defineEmits<{
	(e: 'update:modelValue', value: string|null): void;
	(e: 'removeSampleImage', value: string): void;
}>();

const currentValue = computed({
	get: () => props.modelValue,
	set: (value) => emit('update:modelValue', value),
});

const imageParams = JSON.parse(JSON.stringify(DefaultImageParams));
imageParams.crop = ['fill'];
imageParams.width = 256;
imageParams.height = 256;

function selectImage(image: string) {
	currentValue.value = image;
	hideAllPoppers();
}

function removeImage(image: string) {
	// props.sampleImages.value = sampleImages.value.filter((i) => i !== image);
	emit('removeSampleImage', image);
}

</script>
<template>
<div>
	<div v-if="sampleImages.length === 0" class="px-10 py-5 text-center text-xs">
		No sample images.
	</div>
	<div v-else class="w-[384px] aspect-square relative">
		<div class="absolute inset-0 bg-neutral-100 overflow-y-auto p-1.5">
			<div class="grid grid-cols-3 gap-1">
				<div v-for="(image, index) in sampleImages" :key="index" class="cursor-pointer relative">
					<img :src="buildUrl(host, accessKey, secret, image, imageParams)" @click="selectImage(image)">
					<div class="absolute right-1 top-1 rounded-full bg-white/50 backdrop-blur p-1 cursor-pointer" @click="removeImage(image)">
						<Icon name="close" class="fill-current w-1.5 h-auto" />
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
</template>
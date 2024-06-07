<script setup lang="ts">
import ModalContainer from "@/components/UI/ModalContainer.vue";
import {computed, reactive, ref, toRaw, watch} from "vue";
import SmallLabel from "@/components/UI/SmallLabel.vue";
import {buildImageParams, type SourceCropParams} from "@/types/params";
import buildUrl from "@/utils/url-builder";
import {storeToRefs} from "pinia";
import {useFoxyAppStore} from "@/stores/foxy-app-store";
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';
import LoaderFeedback from "@/components/UI/LoaderFeedback.vue";
import useImageLoader from "@/composables/image-loader";
import Toggle from "@/components/UI/Toggle.vue";

const {
	currentApp,
	currentSource,
	imageKey,
} = storeToRefs(useFoxyAppStore());

const props = defineProps<{
	modelValue: SourceCropParams,
}>();

const modalProps = reactive<{
	title: string,
	showTitle: boolean
	showClose: boolean
}>({
	title: "Crop Image",
	showTitle: true,
	showClose: true
});

const emit = defineEmits(['update:modelValue', 'save', 'close']);

const currentCrop = ref<SourceCropParams>(JSON.parse(JSON.stringify(props.modelValue)));

function saveCrop() {
	emit('update:modelValue', currentCrop.value);
	emit('close');
}

const imageUrl = computed(() => {
	if (!currentSource.value || !currentApp.value || !currentApp.value.url || !currentSource.value.key || !currentApp.value.secret || !imageKey.value) {
		return null;
	}

	return buildUrl(currentApp.value.url, currentSource.value.key, currentApp.value.secret, imageKey.value, buildImageParams({  }));
});

const {
	isLoading,
	isLoaded,
	size,
} = useImageLoader(imageUrl);

function change({coordinates} : {coordinates:any}) {
	currentCrop.value.x = coordinates.left;
	currentCrop.value.y = coordinates.top;
	currentCrop.value.width = coordinates.width;
	currentCrop.value.height = coordinates.height;
}

const aspectWidth = ref(0);
const aspectHeight = ref(0);

const stencilProps = computed(() => {
	return {
		aspectRatio: aspectHeight.value > 0 && aspectWidth.value > 0 ? aspectWidth.value / aspectHeight.value : 0,
	}
});

const landscape = ref(true);
const currentRatio = ref('none');

watch(currentRatio, (newVal) => {
	if (newVal === 'original') {
		aspectWidth.value = size.value.width;
		aspectHeight.value = size.value.height;
	} else if (newVal.includes(':')) {
		const ratio = newVal.split(':');
		aspectWidth.value = landscape.value ? parseInt(ratio[0]) : parseInt(ratio[1]);
		aspectHeight.value = landscape.value ? parseInt(ratio[1]) : parseInt(ratio[0]);
	} else if (newVal === 'none') {
		aspectWidth.value = 0;
		aspectHeight.value = 0;
	}
});

watch(landscape, (newVal) => {
	const w = aspectWidth.value;
	const h = aspectHeight.value;

	aspectWidth.value = h;
	aspectHeight.value = w;
});

function defaultPosition({ imageSize, visibleArea, coordinates }: any): any {
	if (currentCrop.value.width === 0 || currentCrop.value.height === 0) {
		return {
			left: 0,
			top: 0,
		};
	}

	return  {
		left: currentCrop.value.x,
		top: currentCrop.value.y,
	};
}

function defaultSize() {
	if (currentCrop.value.width === 0 || currentCrop.value.height === 0) {
		return {
			width: size.value.width,
			height: size.value.height,
		};
	}

	return {
		width: currentCrop.value.width,
		height: currentCrop.value.height,
	};
}
</script>
<template>
	<ModalContainer v-bind="modalProps" @close="emit('close')" :full-screen="true">
		<div class="flex-1 relative bg-black">
			<div v-if="!isLoaded || isLoading" class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
				<LoaderFeedback class=""/>
			</div>
			<div v-else class="absolute left-0 top-0 w-full h-full flex items-center justify-center bg-black">
				<cropper
					v-if="imageUrl"
					class="cropper"
					:transitions="false"
					:src="imageUrl"
					:stencil-props="stencilProps"
					:default-position="defaultPosition"
					:default-size="defaultSize"
					@change="change"
				/>
			</div>
		</div>
		<div class="px-3 py-1.5 flex items-center justify-between">
			<div class="flex items-center gap-5">
				<select v-model="currentRatio" class="border border-neutral-200 text-xs rounded-md py-1.5 px-1">
					<option value="none">Freeform</option>
					<option value="original">Original</option>
					<option value="1:1">Square</option>
					<option value="16:9">{{ landscape ? '16:9' : '9:16' }}</option>
					<option value="5:4">{{ landscape ? '5:4' : '4:5' }}</option>
					<option value="7:5">{{ landscape ? '7:5' : '5:7' }}</option>
					<option value="4:3">{{ landscape ? '4:3' : '3:4' }}</option>
					<option value="5:3">{{ landscape ? '5:3' : '3:5' }}</option>
					<option value="3:2">{{ landscape ? '3:2' : '2:3' }}</option>
					<option value="custom">Custom</option>
				</select>
				<div v-if="currentRatio !== 'none' && currentRatio !== '1:1'" class="flex items-center gap-1.5 text-xs">
					<Toggle size="sm" v-model="landscape" />
					<div>Landscape</div>
				</div>
				<div v-if="currentRatio === 'custom'" class="flex items-center gap-3">
					<div class="flex items-center gap-1">
						<SmallLabel>Width</SmallLabel>
						<input type="number" v-model="aspectWidth" :min="0" :max="256" :step="1" class="border border-neutral-200 text-xxs flex-1 rounded-md py-1.5 px-1" />
					</div>
					<div class="flex items-center gap-1">
						<SmallLabel>Height</SmallLabel>
						<input type="number" v-model="aspectHeight" :min="0" :max="256" :step="1" class="border border-neutral-200 text-xxs flex-1 rounded-md py-1.5 px-1"/>
					</div>
				</div>
				<div class="flex items-center gap-1">
				</div>
			</div>
			<button type="button" class="button small"  @click="saveCrop">Save Crop</button>
		</div>
	</ModalContainer>
</template>
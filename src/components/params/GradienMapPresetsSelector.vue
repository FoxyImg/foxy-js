<script setup lang="ts">
import {useImageParamsStore} from "@/stores/image-params-store";
import {storeToRefs} from "pinia";
import GradientMapPreset from "@/components/params/GradientMapPreset.vue";
import Icon from "@/components/UI/Icon.vue";
import {DefaultImageParams} from "@/types/params";
import { hideAllPoppers } from "floating-vue";
import {useFileDialog} from "@vueuse/core";
//@ts-ignore
import {StreamReader} from "@/lib/grd-parser/stream-reader";
//@ts-ignore
import PSDGradient from "@/lib/grd-parser/psd-gradient";
import colorToHex from "@/utils/hex-color";
import {onMounted} from "vue";

const { files, open, reset, onChange} = useFileDialog({
	accept: '.json,.grd',
	multiple: false,
	directory: false,
});

onChange(files => {
	if (!files || files.length === 0) {
		return;
	}

	const reader = new FileReader();
	reader.onload = (e) => {
		const uint8_array = new Uint8Array((<ArrayBuffer>e.target!.result));
		parseGRD(new StreamReader(uint8_array));
	};
	reader.readAsArrayBuffer(files[0]);
});

function parseGRD(data:StreamReader) {
		const parser = new PSDGradient.IncrementParser(data);
		parser.setup();

		while(parser.hasNext()){
			try{
				const gradient = parser.parse();
				if (gradient.gradient_stops.length === 0 || gradient.gradient_stops[0].color_stop.color_obj.type === 'CMYC') {
					continue;
				}

				const newGradientMap = JSON.parse(JSON.stringify(DefaultImageParams.gradientMap));
				newGradientMap.stops = [];
				for(const stop of gradient.gradient_stops) {
					newGradientMap.stops.push({
						enabled: true,
						stop: Math.floor((stop.color_stop.lctn / 4096.0) * 100),
						color: colorToHex(stop.color_stop.color_obj.color.r, stop.color_stop.color_obj.color.g, stop.color_stop.color_obj.color.b, Math.floor((stop.opacity / 100.0) * 255)),
					});
				}

				if (newGradientMap.stops.length >= 2) {
					gradientMapPresets.value.push(newGradientMap);
				}
			} catch(ex:any) {
				console.log("create gradient error:" + ex.message);
			}
		}
}

const {
	imageParams,
	gradientMapPresets
} = storeToRefs(useImageParamsStore());

function addPreset() {
	gradientMapPresets.value.push(JSON.parse(JSON.stringify(imageParams.value.gradientMap)));
}

function deletePreset(index:number) {
	gradientMapPresets.value.splice(index, 1);
}

function selectPreset(index:number) {
	hideAllPoppers();
	imageParams.value.gradientMap.stops = JSON.parse(JSON.stringify(gradientMapPresets.value[index].stops));
}

onMounted(() => {
	console.log(gradientMapPresets.value);
});

</script>
<template>
	<div class="flex flex-col w-[300px]">
		<div class="h-[160px] relative w-full">
			<div class="absolute inset-0 overflow-y-auto p-1.5">
				<div v-if="gradientMapPresets.length === 0" class="px-10 py-5 text-center text-xs">
					No presets.
				</div>
				<div v-else class="flex flex-col gap-1">
					<div v-for="(preset, index) in gradientMapPresets" :key="index" class="cursor-pointer w-full max-h-[32px] h-[32px] relative group">
						<div class="cursor-pointer w-[32px] aspect-square flex items-center justify-center absolute right-0 top-0" @click="deletePreset(index)">
							<Icon name="delete-source" class="w-4 h-auto fill-red-600"></Icon>
						</div>
						<GradientMapPreset :stops="preset.stops" @click="selectPreset(index)" class="absolute transition-all top-0 h-full w-full left-0 group-hover:w-[calc(100%-32px)]" />
					</div>
				</div>
			</div>
		</div>
		<div class="flex items-center justify-center gap-3 text-xs p-3">
			<button class="px-2 py-1" type="button">Export ...</button>
			<button class="px-2 py-1" type="button" @click="open">Import ...</button>
			<button class="px-2 py-1" type="button" @click="addPreset">Add Preset</button>

		</div>
	</div>
</template>
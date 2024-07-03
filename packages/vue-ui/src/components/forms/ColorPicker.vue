<script setup lang="ts">
import {ref, watch, computed} from "vue";
import shortUUID from "short-uuid";
import {clamp, hsvToRgb, rgbToHsv} from "@foxyimg/utils";

const props = withDefaults(defineProps<{
	modelValue: string|null,
	size: number,
}>(), {
	size: 24
});

const emit = defineEmits<{
	(e: 'update:modelValue', value: string|null): void;
}>();

const currentValue = computed({
	get: () => props.modelValue ?? '#00000000',
	set: (value) => emit('update:modelValue', value),
});

const currentHue = ref(0);
const currentSaturation = ref(1);
const currentBrightness = ref(1);
const currentAlpha = ref(1);

if (props.modelValue) {
	const hsv = rgbToHsv(props.modelValue);
	currentHue.value = hsv.hue;
	currentSaturation.value = hsv.saturation / 100.0;
	currentBrightness.value = hsv.brightness / 100.0;
	currentAlpha.value = hsv.alpha;
}


const currentColor = computed(() => {
	return hsvToRgb(currentHue.value, currentSaturation.value, currentBrightness.value, currentAlpha.value);
});

watch(currentColor, (newVal) => {
	currentValue.value = newVal;
});

const cpHueId = ref('cp-hue-'+shortUUID.generate());
const cpBrightId = ref('cp-bright-'+shortUUID.generate());
const cpHueLineId = ref('cp-hue-line-'+shortUUID.generate());
const cpAlphaId = ref('cp-alpha-'+shortUUID.generate());

const isBrightSatDown = ref(false);
const brightSatRef = ref<HTMLElement|null>(null);
const brightSatRect = ref<DOMRect|null>(null);

function brightSatDown(e:MouseEvent) {
	isBrightSatDown.value = true;
	brightSatRect.value = brightSatRef.value?.getBoundingClientRect();
	document.addEventListener('mousemove', brightSatMove);
	document.addEventListener('mouseup', mouseUp, {once: true});

	if (!brightSatRect.value) {
		return;
	}

	currentSaturation.value = clamp((e.clientX - brightSatRect.value.left) / brightSatRect.value.width, 0, 1);
	currentBrightness.value = clamp(1.0 - ((e.clientY - brightSatRect.value.top) / brightSatRect.value.height), 0, 1);
}

function brightSatMove(e:MouseEvent) {
	if (!isBrightSatDown.value || !brightSatRect.value) {
		return;
	}

	currentSaturation.value = clamp((e.clientX - brightSatRect.value.left) / brightSatRect.value.width, 0, 1);
	currentBrightness.value = clamp(1.0 - ((e.clientY - brightSatRect.value.top) / brightSatRect.value.height), 0, 1);
}

const isHueDown = ref(false);
const hueRef = ref<HTMLElement|null>(null);
const hueRect = ref<DOMRect|null>(null);

function hueDown(e:MouseEvent) {
	isHueDown.value = true;
	hueRect.value = hueRef.value?.getBoundingClientRect();

	document.addEventListener('mousemove', hueMove);
	document.addEventListener('mouseup', mouseUp, {once: true});

	if (!hueRect.value) {
		return;
	}

	currentHue.value = clamp(((e.clientX - hueRect.value.left) / hueRect.value.width) * 360.0, 0, 360.0);
}

function hueMove(e:MouseEvent) {
	if (!isHueDown.value || !hueRect.value) {
		return;
	}

	currentHue.value = clamp(((e.clientX - hueRect.value.left) / hueRect.value.width) * 360.0, 0, 360.0);
}

const isAlphaDown = ref(false);
const alphaRef = ref<HTMLElement|null>(null);
const alphaRect = ref<DOMRect|null>(null);

function alphaDown(e:MouseEvent) {
	isAlphaDown.value = true;
	alphaRect.value = alphaRef.value?.getBoundingClientRect();

	document.addEventListener('mousemove', alphaMove);
	document.addEventListener('mouseup', mouseUp, {once: true});

	if (!alphaRect.value) {
		return;
	}

	currentAlpha.value = clamp((e.clientX - alphaRect.value.left) / alphaRect.value.width, 0, 1.0);
}

function alphaMove(e:MouseEvent) {
	if (!isAlphaDown.value || !alphaRect.value) {
		return;
	}

	currentAlpha.value = clamp((e.clientX - alphaRect.value.left) / alphaRect.value.width, 0, 1.0);
}

function mouseUp(e:MouseEvent) {
	isBrightSatDown.value = false;
	isHueDown.value = false;
	isAlphaDown.value = false;
}
</script>
<template>
	<div>
		<VDropdown>
			<div class="relative aspect-square cursor-pointer rounded-full bg-checkered-white" :style="`width:${size}px; background-size: 10px 10px; background-position: center center;`">
				<div class="absolute w-full h-full rounded-full border border-neutral-200 " :style="`background-color: ${currentValue}`"></div>
			</div>
			<template #popper>
				<div class="flex flex-col w-[240px] p-3 gap-3">
					<div class="relative w-full">
						<svg ref="brightSatRef" @mousedown="brightSatDown" class="cursor-pointer w-full aspect-square" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
							<defs>
								<linearGradient :id="cpHueId" x1="0%" y1="0%" x2="100%" y2="0%">
									<stop offset="0%" :stop-color="`hsl(${currentHue},100%,100%)`" />
									<stop offset="100%" :stop-color="`hsl(${currentHue},100%,50%)`" />
								</linearGradient>
								<linearGradient :id="cpBrightId" x1="0%" y1="0%" x2="0%" y2="100%">
									<stop offset="0%" :stop-color="`rgba(0,0,0,0)`" />
									<stop offset="100%" stop-color="black" />
								</linearGradient>
							</defs>
							<rect width="100%" height="100%" :fill="`url(#${cpHueId})`" />
							<rect width="100%" height="100%" :fill="`url(#${cpBrightId})`" />
						</svg>
						<div
							class="cursor-pointer bg-white border aspect-square w-[14px] rounded-full drop-shadow-lg absolute -translate-y-1/2 -translate-x-1/2"
							:style="`left: ${currentSaturation * 100}%; top: ${(1.0 - currentBrightness) * 100}%;`"></div>
					</div>
					<div class="relative w-full">
						<svg ref="hueRef" @mousedown="hueDown" class="cursor-pointer w-full h-[12px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 12">
							<defs>
								<linearGradient :id="cpHueLineId" x1="0%" y1="0%" x2="100%" y2="0%">
									<stop offset="0%" stop-color="hsl(0,100%,50%)" />
									<stop offset="16.66666667%" stop-color="hsl(60,100%,50%)" />
									<stop offset="33.33333333%" stop-color="hsl(120,100%,50%)" />
									<stop offset="50%" stop-color="hsl(180,100%,50%)" />
									<stop offset="66.66666667%" stop-color="hsl(240,100%,50%)" />
									<stop offset="83.33333333%" stop-color="hsl(300,100%,50%)" />
									<stop offset="100%" stop-color="hsl(360,100%,50%)" />
								</linearGradient>
							</defs>
							<rect width="100%" height="100%" :fill="`url(#${cpHueLineId})`" rx="6" ry="6"/>
						</svg>
						<div class="cursor-pointer bg-white border aspect-square w-[14px] rounded-full drop-shadow-lg absolute top-1/2 -translate-y-1/2 -translate-x-1/2" :style="`left: ${(currentHue / 360.0) * 100}%`"></div>
					</div>
					<div class="relative w-full">
						<div ref="alphaRef" @mousedown="alphaDown" class="cursor-pointer relative w-full bg-checkered-white overflow-hidden rounded-full h-[12px]"  style="background-size: 10px 10px; background-position: center center;">
							<svg class="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 12">
								<defs>
									<linearGradient :id="cpAlphaId" x1="0%" y1="0%" x2="100%" y2="0%">
										<stop offset="0%" stop-color="rgba(0,0,0,0)" />
										<stop offset="100%" stop-color="rgba(0,0,0,255)" />
									</linearGradient>
								</defs>
								<rect width="100%" height="100%" :fill="`url(#${cpAlphaId})`"/>
							</svg>
						</div>
						<div class="cursor-pointer bg-white border aspect-square w-[14px] rounded-full drop-shadow-lg absolute top-1/2 -translate-y-1/2 -translate-x-1/2" :style="`left: ${currentAlpha * 100}%`"></div>
					</div>
				</div>
			</template>
		</VDropdown>
	</div>
</template>

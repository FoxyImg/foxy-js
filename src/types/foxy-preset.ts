import type {DeepPartial} from "@/types/deep-partial";

export type FoxyBoundsPreset = {
	index: number|null,
	padding: number|null,
	zoom: number|null,
	hGravity: "left"|"center"|"right",
	vGravity: "top"|"center"|"bottom",
	largest: boolean|null,
	smallest: boolean|null,
	focus: boolean|null
}

export type FoxyFocalPointPreset = {
	x: number|null,
	y: number|null,
	zoom: number|null
}

export type FoxyBorderPreset = {
	color: string,
	left: number,
	top: number,
	right: number,
	bottom: number,
}

export type FoxyExportPreset = {
	format: "webp" | "png" | "jpg" | "avif" | null,
	quality: number | null
	reductionEffort: number | null,
	lossless: boolean | null,
	nearLossless: boolean | null,
}

export type FoxyFullPreset = {
	vision: boolean,
	crop: string[]|null,
	width: number|null,
	height: number|null,
	aspectRatio: number|null,
	zoom: number|null,
	hGravity: "left"|"center"|"right",
	vGravity: "top"|"center"|"bottom",
	face: FoxyBoundsPreset|null,
	person: FoxyBoundsPreset|null,
	interesting: number|null,
	focalPoint: FoxyFocalPointPreset|null,
	bgColor: string|null,
	padding: FoxyBorderPreset|null,
	border: FoxyBorderPreset|null,
	rotate: number|null,
	flipH: boolean|null,
	flipV: boolean|null,
	brightness: number|null,
	saturation: number|null,
	hue: number|null,
	export: FoxyExportPreset|null,
	blur: number|null,

}

export type FoxyPreset = DeepPartial<FoxyFullPreset>;

export const DefaultFoxyPreset: FoxyFullPreset = {
	vision: false,
	crop: null,
	width: null,
	height: null,
	aspectRatio: null,
	zoom: null,
	hGravity: "center",
	vGravity: "center",
	face: {
		index: null,
		padding: 8,
		zoom: null,
		hGravity: "center",
		vGravity: "top",
		largest: null,
		smallest: null,
		focus: false
	},
	person: {
		index: null,
		padding: 0,
		zoom: null,
		hGravity: "center",
		vGravity: "center",
		largest: null,
		smallest: null,
		focus: false
	},
	interesting: null,
	focalPoint: {
		x: 0.5,
		y: 0.5,
		zoom: null
	},
	bgColor: "#00000000",
	padding: null,
	border: null,
	rotate: null,
	flipH: null,
	flipV: null,
	brightness: null,
	saturation: null,
	hue: null,
	export: {
		format: "webp",
		quality: 85,
		reductionEffort: null,
		lossless: null,
		nearLossless: null
	},
	blur: null,
}
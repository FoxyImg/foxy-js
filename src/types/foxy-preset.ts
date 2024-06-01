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

export type FoxyRect = {
	left: number,
	top: number,
	width: number,
	height: number,
}

export type FoxyRedactPreset = {
	faces: number[]|null,
	people: number[]|null,
	regions: FoxyRect[]|null,
	blur: number|null,
	blurMask: number|null,
	expandMask: number|null,
	pixelateMask: number|null,
	useColor: boolean|null,
	color: string|null,
	pixelate: number|null,
}

export type FoxySizePreset = {
	crop: string[],
	width: number|null,
	height: number|null,
	aspectRatio: number|null,
	zoom: number|null,
	hGravity: "left"|"center"|"right"|null,
	vGravity: "top"|"center"|"bottom"|null,
	face: FoxyBoundsPreset|null,
	person: FoxyBoundsPreset|null,
	interesting: number|null,
	focalPoint: FoxyFocalPointPreset|null,
}

export type FoxyStylizePreset = {
	blur: number|null,
	pixelate: number|null,
	order: string[]|null,
}

export type FoxyFullPreset = {
	vision: boolean,

	size: FoxySizePreset|null,

	bgColor: string|null,

	padding: FoxyBorderPreset|null,
	border: FoxyBorderPreset|null,
	redact: FoxyRedactPreset|null,
	stylize: FoxyStylizePreset|null,

	export: FoxyExportPreset|null,
}

export type FoxyPreset = DeepPartial<FoxyFullPreset>;


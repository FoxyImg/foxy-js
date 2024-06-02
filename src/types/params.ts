
export type BoxCropParams = {
	index: number,
	hGravity: 'left' | 'center' | 'right',
	vGravity: 'top' | 'center' | 'bottom',
	padding: number,
	zoom: number,
	focus: boolean,
}

export type BorderParams = {
	color: string|null,
	left: number,
	top: number,
	right: number,
	bottom: number,
}

export type Rect = {
	left: number,
	top: number,
	width: number,
	height: number,
}

export type RedactParams = {
	faces: string[],
	people: string[],
	regions: Rect[],
	blur: number,
	expandMask: number,
	blurMask: number,
	pixelateMask: number,
	useColor: boolean,
	color: string|null,
	pixelate: number,
}

export const StylizeOrderOptions = [
	{ label: 'Blur', value: 'blur' },
	{ label: 'Pixelate', value: 'px' },
];

export type GradientStops = {
	enabled: boolean,
	stop: number,
	color: string,
}

export const enum BlendModes {
	BlendModeClear = 0,
	BlendModeSource = 1,
	BlendModeOver = 2,
	BlendModeIn = 3,
	BlendModeOut = 4,
	BlendModeAtop = 5,
	BlendModeDest = 6,
	BlendModeDestOver = 7,
	BlendModeDestIn = 8,
	BlendModeDestOut = 9,
	BlendModeDestAtop = 10,
	BlendModeXOR = 11,
	BlendModeAdd = 12,
	BlendModeSaturate = 13,
	BlendModeMultiply = 14,
	BlendModeScreen = 15,
	BlendModeOverlay = 16,
	BlendModeDarken = 17,
	BlendModeLighten = 18,
	BlendModeColorDodge = 19,
	BlendModeColorBurn = 20,
	BlendModeHardLight = 21,
	BlendModeSoftLight = 22,
	BlendModeDifference = 23,
	BlendModeExclusion = 24,
}

export const BlendModeOptions = [
	{ label: 'Clear', value: BlendModes.BlendModeClear },
	{ label: 'Source', value: BlendModes.BlendModeSource },
	{ label: 'Over', value: BlendModes.BlendModeOver },
	{ label: 'In', value: BlendModes.BlendModeIn },
	{ label: 'Out', value: BlendModes.BlendModeOut },
	{ label: 'Atop', value: BlendModes.BlendModeAtop },
	{ label: 'Dest', value: BlendModes.BlendModeDest },
	{ label: 'Dest Over', value: BlendModes.BlendModeDestOver },
	{ label: 'Dest In', value: BlendModes.BlendModeDestIn },
	{ label: 'Dest Out', value: BlendModes.BlendModeDestOut },
	{ label: 'Dest Atop', value: BlendModes.BlendModeDestAtop },
	{ label: 'XOR', value: BlendModes.BlendModeXOR },
	{ label: 'Add', value: BlendModes.BlendModeAdd },
	{ label: 'Saturate', value: BlendModes.BlendModeSaturate },
	{ label: 'Multiply', value: BlendModes.BlendModeMultiply },
	{ label: 'Screen', value: BlendModes.BlendModeScreen },
	{ label: 'Overlay', value: BlendModes.BlendModeOverlay },
	{ label: 'Darken', value: BlendModes.BlendModeDarken },
	{ label: 'Lighten', value: BlendModes.BlendModeLighten },
	{ label: 'Color Dodge', value: BlendModes.BlendModeColorDodge },
	{ label: 'Color Burn', value: BlendModes.BlendModeColorBurn },
	{ label: 'Hard Light', value: BlendModes.BlendModeHardLight },
	{ label: 'Soft Light', value: BlendModes.BlendModeSoftLight },
	{ label: 'Difference', value: BlendModes.BlendModeDifference },
	{ label: 'Exclusion', value: BlendModes.BlendModeExclusion },
]

export type GradientMap = {
	stops: GradientStops[],
	opacity: number,
	blendMode: BlendModes,
}

export type StylizeParams = {
	blur: number,
	pixelate: number,
	brightness: number,
	saturation: number,
	hue: number,
	order: string[],
	gradientMap: GradientMap,
}


export const ExportFormatOptions = [
	{ label: 'WebP', value: 'webp' },
	{ label: 'PNG', value: 'png' },
	{ label: 'JPG', value: 'jpg' },
	{ label: 'AVIF', value: 'avif' },
]

export type ExportParams = {
	format: string,
	quality: number,
	reductionEffort: number,
	lossless: boolean,
	nearLossless: boolean,
}


export type ImageParams = {
	enableCrop: boolean,
	crop: string[],
	width: number,
	height: number,
	aspectRatioWidth: number,
	aspectRatioHeight: number,
	zoom: number,
	smartMode: string|null,
	hGravity: string,
	vGravity: string,
	focalPoint: { x: number, y: number },
	focalPointZoom: number,

	face: BoxCropParams,
	person: BoxCropParams,

	enableStylize: boolean,
	stylize: StylizeParams,

	backgroundColor: string|null,

	enablePadding: boolean,
	padding: BorderParams,

	enableBorder: boolean,
	border: BorderParams,

	enableRedact: boolean,
	redact: RedactParams,

	export: ExportParams,
}

export type DebugParams = {
	faces: boolean,
	allFaces: boolean,
	people: boolean,
	allPeople: boolean,
	otherLabels: boolean,

	disableSourceCache: boolean,
	disableMetaCache: boolean,
	disableRenderCache: boolean,
}

export const DefaultImageParams: ImageParams = {
	enableCrop: true,
	crop: [],
	width: 0,
	height: 0,
	aspectRatioWidth: 0,
	aspectRatioHeight: 0,
	zoom: 1,
	smartMode: null,
	hGravity: 'center',
	vGravity: 'center',
	focalPoint: { x: 0.5, y: 0.5 },
	focalPointZoom: 0,

	enableStylize: true,
	stylize: {
		blur: 0,
		pixelate: 0,
		brightness: 100,
		saturation: 100,
		hue: 0,
		order: ['blur', 'px'],
		gradientMap: {
			stops: [
				{ enabled: true, stop: 0, color: '#000000' },
				{ enabled: true, stop: 100, color: '#ffffff' },
			],
			opacity: 0,
			blendMode: BlendModes.BlendModeOver,
		}
	},

	face: {
		index: -1,
		hGravity: 'center',
		vGravity: 'top',
		padding: 8,
		zoom: 0,
		focus: false,
	},

	person: {
		index: -1,
		hGravity: 'center',
		vGravity: 'center',
		padding: 0,
		zoom: 0,
		focus: false,
	},

	backgroundColor: null,

	enablePadding: true,
	padding: {
		color: null,
		left: 0,
		top: 0,
		right: 0,
		bottom: 0,
	},

	enableBorder: true,
	border: {
		color: null,
		left: 0,
		top: 0,
		right: 0,
		bottom: 0,
	},

	enableRedact: true,
	redact: {
		faces: [],
		people: [],
		regions: [],
		blur: 0,
		expandMask: 0,
		pixelateMask: 0,
		blurMask: 0,
		useColor: false,
		color: null,
		pixelate: 0,
	},

	export: {
		format: 'webp',
		quality: 85,
		reductionEffort: 4,
		lossless: false,
		nearLossless: false,
	},
}

export function buildImageParams(imageParams: Partial<ImageParams>) {
	return Object.assign(JSON.parse(JSON.stringify(DefaultImageParams)), imageParams);
}
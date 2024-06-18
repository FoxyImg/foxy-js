
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

export type RedactRect = Rect & {
	cornerRadius: number,
	rotation: number,
}

export type RedactParams = {
	faces: string[],
	people: string[],
	regions: RedactRect[],
	blur: number,
	expandMask: number,
	blurMask: number,
	pixelateMask: number,
	useColor: boolean,
	color: string|null,
	pixelate: number,
	cornerRadius: number,
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
	monochrome: boolean,
	blur: number,
	blendMode: BlendModes,
}

export type StylizeParams = {
	order: string[],
	blur: number,
	pixelate: number,
}

export type AdjustmentsParams = {
	brightness: number,
	saturation: number,
	hue: number,
	contrast: number,
	exposure: number,
	gamma: number,
	vibrance: number,
	invert: boolean,
	texture: number,
	textureDensity: number,
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

export const RotationModeOptions = [
	{ label: 'None', value: 'none' },
	{ label: 'Fit', value: 'fit' },
	{ label: 'Fill', value: 'fill' },
]

export type RotationParams = {
	rotation: number,
	mode: string
}

export const RotationOptions = [
	{ label: 'None', value: 0 },
	{ label: '90', value: 90 },
	{ label: '180', value: 180 },
	{ label: '270', value: 270 },
]

export type SourceCropParams = {
	x: number,
	y: number,
	width: number,
	height: number,
}

export const OverlayTypeOptions = [
	{ label: 'Image', value: 'image' },
	{ label: 'Text', value: 'text' },
]

export type DropShadowParams = {
	enabled: boolean,
	opacity: number,
	blur: number,
	color: string,
	offsetX: number,
	offsetY: number,
}

export const FitOptions = [
	{ label: 'Fit', value: 'fit' },
	{ label: 'Fill', value: 'fill' },
	{ label: 'Crop', value: 'crop' },
]

export const MaskTypeOptions = [
	{ label: 'Image', value: 'image' },
	{ label: 'Rect', value: 'rect' },
	{ label: 'Square', value: 'square' },
	{ label: 'Ellipse', value: 'ellipse' },
	{ label: 'Circle', value: 'circle' },
]

export const MaskFitOptions = [
	{ label: 'Fit', value: 'fit' },
	{ label: 'Fill', value: 'fill' },
	{ label: 'Stretch', value: 'stretch' },
]

export type MaskParams = {
	type: 'image' | 'rect' | 'square' | 'ellipse' | 'circle',
	imageKey: string|null,
	cornerRadius: number,
	fit: 'fit' | 'fill' | 'stretch',
}

export type OverlaySizeParams = {
	relativeSize: boolean,
	width: number,
	height: number,
	minWidth: number,
	minHeight: number,
	maxWidth: number,
	maxHeight: number,
}

export const OverlayBackgroundColorTypeOptions = [
	{ label: 'Color', value: 'color' },
	{ label: 'Dominant', value: 'dom' },
	{ label: 'Lightest', value: 'light' },
	{ label: 'Darkest', value: 'dark' },
]

export type OverlayBackgroundParams = OverlaySizeParams & {
	enabled: boolean,
	backgroundColor: string,
	backgroundColorType: 'color' | 'dominant' | 'lightest' | 'darkest',
	dominantColorOpacity: number,
	blur: number,
	saturation: number,
	contrast: number,
	brightness: number,
	cornerRadius: number,
	relativePadding: boolean,
	hPadding: number,
	vPadding: number,
	hAlign: 'left'|'center'|'right',
	vAlign: 'top'|'center'|'bottom',
}

export type OverlaySubstitutionParam = {
	key: string,
	value: string,
}

export type OverlayParams =  OverlaySizeParams & {
	id: string,
	enabled: boolean,
	type: 'image'|'text'
	text: string|null,
	font: string|null,
	url: string|null,
	opacity: number,
	rotate: number,
	relativeCoords: boolean,
	hPadding: number,
	vPadding: number,
	x: number,
	y: number,
	fit: 'fit' | 'fill' | 'crop',
	hAnchor: 'left'|'center'|'right',
	vAnchor: 'top'|'center'|'bottom',
	textColor: string|null,
	fillColor: string|null,
	strokeColor: string|null,
	strokeWidth: number,
	dropShadow: DropShadowParams,
	background: OverlayBackgroundParams,
	trim: boolean,
	substitutions: OverlaySubstitutionParam[],
}

export const DefaultOverlayParams: OverlayParams = {
	id: '',
	type: 'image',
	enabled: true,
	relativeCoords: false,
	hPadding: 0,
	vPadding: 0,
	x: 0,
	y: 0,
	relativeSize: false,
	width: 0,
	height: 0,
	minWidth: 0,
	minHeight: 0,
	maxWidth: 0,
	maxHeight: 0,
	fit: 'fit',
	hAnchor: 'right',
	vAnchor: 'bottom',
	textColor: '#000000',
	fillColor: null,
	strokeColor: null,
	strokeWidth: 0,
	text: null,
	font: null,
	url: null,
	opacity: 100,
	rotate: 0,
	trim: true,
	substitutions: [],
	dropShadow: {
		enabled: false,
		opacity: 100,
		blur: 3,
		color: '#000000',
		offsetX: 1,
		offsetY: 1,
	},
	background: {
		enabled: false,
		backgroundColor: "#00000000",
		backgroundColorType: 'color',
		dominantColorOpacity: 100,
		blur: 0,
		saturation: 100,
		contrast: 1,
		brightness: 100,
		cornerRadius: 0,
		relativePadding: false,
		hPadding: 0,
		vPadding: 0,
		hAlign: 'left',
		vAlign: 'top',
		relativeSize: false,
		width: 0,
		height: 0,
		minWidth: 0,
		minHeight: 0,
		maxWidth: 0,
		maxHeight: 0,
	}
}

export type ImageParams = {
	enableSourceCrop: boolean,
	sourceCrop: SourceCropParams,

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

	enabledRotation: boolean,
	rotation: RotationParams,

	enableStylize: boolean,
	stylize: StylizeParams,

	enableGradientMap: boolean,
	gradientMap: GradientMap,

	enableAdjustments: boolean,
	adjustments: AdjustmentsParams,

	backgroundColor: string|null,

	enablePadding: boolean,
	padding: BorderParams,

	enableBorder: boolean,
	border: BorderParams,

	enableRedact: boolean,
	redact: RedactParams,

	enableMask: boolean,
	mask: MaskParams,

	encodeOverlays: boolean,
	enabledOverlays: boolean,
	overlays: OverlayParams[],

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
	enableSourceCrop: true,
	sourceCrop: {
		x: 0,
		y: 0,
		width: 0,
		height: 0,
	},

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

	enabledRotation: true,
	rotation: {
		rotation: 0,
		mode: 'none',
	},

	enableStylize: true,
	stylize: {
		blur: 0,
		pixelate: 0,
		order: ['blur', 'px'],
	},

	enableAdjustments: true,
	adjustments: {
		brightness: 100,
		saturation: 100,
		contrast: 1,
		exposure: 0,
		gamma: 1,
		hue: 0,
		vibrance: 0,
		invert: false,
		texture: 0,
		textureDensity: 100,
	},

	enableGradientMap: true,
	gradientMap: {
		monochrome: true,
		blur: 0,
		stops: [
			{ enabled: true, stop: 0, color: '#000000' },
			{ enabled: true, stop: 100, color: '#ffffff' },
		],
		opacity: 0,
		blendMode: BlendModes.BlendModeOver,
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
		cornerRadius: 0,
	},

	enableMask: false,
	mask: {
		type: 'circle',
		imageKey: null,
		cornerRadius: 0,
		fit: 'fit',
	},

	encodeOverlays: true,
	enabledOverlays: true,
	overlays: [],

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
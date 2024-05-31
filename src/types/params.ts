
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

export type ImageParams = {
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

	backgroundColor: string|null,

	padding: BorderParams,
	border: BorderParams,

	redact: RedactParams,
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

	padding: {
		color: null,
		left: 0,
		top: 0,
		right: 0,
		bottom: 0,
	},

	border: {
		color: null,
		left: 0,
		top: 0,
		right: 0,
		bottom: 0,
	},

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
}

export function buildImageParams(imageParams: Partial<ImageParams>) {
	return Object.assign(JSON.parse(JSON.stringify(DefaultImageParams)), imageParams);
}
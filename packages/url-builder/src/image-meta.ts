export type Box = {
	left: number,
	top: number,
	width: number,
	height: number,
}

export type Face = {
	box: Box,
	gender: string,
	age: {
		high: number,
		low: number,
	},
	rotation: number,
	confidence: number,
}

export type Label = {
	name: string,
	box: Box|null,
	confidence: number,
}

export type UsedColor = {
	used: number,
	r: number,
	g: number,
	b: number,
	l: number,
}

export type DominantColors = {
	lightest: UsedColor|null,
	darkest: UsedColor|null,
	colors: UsedColor[],
}

export type VideoMeta = {
	width: number,
	height: number,
	duration: number,
	fps: number,
	frameCount: number,
	keyframeCount: number,
}

export type ImageMeta = {
	width: number,
	height: number,
	faces: Face[],
	labels: Label[],
	people: Label[],
	moderationLabels: Label[],
	dominantColors: DominantColors,
	video?: VideoMeta,
}

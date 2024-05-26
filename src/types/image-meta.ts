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

export type ImageMeta = {
	faces: Face[],
	labels: Label[],
	people: Label[],
	moderationLabels: Label[],
}
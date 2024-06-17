export type FoxySource = {
	type: "web" | "local" | "s3",
	name: string,
	key: string|null,
	sampleImages: string[]
	overlayImages: string[]
}

export const DefaultFoxySource: FoxySource = {
	type: "s3",
	name: "Default",
	key: null,
	sampleImages: [],
	overlayImages: [],
}
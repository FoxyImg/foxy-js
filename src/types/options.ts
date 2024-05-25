export const CropOptions = [
	{ value: "face", label: "Faces" },
	{ value: "person", label: "People" },
	{ value: "smart", label: "Smart" },
	{ value: "crop", label: "Crop" },
	{ value: "fit", label: "Fit" },
]

export const DebugOptions = {
	debug: 'Debug Enabled',
}

export const InterestingOptions = {
	attention: "Attention",
	entropy: "Entropy",
	high: "High",
	low: "Low",
	center: "Center",
}

export const HGravityOptions = {
	left: "Left",
	center: "Center",
	right: "Right",
}

export const VGravityOptions = {
	top: "Top",
	center: "Center",
	bottom: "Bottom",
}

export const SourceTypeOptions = {
	local: "Local",
	s3: "S3",
	web: "Web",
}

export type FoxySource = {
	type: "web" | "local" | "s3",
	name: string,
	url: string|null,
	key: string|null,
	secret: string|null,
	sampleImages: string[]
}
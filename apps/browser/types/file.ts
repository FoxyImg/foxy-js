export type PreviewUrls = {
	mimeType?: string,
	small: string,
	large: string,
	xl: string,
}

export type FileMeta = {
	width: number,
	height: number,
	description: string|null,
	copyright: string|null,
	videoCodec?: string,
	audioCodec?: string,
	fps?: number,
	frameCount?: number,
	duration?: number,
	tags: string[],
}

export type File = {
	name: string,
	path: string,
	dir?:string,
	subdirs?: number,
	images?: number,
	videos?: number,
	other?: number,
	type: 'dir' | 'file',
	mimeType?: string,
	size: number,
	lastModified: string,
	created: string,
	preview?: PreviewUrls,
	folderPreviews?: PreviewUrls[],
	meta?: FileMeta,
}
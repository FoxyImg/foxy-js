export type PreviewUrls = {
	mimeType?: string,
	small: string,
	large: string,
	xl: string,
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
	lastModified: Date,
	preview?: PreviewUrls,
	folderPreviews?: PreviewUrls[],
}
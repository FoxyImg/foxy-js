export type PreviewUrls = {
	mimeType?: string,
	small: string,
	large: string,
	xl: string,
}

export type File = {
	name: string,
	path: string,
	type: 'dir' | 'file',
	mimeType?: string,
	size: number,
	lastModified: number,
	preview?: PreviewUrls,
	folderPreviews?: PreviewUrls[],
}
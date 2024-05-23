export type ImageParams = {
	crop: string[],
	width: number,
	height: number,
	aspectRatioWidth: number,
	aspectRatioHeight: number,
	faceIndex: number,
	personIndex: number,
	smartMode: string|null,

	backgroundColor: string|null,

	debugFaces: boolean,
	debugAllFaces: boolean,
	debugPeople: boolean,
	debugAllPeople: boolean,
	debugOtherLabels: boolean,

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
	faceIndex: -1,
	personIndex: -1,
	smartMode: null,

	backgroundColor: null,

	debugFaces: false,
	debugAllFaces: false,
	debugPeople: false,
	debugAllPeople: false,
	debugOtherLabels: false,

	disableSourceCache: false,
	disableMetaCache: false,
	disableRenderCache: false,
}
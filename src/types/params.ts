export type ImageParams = {
	crop: string[],
	width: number,
	height: number,
	aspectRatioWidth: number,
	aspectRatioHeight: number,
	zoom: number,
	faceIndex: number,
	personIndex: number,
	smartMode: string|null,
	hGravity: string,
	vGravity: string,

	faceHGravity: string,
	faceVGravity: string,
	facePadding: number,
	faceZoom: number,


	personHGravity: string,
	personVGravity: string,
	personPadding: number,
	personZoom: number,

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
	zoom: 1,
	faceIndex: -1,
	personIndex: -1,
	smartMode: null,
	hGravity: 'center',
	vGravity: 'center',

	faceHGravity: 'center',
	faceVGravity: 'top',
	facePadding: 8,
	faceZoom: 0,

	personHGravity: 'center',
	personVGravity: 'center',
	personPadding: 0,
	personZoom: 0,

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
import type {ImageParams} from "@/types/params";
import signHMAC256 from "@/utils/sign";

export default async function buildUrl(host:string, accessKey:string|null, secret:string, imageKey:string, imageParams:ImageParams) {
	let encodedKey = btoa('/'+imageKey);
	let newUrl = accessKey ? `/${accessKey}/${encodedKey}` : `/${encodedKey}`;

	//region Crop Params
	if (imageParams.crop.length > 0) {
		newUrl += `/crop:${imageParams.crop.join(',')}`;
	}

	if (imageParams.width > 0) {
		newUrl += `/w:${imageParams.width}`;
	}

	if (imageParams.height > 0) {
		newUrl += `/h:${imageParams.height}`;
	}

	if (imageParams.crop.includes('face') && imageParams.faceIndex > -1) {
		newUrl += `/face:${imageParams.faceIndex}`;
	}

	if (imageParams.crop.includes('person') && imageParams.personIndex > -1) {
		newUrl += `/person:${imageParams.personIndex}`;
	}

	if (imageParams.crop.includes('smart') && imageParams.smartMode) {
		newUrl += `/smart:${imageParams.smartMode}`;
	}

	if (imageParams.aspectRatioWidth > 0 && imageParams.aspectRatioHeight > 0) {
		newUrl += `/ar:${imageParams.aspectRatioWidth}:${imageParams.aspectRatioHeight}`;
	}

	//endregion


	//region Image Attributes
	if (imageParams.backgroundColor) {
		newUrl += `/bg:${imageParams.backgroundColor}`;
	}

	//endregion


	//region Debug Params
	const debug:string[] = [];

	if (imageParams.debugFaces) {
		debug.push('faces');
	}

	if (imageParams.debugAllFaces) {
		debug.push('all-faces');
	}

	if (imageParams.debugPeople) {
		debug.push('people');
	}

	if (imageParams.debugAllPeople) {
		debug.push('all-people');
	}

	if (imageParams.debugOtherLabels) {
		debug.push('other-labels');
	}

	if (debug.length > 0) {
		newUrl += `/debug:${debug.join(',')}`;
	}

	const nocache:string[] = [];

	if (imageParams.disableSourceCache) {
		nocache.push('source');
	}

	if (imageParams.disableMetaCache) {
		nocache.push('meta');
	}

	if (imageParams.disableRenderCache) {
		nocache.push('render');
	}

	if (nocache.length > 0) {
		newUrl += `/nocache:${nocache.join(',')}`;
	}

	//endregion


	const sig = await signHMAC256(secret, newUrl);
	return host + newUrl + `?_=${new Date().getTime()}&s=`+sig;
}
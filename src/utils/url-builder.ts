import type {ImageParams} from "@/types/params";
import signHMAC256 from "@/utils/sign";

export default function buildUrl(host:string, accessKey:string|null, secret:string, imageKey:string, imageParams:ImageParams) {
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

	if (imageParams.crop.includes('smart') && imageParams.smartMode) {
		newUrl += `/smart:${imageParams.smartMode}`;
	}

	if (imageParams.aspectRatioWidth > 0 && imageParams.aspectRatioHeight > 0) {
		newUrl += `/ar:${imageParams.aspectRatioWidth}:${imageParams.aspectRatioHeight}`;
	}

	if (imageParams.zoom > 1) {
		newUrl += `/zoom:${imageParams.zoom}`;
	}

	if (imageParams.hGravity || imageParams.vGravity) {
		const hg = imageParams.hGravity ?? 'center';
		const vg = imageParams.vGravity ?? 'center';

		let gravity = `${hg}:${vg}`;
		gravity = gravity === 'center:center' ? 'center' : gravity;

		if (gravity !== 'center') {
			newUrl += `/gravity:${gravity}`;
		}
	}

	if (imageParams.crop.includes('face') && imageParams.facePadding != 8) {
		newUrl += `/face:pad:${imageParams.facePadding}`;
	}

	if (imageParams.crop.includes('face') && imageParams.faceIndex > -1) {
		newUrl += `/face:index:${imageParams.faceIndex}`;
	}

	if (imageParams.crop.includes('face') && imageParams.faceIndex < -1) {
		if (imageParams.faceIndex === -2) {
			newUrl += `/face:index:largest`;
		} else {
			newUrl += `/face:index:smallest`;
		}
	}

	if (imageParams.crop.includes('face') && imageParams.faceZoom > 0) {
		newUrl += `/face:zoom:${imageParams.faceZoom}`;
	}

	if (imageParams.faceVGravity !== 'top' || imageParams.faceHGravity !== 'center') {
		newUrl += `/face:gravity:${imageParams.faceHGravity}:${imageParams.faceVGravity}`;
	}

	if (imageParams.crop.includes('person') && imageParams.personPadding > 0) {
		newUrl += `/person:pad:${imageParams.personPadding}`;
	}

	if (imageParams.crop.includes('person') && imageParams.personIndex > -1) {
		newUrl += `/person:index:${imageParams.personIndex}`;
	}

	if (imageParams.crop.includes('person') && imageParams.personIndex < -1) {
		if (imageParams.personIndex === -2) {
			newUrl += `/person:index:largest`;
		} else {
			newUrl += `/person:index:smallest`;
		}
	}

	if (imageParams.crop.includes('person') && imageParams.personZoom > 0) {
		newUrl += `/person:zoom:${imageParams.personZoom}`;
	}

	if (imageParams.personVGravity !== 'center' || imageParams.personHGravity !== 'center') {
		newUrl += `/person:gravity:${imageParams.personHGravity}:${imageParams.personVGravity}`;
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


	return host + newUrl + `?_=${new Date().getTime()}&s=`+signHMAC256(secret, newUrl);
}
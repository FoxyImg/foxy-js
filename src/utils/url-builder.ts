import type {BoxCropParams, DebugParams, ImageParams} from "@/types/params";
import signHMAC256 from "@/utils/sign";

export default function buildUrl(host:string, accessKey:string|null, secret:string, imageKey:string, imageParams:ImageParams, debugParams:DebugParams|null = null, preset:boolean = false) {
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

	const processBoxParams = (noun:string, params:BoxCropParams) => {
		if (params.padding != 8) {
			newUrl += `/${noun}:pad:${params.padding}`;
		}

		if (params.index > -1) {
			newUrl += `/${noun}:index:${params.index}`;
		} else if (params.index < -1) {
			if (params.index === -2) {
				newUrl += `/${noun}:index:largest`;
			} else {
				newUrl += `/${noun}:index:smallest`;
			}
		}

		if (params.zoom > 0) {
			newUrl += `/${noun}:zoom:${params.zoom}`;
		}

		if (params.vGravity !== 'top' || params.hGravity !== 'center') {
			newUrl += `/${noun}:gravity:${params.hGravity}:${params.vGravity}`;
		}

		if (params.focus) {
			newUrl += `/${noun}:focus`;
		}
	}

	if (imageParams.crop.includes('face')) {
		processBoxParams('face', imageParams.face);
	}

	if (imageParams.crop.includes('person')) {
		processBoxParams('person', imageParams.person);
	}

	if (imageParams.crop.includes('focus')) {
		const fpx = imageParams.focalPoint.x.toFixed(4);
		const fpy = imageParams.focalPoint.y.toFixed(4);
		newUrl += `/fp:${fpx}:${fpy}`;

		if (imageParams.focalPointZoom > 0) {
			newUrl += `/fp:zoom:${imageParams.focalPointZoom}`;
		}
	}
	//endregion


	//region Image Attributes
	if (imageParams.backgroundColor) {
		newUrl += `/bg:${imageParams.backgroundColor}`;
	}

	//endregion


	//region Debug Params
	const debug:string[] = [];

	if (debugParams) {
		if (debugParams.faces) {
			debug.push('faces');
		}

		if (debugParams.allFaces) {
			debug.push('all-faces');
		}

		if (debugParams.people) {
			debug.push('people');
		}

		if (debugParams.allPeople) {
			debug.push('all-people');
		}

		if (debugParams.otherLabels) {
			debug.push('other-labels');
		}

		if (debug.length > 0) {
			newUrl += `/debug:${debug.join(',')}`;
		}

		const nocache:string[] = [];

		if (debugParams.disableSourceCache) {
			nocache.push('source');
		}

		if (debugParams.disableMetaCache) {
			nocache.push('meta');
		}

		if (debugParams.disableRenderCache) {
			nocache.push('render');
		}

		if (nocache.length > 0) {
			newUrl += `/nocache:${nocache.join(',')}`;
		}
	}


	//endregion


	return host + newUrl + `?_=${new Date().getTime()}&s=`+signHMAC256(secret, newUrl)+(preset ? '&preset': '');
}
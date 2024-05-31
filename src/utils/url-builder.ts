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

	if (imageParams.padding.left > 0 || imageParams.padding.top > 0 || imageParams.padding.right > 0 || imageParams.padding.bottom > 0) {
		if (imageParams.padding.left === imageParams.padding.top && imageParams.padding.top === imageParams.padding.right && imageParams.padding.right == imageParams.padding.bottom) {
			newUrl += `/pad:${imageParams.padding.color ?? '00000000'}:${imageParams.padding.left}`;
		} else if (imageParams.padding.left === imageParams.padding.right && imageParams.padding.top == imageParams.padding.bottom) {
			newUrl += `/pad:${imageParams.padding.color}:${imageParams.padding.left}:${imageParams.padding.top}`;
		} else {
			newUrl += `/pad:${imageParams.padding.color}:${imageParams.padding.left}:${imageParams.padding.top}:${imageParams.padding.right}:${imageParams.padding.bottom}`;
		}
	}

	if (imageParams.border.left > 0 || imageParams.border.top > 0 || imageParams.border.right > 0 || imageParams.border.bottom > 0) {
		if (imageParams.border.left === imageParams.border.top && imageParams.border.top === imageParams.border.right && imageParams.border.right == imageParams.border.bottom) {
			newUrl += `/border:${imageParams.border.color ?? '00000000'}:${imageParams.border.left}`;
		} else if (imageParams.border.left === imageParams.border.right && imageParams.border.top == imageParams.border.bottom) {
			newUrl += `/border:${imageParams.border.color}:${imageParams.border.left}:${imageParams.border.top}`;
		} else {
			newUrl += `/border:${imageParams.border.color}:${imageParams.border.left}:${imageParams.border.top}:${imageParams.border.right}:${imageParams.border.bottom}`;
		}
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

	if (imageParams.redact.faces.length > 0 || imageParams.redact.people.length > 0 || imageParams.redact.regions.length > 0) {
		if (imageParams.redact.faces.length > 0) {
			newUrl += `/redact:faces:${imageParams.redact.faces.join(',')}`;
		}

		if (imageParams.redact.people.length > 0) {
			newUrl += `/redact:people:${imageParams.redact.people.join(',')}`;
		}

		if (imageParams.redact.regions.length > 0) {
			for(const region of imageParams.redact.regions) {
				if (region.width > 0 && region.height > 0) {
					newUrl += `/redact:region:${region.left},${region.top},${region.width},${region.height}`;
				}
			}
		}

		if (imageParams.redact.blur > 0) {
			newUrl += `/redact:blur:${imageParams.redact.blur}`;
		}

		if (imageParams.redact.useColor) {
			newUrl += `/redact:color:${imageParams.redact.color}`;
		}

		if (imageParams.redact.pixelate > 0) {
			newUrl += `/redact:pixelate:${imageParams.redact.pixelate}`;
		}

		if (imageParams.redact.expandMask > 0) {
			newUrl += `/redact:mask:expand:${imageParams.redact.expandMask}`;
		}

		if (imageParams.redact.blurMask > 0) {
			newUrl += `/redact:mask:blur:${imageParams.redact.blurMask}`;
		}

		if (imageParams.redact.pixelateMask > 0) {
			newUrl += `/redact:mask:pixelate:${imageParams.redact.pixelateMask}`;
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
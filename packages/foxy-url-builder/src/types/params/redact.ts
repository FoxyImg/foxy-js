import type {BaseParam, BuiltParams, ComposableParam} from "../params";

export type Rect = {
	left: number,
	top: number,
	width: number,
	height: number,
}

export type RedactRect = Rect & {
	cornerRadius: number,
	rotation: number,
}

export type RedactParams = BaseParam & {
	faces: string[],
	people: string[],
	regions: RedactRect[],
	blur: number,
	expandMask: number,
	blurMask: number,
	pixelateMask: number,
	useColor: boolean,
	color: string|null,
	pixelate: number,
	cornerRadius: number,
}

export const DefaultRedactParams: RedactParams = {
	enabled: true,
	faces: [],
	people: [],
	regions: [],
	blur: 0,
	expandMask: 0,
	pixelateMask: 0,
	blurMask: 0,
	useColor: false,
	color: null,
	pixelate: 0,
	cornerRadius: 0,
}


export const useRedactParam:ComposableParam<RedactParams> = () => {
	function buildParams(urlParams: BuiltParams, params:RedactParams) {
		if (!params.enabled) {
			return urlParams;
		}

		if (params.faces.length === 0 && params.people.length === 0 && params.regions.length === 0) {
			return urlParams;
		}

		if (params.faces.length > 0) {
			urlParams['redact:faces'] = `/redact:faces:${params.faces.join(',')}`;
		}

		if (params.people.length > 0) {
			urlParams['redact:people'] = `/redact:people:${params.people.join(',')}`;
		}

		if (params.regions.length > 0) {
			for(const region of params.regions) {
				if (region.width > 0 && region.height > 0) {
					urlParams['redact:region'] = `/redact:region:${region.cornerRadius ?? 0}:${region.rotation ?? 0}:${region.left},${region.top},${region.width},${region.height}`;
				}
			}
		}

		if (params.blur > 0) {
			urlParams['redact:blur'] = `${params.blur}`;
		}

		if (params.useColor) {
			urlParams['redact:color'] = params.color;
		}

		if (params.pixelate > 0) {
			urlParams['redact:pixelate'] = `${params.pixelate}`;
		}

		if (params.expandMask > 0) {
			urlParams['redact:mask:expand'] = `${params.expandMask}`;
		}

		if (params.blurMask > 0) {
			urlParams['redact:mask:blur'] = `${params.blurMask}`;
		}

		if (params.pixelateMask > 0) {
			urlParams['redact:mask:pixelate'] = `${params.pixelateMask}`;
		}

		return urlParams;
	}

	function importParams(foxyParams:any, params:RedactParams) {
	}

	return {
		buildParams,
		importParams,
	}
}
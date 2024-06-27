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

export type FoxyRedactParams = {
	faces?: number[],
	people?: number[],
	regions?: RedactRect[],
	blur?: number,
	expandMask?: number,
	blurMask?: number,
	pixelateMask?: number,
	useColor?: boolean,
	color?: string,
	pixelate?: number,
	cornerRadius?: number,
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


export const useRedactParam:ComposableParam<RedactParams, FoxyRedactParams> = () => {
	function buildParams(urlParams: BuiltParams, params:RedactParams) {
		if (!params.enabled) {
			return urlParams;
		}

		if (params.faces.length === 0 && params.people.length === 0 && params.regions.length === 0) {
			return urlParams;
		}

		if (params.faces.length > 0) {
			urlParams['redact:faces'] = `${params.faces.join(',')}`;
		}

		if (params.people.length > 0) {
			urlParams['redact:people'] = `${params.people.join(',')}`;
		}

		if (params.regions.length > 0) {
			let currentRegionIdx = 0;
			for(const region of params.regions) {
				if (region.width > 0 && region.height > 0) {
					urlParams[`redact:region:${currentRegionIdx}`] = `${region.cornerRadius ?? 0}:${region.rotation ?? 0}:${region.left},${region.top},${region.width},${region.height}`;
					currentRegionIdx++;
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

	function importParams(foxyParams:FoxyRedactParams):RedactParams {
		const faces = foxyParams.faces ? foxyParams.faces.map(face => face === -1 ? 'all' : `${face}`) : DefaultRedactParams.faces;
		const people = foxyParams.people ? foxyParams.people.map(person => person === -1 ? 'all' : `${person}`) : DefaultRedactParams.people;

		return {
			enabled: true,
			faces,
			people,
			regions: foxyParams.regions ?? DefaultRedactParams.regions,
			blur: foxyParams.blur ?? DefaultRedactParams.blur,
			expandMask: foxyParams.expandMask ?? DefaultRedactParams.expandMask,
			blurMask: foxyParams.blurMask ?? DefaultRedactParams.blurMask,
			pixelateMask: foxyParams.pixelateMask ?? DefaultRedactParams.pixelateMask,
			useColor: foxyParams.useColor ?? DefaultRedactParams.useColor,
			color: foxyParams.color ?? DefaultRedactParams.color,
			pixelate: foxyParams.pixelate ?? DefaultRedactParams.pixelate,
			cornerRadius: foxyParams.cornerRadius ?? DefaultRedactParams.cornerRadius,
		}
	}

	return {
		buildParams,
		importParams,
	}
}

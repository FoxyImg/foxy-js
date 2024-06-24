import type {BaseParam, BuiltParams, ComposableParam, ImageParams} from "../params";

export type BorderParams = BaseParam & {
	color: string|null,
	left: number,
	top: number,
	right: number,
	bottom: number,
}

export const DefaultBorderParams:BorderParams = {
	enabled: true,
	color: null,
	left: 0,
	top: 0,
	right: 0,
	bottom: 0,
}

export const useAbstractBorderParam = (prefix:string) => {
	function buildParams(urlParams: BuiltParams, params:BorderParams) {
		if (params.left > 0 || params.top > 0 || params.right > 0 || params.bottom > 0) {
			if (params.left === params.top && params.top === params.right && params.right == params.bottom) {
				urlParams[prefix] = `${params.color ?? '00000000'}:${params.left}`;
			} else if (params.left === params.right && params.top == params.bottom) {
				urlParams[prefix] = `${params.color ?? '00000000'}:${params.left}:${params.top}`;
			} else {
				urlParams[prefix] = `${params.color ?? '00000000'}:${params.left}:${params.top}:${params.right}:${params.bottom}`;
			}
		}

		return urlParams;
	}

	function importParams(foxyParams:any, params:BorderParams) {
	}

	return {
		buildParams,
		importParams,
	}
}

import type {BaseParam, BuiltParams, ComposableParam} from "../params";
import {z} from "zod";

type BaseBorderParams = {
	color: string|null,
	left: number,
	top: number,
	right: number,
	bottom: number,
}

export type BorderParams = BaseParam & BaseBorderParams;
export type FoxyBorderParams = Partial<BaseBorderParams>;

export const BorderSchema = z.object({
	enabled: z.boolean().optional(),
	color: z.string().nullable().optional(),
	left: z.number().optional(),
	top: z.number().optional(),
	right: z.number().optional(),
	bottom: z.number().optional(),
});

export const DefaultBorderParams:BorderParams = {
	enabled: true,
	color: null,
	left: 0,
	top: 0,
	right: 0,
	bottom: 0,
}

export const useAbstractBorderParam:ComposableParam<BorderParams, FoxyBorderParams> = (prefix?:string) => {
	function buildParams(urlParams: BuiltParams, params:BorderParams) {
		if (!prefix || !params.enabled) {
			return urlParams;
		}

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

	function importParams(foxyParams:FoxyBorderParams):BorderParams {
		return {
			...DefaultBorderParams,
			...foxyParams,
		}
	}

	return {
		buildParams,
		importParams,
	}
}

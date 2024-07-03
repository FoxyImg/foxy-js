import type {BaseParam, BuiltParams, ComposableParam} from "../params";
import {base64} from "@foxyimg/utils";
import {z} from "zod";

export const MaskTypeOptions = [
	{ label: 'Image', value: 'image' },
	{ label: 'Rect', value: 'rect' },
	{ label: 'Square', value: 'square' },
	{ label: 'Ellipse', value: 'ellipse' },
	{ label: 'Circle', value: 'circle' },
]

export const MaskFitOptions = [
	{ label: 'Fit', value: 'fit' },
	{ label: 'Fill', value: 'fill' },
	{ label: 'Stretch', value: 'stretch' },
]

type BaseMaskParams = {
	type: 'image' | 'rect' | 'square' | 'ellipse' | 'circle',
	imageKey: string|null,
	cornerRadius: number,
	fit: 'fit' | 'fill' | 'stretch',
}

export type MaskParams = BaseParam & BaseMaskParams;
export type FoxyMaskParams = Partial<BaseMaskParams>;

export const MaskSchema = z.object({
	enabled: z.boolean().optional(),
	type: z.union([z.literal('image'), z.literal('rect'), z.literal('square'), z.literal('ellipse'), z.literal('circle')]).optional(),
	imageKey: z.string().nullable().optional(),
	cornerRadius: z.number().optional(),
	fit: z.union([z.literal('fit'), z.literal('fill'), z.literal('stretch')]).optional(),
});

export const DefaultMaskParams: MaskParams = {
	enabled: false,
	type: 'circle',
	imageKey: null,
	cornerRadius: 0,
	fit: 'fit',
}

export const useMaskParam:ComposableParam<MaskParams, FoxyMaskParams> = () => {
	function buildParams(urlParams: BuiltParams, params:MaskParams) {
		if (!params.enabled) {
			return urlParams;
		}

		if (params.type === 'image' && params.imageKey) {
			urlParams['mask'] = `image:${base64(params.imageKey, true)}:${params.fit}`;
		} else if (params.type === 'rect') {
			urlParams['mask'] = `rect:${params.cornerRadius}`;
		} else if (params.type === 'square') {
			urlParams['mask'] = `square:${params.cornerRadius}`;
		} else {
			urlParams['mask'] = params.type;
		}

		return urlParams;
	}

	function importParams(foxyParams:FoxyMaskParams):MaskParams {
		return {
			...DefaultMaskParams,
			...foxyParams,
		}
	}

	return {
		buildParams,
		importParams,
	}
}

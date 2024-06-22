import type {BaseParam, BuiltParams, ComposableParam, ImageParams} from "@/types/params";
import base64 from "@/utils/base-64";

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

export type MaskParams = BaseParam & {
	type: 'image' | 'rect' | 'square' | 'ellipse' | 'circle',
	imageKey: string|null,
	cornerRadius: number,
	fit: 'fit' | 'fill' | 'stretch',
}

export const DefaultMaskParams: MaskParams = {
	enabled: false,
	type: 'circle',
	imageKey: null,
	cornerRadius: 0,
	fit: 'fit',
}

export const useMaskParam:ComposableParam<MaskParams> = () => {
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

	function importParams(foxyParams:any, params:MaskParams) {
	}

	return {
		buildParams,
		importParams,
	}
}
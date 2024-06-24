import type {BaseParam, BuiltParams, ComposableParam, ImageParams} from "@/types/params";
import base64 from "@/utils/base-64";

export type RotationParams = BaseParam & {
	rotation: number,
	mode: string
}

export const DefaultRotationParams: RotationParams = {
	enabled: true,
	rotation: 0,
	mode: 'none',
}

export const RotationModeOptions = [
	{ label: 'None', value: 'none' },
	{ label: 'Fit', value: 'fit' },
	{ label: 'Fill', value: 'fill' },
]

export const RotationOptions = [
	{ label: 'None', value: 0 },
	{ label: '90', value: 90 },
	{ label: '180', value: 180 },
	{ label: '270', value: 270 },
]

export const useRotationParam:ComposableParam<RotationParams> = () => {
	function buildParams(urlParams: BuiltParams, params:RotationParams) {
		if (!params.enabled) {
			return urlParams;
		}

		if (params.rotation !== 0) {
			let rotationVal = `${params.rotation}`;
			if (params.mode !== 'none') {
				rotationVal += `:${params.mode}`;
			}

			urlParams['rot'] = rotationVal;
		}

		return urlParams;
	}

	function importParams(foxyParams:any, params:RotationParams) {
	}

	return {
		buildParams,
		importParams,
	}
}
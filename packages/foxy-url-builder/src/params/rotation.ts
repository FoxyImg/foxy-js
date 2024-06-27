import type {BaseParam, BuiltParams, ComposableParam} from "../params";

type BaseRotationParams = {
	rotation: number,
	mode: string
}

export type RotationParams = BaseParam & BaseRotationParams;
export type FoxyRotationParams = Partial<BaseRotationParams>;

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

export const useRotationParam:ComposableParam<RotationParams, FoxyRotationParams> = () => {
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

	function importParams(foxyParams:FoxyRotationParams):RotationParams {
		return {
			...DefaultRotationParams,
			...foxyParams,
		}
	}

	return {
		buildParams,
		importParams,
	}
}

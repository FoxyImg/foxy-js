import type {BaseParam, BuiltParams, ComposableParam} from "../params";

type BaseSourceCropParams = {
	x: number,
	y: number,
	width: number,
	height: number,
}

export type SourceCropParams = BaseParam & BaseSourceCropParams;
export type FoxySourceCropParams = Partial<BaseSourceCropParams>;

export const DefaultSourceCropParams: SourceCropParams = {
	enabled: true,
	x: 0,
	y: 0,
	width: 0,
	height: 0,
}

export const useSourceCropParam:ComposableParam<SourceCropParams, FoxySourceCropParams> = () => {
	function buildParams(urlParams: BuiltParams, params:SourceCropParams) {
		if (params.enabled && params.width > 0 && params.height > 0) {
			urlParams['src'] = [
				params.x,
				params.y,
				params.width,
				params.height
			].join(":");
		}

		return urlParams;
	}

	function importParams(foxyParams:FoxySourceCropParams):SourceCropParams {
		return {
			...DefaultSourceCropParams,
			...foxyParams,
		}
	}

	return {
		buildParams,
		importParams,
	}
}

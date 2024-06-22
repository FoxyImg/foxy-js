import type {BaseParam, BuiltParams, ComposableParam, ImageParams} from "@/types/params";

export type SourceCropParams = BaseParam & {
	x: number,
	y: number,
	width: number,
	height: number,
}

export const DefaultSourceCropParams: SourceCropParams = {
	enabled: true,
	x: 0,
	y: 0,
	width: 0,
	height: 0,
}

export const useSourceCropParam:ComposableParam<SourceCropParams> = () => {
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

	function importParams(foxyParams:any, params:SourceCropParams) {
	}

	return {
		buildParams,
		importParams,
	}
}
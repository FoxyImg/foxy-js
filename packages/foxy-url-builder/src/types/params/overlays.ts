import type {BaseParam, BuiltParams, ComposableParam} from "../params";
import {type OverlayParams, useOverlayParam} from "./overlay";

export type OverlaysParams = BaseParam & {
	encode: boolean,
	overlays: OverlayParams[],
}

export const DefaultOverlaysParam: OverlaysParams = {
	encode: true,
	enabled: true,
	overlays: [],
}

export const useOverlaysParam:ComposableParam<OverlaysParams> = () => {
	function buildParams(urlParams: BuiltParams, params:OverlaysParams) {
		if (!params.enabled) {
			return urlParams;
		}

		let actualIndex = 0;
		for(const overlay of params.overlays) {
			if (!overlay.enabled) {
				continue;
			}

			const overlayParam = useOverlayParam(`ov:${actualIndex}`);
			overlayParam.buildParams(urlParams, overlay);
			actualIndex++;
		}

		return urlParams;
	}

	function importParams(foxyParams:any, params:OverlaysParams) {
	}

	return {
		buildParams,
		importParams,
	}
}
import type {BaseParam, BuiltParams, ComposableParam} from "../params";
import {FoxyOverlayParams, OverlaySchema, type OverlayParams, useOverlayParam} from "./overlay";
import {z} from "zod";

export type OverlaysParams = BaseParam & {
	encode: boolean,
	overlays: OverlayParams[],
}

export const OverlaysSchema = z.object({
	enabled: z.boolean().optional(),
	overlays: z.array(OverlaySchema).optional(),
});

export type FoxyOverlaysParams = BaseParam & {
	overlays: FoxyOverlayParams[],
}

export const DefaultOverlaysParam: OverlaysParams = {
	encode: true,
	enabled: true,
	overlays: [],
}

export const useOverlaysParam:ComposableParam<OverlaysParams, FoxyOverlaysParams> = () => {
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

	function importParams(foxyParams:FoxyOverlaysParams):OverlaysParams {
		const overlayParam = useOverlayParam("");
		const overlays:OverlayParams[] = [];
		if (foxyParams.overlays) {
			for(const overlay of foxyParams.overlays) {
				overlays.push(overlayParam.importParams(overlay));
			}
		}

		return {
			...DefaultOverlaysParam,
			...foxyParams,
			overlays,
		}
	}

	return {
		buildParams,
		importParams,
	}
}

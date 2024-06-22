import type {BaseParam, BuiltParams, ComposableParam, ImageParams} from "@/types/params";
import base64 from "@/utils/base-64";

export type AdjustmentsParams = BaseParam & {
	brightness: number,
	saturation: number,
	hue: number,
	contrast: number,
	exposure: number,
	gamma: number,
	vibrance: number,
	invert: boolean,
	texture: number,
	textureDensity: number,
}

export const DefaultAdjustmentsParams: AdjustmentsParams = {
	enabled: true,
	brightness: 100,
	saturation: 100,
	contrast: 1,
	exposure: 0,
	gamma: 1,
	hue: 0,
	vibrance: 0,
	invert: false,
	texture: 0,
	textureDensity: 100,
}

export const useAdjustmentsParam:ComposableParam<AdjustmentsParams> = () => {
	function buildParams(urlParams: BuiltParams, params:AdjustmentsParams) {
		if (!params.enabled) {
			return urlParams;
		}

		if (params.brightness !== 100) {
			urlParams['bri'] = `${params.brightness}`;
		}

		if (params.saturation !== 100) {
			urlParams['sat'] = `${params.saturation}`;
		}

		if (params.hue !== 0) {
			urlParams['hue'] = `${params.hue}`;
		}

		if (params.contrast !== 1) {
			urlParams['con'] = `${params.contrast}`;
		}

		if (params.exposure !== 0) {
			urlParams['exp'] = `${params.exposure}`;
		}

		if (params.gamma !== 1) {
			urlParams['gamma'] = `${params.gamma}`;
		}

		if (params.vibrance > 0) {
			urlParams['vib'] = `${params.vibrance}`;
		}

		if (params.texture > 0) {
			let textureVal = `${params.texture}`;
			if (params.textureDensity < 100) {
				textureVal += `:${params.textureDensity}`;
			}

			urlParams['texture'] = textureVal;
		}

		if (params.invert) {
			urlParams['invert'] = "true"
		}

		return urlParams;
	}

	function importParams(foxyParams:any, params:AdjustmentsParams) {
	}

	return {
		buildParams,
		importParams,
	}
}
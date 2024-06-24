import type {BaseParam, BuiltParams, ComposableParam, ImageParams} from "../params";
import base64 from "../../utils/base-64";

export type BackgroundRemovalParams = BaseParam & {
	mode: 'photoroom' | 'clipdrop' | 'fg' | 'person',
	imageKey: string|null,
	backgroundColor: string|null,
}

export const DefaultBackgroundRemovalParams: BackgroundRemovalParams = {
	enabled: false,
	mode: 'fg',
	imageKey: null,
	backgroundColor: null,
}

export const BackgroundRemovalModeOptions = [
	{ label: 'Photoroom', value: 'photoroom' },
	{ label: 'ClipDrop', value: 'clipdrop' },
	{ label: 'Foreground', value: 'fg' },
	{ label: 'Person', value: 'person' },
]

export const useBackgroundRemovalParam:ComposableParam<BackgroundRemovalParams> = () => {
	function buildParams(urlParams: BuiltParams, params:BackgroundRemovalParams) {
		console.log('builtParams, background removal', params)
		if (!params.enabled) {
			return urlParams;
		}

		if (params.imageKey) {
			urlParams['bgr:img'] = `${params.mode}:${base64(params.imageKey, true)}`;
		} else if (params.backgroundColor) {
			urlParams['bgr:c'] = `${params.mode}:${params.backgroundColor}`;
		}

		return urlParams;
	}

	function importParams(foxyParams:any, params:BackgroundRemovalParams) {
	}

	return {
		buildParams,
		importParams,
	}
}
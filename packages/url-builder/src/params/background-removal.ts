import type {BaseParam, BuiltParams, ComposableParam} from "../params";
import base64 from "../utils/base-64";
import {z} from "zod";

export type BackgroundRemovalParams = BaseParam & {
	enabled: boolean,
	mode: 'photoroom' | 'clipdrop' | 'fg' | 'person',
	imageKey: string|null,
	backgroundColor: string|null,
}

export type FoxyBackgroundRemovalParams = Partial<BackgroundRemovalParams>;

export const BackgroundRemovalSchema = z.object({
	enabled: z.boolean().optional(),
	mode: z.union([z.literal('photoroom'), z.literal('clipdrop'), z.literal('fg'), z.literal('person')]).default('fg').optional(),
	imageKey: z.string().nullable().default(null).optional(),
	backgroundColor: z.string().nullable().default(null).optional(),
});

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

export const useBackgroundRemovalParam:ComposableParam<BackgroundRemovalParams, FoxyBackgroundRemovalParams> = () => {
	function buildParams(urlParams: BuiltParams, params:BackgroundRemovalParams) {
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

	function importParams(foxyParams:FoxyBackgroundRemovalParams):BackgroundRemovalParams {
		return {
			...DefaultBackgroundRemovalParams,
			...foxyParams,
		}
	}

	return {
		buildParams,
		importParams,
	}
}

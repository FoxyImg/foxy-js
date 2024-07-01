import type {BaseParam, BuiltParams, ComposableParam} from "../params";
import {DeepPartial} from "../deep-partial";
import {z} from "zod";

export type ChannelLevelsParams = BaseParam & {
	shadows: number,
	mid: number,
	highlights: number,
}
export type FoxyChannelLevelsParams = Partial<ChannelLevelsParams>;

export const ChannelLevelsSchema = z.object({
	enabled: z.boolean().optional(),
	shadows: z.number().optional(),
	mid: z.number().optional(),
	highlights: z.number().optional(),
});

export const DefaultChannelLevelsParams: ChannelLevelsParams = {
	enabled: true,
	shadows: 0,
	mid: 50,
	highlights: 255,
}

type BaseLevelsParams = {
	all: ChannelLevelsParams,
	red: ChannelLevelsParams,
	green: ChannelLevelsParams,
	blue: ChannelLevelsParams,
}

export type LevelsParams = BaseParam & BaseLevelsParams;
export type FoxyLevelsParams = DeepPartial<BaseLevelsParams>;

export const LevelsSchema = z.object({
	enabled: z.boolean().optional(),
	all: ChannelLevelsSchema.optional(),
	red: ChannelLevelsSchema.optional(),
	green: ChannelLevelsSchema.optional(),
	blue: ChannelLevelsSchema.optional(),
});

export const DefaultLevelsParams: LevelsParams = {
	enabled: true,
	all: { ...DefaultChannelLevelsParams },
	red: { ...DefaultChannelLevelsParams },
	green: { ...DefaultChannelLevelsParams },
	blue: { ...DefaultChannelLevelsParams },
}

export const useChannelLevelsParam:ComposableParam<ChannelLevelsParams, FoxyChannelLevelsParams> = (prefix?:string) => {
	function buildParams(urlParams: BuiltParams, params:ChannelLevelsParams) {
		if (!params.enabled || prefix === undefined) {
			return urlParams;
		}

		if (params.shadows === 0 && params.mid === 50 && params.highlights === 255) {
			return urlParams;
		}

		const mid = Math.floor((params.mid / 100) * (params.highlights - params.shadows));

		urlParams[`${prefix}`] = `${params.shadows.toFixed(0)}:${mid.toFixed(0)}:${params.highlights.toFixed(0)}`;

		return urlParams;
	}

	function importParams(foxyParams:FoxyChannelLevelsParams):ChannelLevelsParams {
		return {
			...DefaultChannelLevelsParams,
			...foxyParams,
		}
	}

	return {
		buildParams,
		importParams,
	}
}

export const useLevelsParam:ComposableParam<LevelsParams, FoxyLevelsParams> = () => {
	const allChannels = useChannelLevelsParam('l:all');
	const redChannel = useChannelLevelsParam('l:r');
	const greenChannel = useChannelLevelsParam('l:g');
	const blueChannel = useChannelLevelsParam('l:b');

	function buildParams(urlParams: BuiltParams, params:LevelsParams) {
		if (!params.enabled) {
			return urlParams;
		}

		allChannels.buildParams(urlParams, params.all);
		redChannel.buildParams(urlParams, params.red);
		greenChannel.buildParams(urlParams, params.green);
		blueChannel.buildParams(urlParams, params.blue);

		return urlParams;
	}

	function importParams(foxyParams:FoxyLevelsParams):LevelsParams {
		return {
			enabled: true,
			all: {...DefaultChannelLevelsParams, ...foxyParams.all},
			red: {...DefaultChannelLevelsParams, ...foxyParams.red},
			green: {...DefaultChannelLevelsParams, ...foxyParams.green},
			blue: {...DefaultChannelLevelsParams, ...foxyParams.blue},
		}
	}

	return {
		buildParams,
		importParams,
	}
}


import type {BaseParam, BuiltParams, ComposableParam} from "../params";

export type ChannelLevelsParams = BaseParam & {
	shadows: number,
	mid: number,
	highlights: number,
}

export const DefaultChannelLevelsParams: ChannelLevelsParams = {
	enabled: true,
	shadows: 0,
	mid: 50,
	highlights: 255,
}

export type LevelsParams = BaseParam & {
	all: ChannelLevelsParams,
	red: ChannelLevelsParams,
	green: ChannelLevelsParams,
	blue: ChannelLevelsParams,
}

export const DefaultLevelsParams: LevelsParams = {
	enabled: true,
	all: { ...DefaultChannelLevelsParams },
	red: { ...DefaultChannelLevelsParams },
	green: { ...DefaultChannelLevelsParams },
	blue: { ...DefaultChannelLevelsParams },
}

export const useChannelLevelsParam:ComposableParam<ChannelLevelsParams> = (prefix?:string) => {
	function buildParams(urlParams: BuiltParams, params:ChannelLevelsParams) {
		if (!params.enabled || prefix === undefined) {
			return urlParams;
		}

		if (params.shadows === 0 && params.mid === 50 && params.highlights === 255) {
			return urlParams;
		}

		const mid = Math.floor((params.mid / 100.0) * (params.highlights - params.shadows));

		urlParams[`${prefix}`] = `${params.shadows.toFixed(0)}:${mid.toFixed(0)}:${params.highlights.toFixed(0)}`;

		return urlParams;
	}

	function importParams(foxyParams:any, params:ChannelLevelsParams) {
	}

	return {
		buildParams,
		importParams,
	}
}

export const useLevelsParam:ComposableParam<LevelsParams> = () => {
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

	function importParams(foxyParams:any, params:LevelsParams) {
	}

	return {
		buildParams,
		importParams,
	}
}


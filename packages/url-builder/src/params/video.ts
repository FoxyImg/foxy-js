import type {BaseParam, BuiltParams, ComposableParam} from "../params";
import {z} from "zod";

export const VideoOutputModeOptions = [
	{ label: 'Frame', value: 'frame' },
	{ label: 'Storyboard', value: 'storyboard' },
]

export const VideoFrameTypeOptions = [
	{ label: 'Time', value: 'time' },
	{ label: 'Frame', value: 'frame' },
	{ label: 'Keyframe', value: 'key' },
	{ label: 'Relative', value: 'rel' },
]

type BaseVideoParams = {
	type: "frame" | "storyboard"
	frameType: "time" | "frame" | "rel" | "key"
	frame: number,
	keyframe: number,
	time: number,
	relativeTime: number,
	cols: number,
	rows: number,
	largestDimension: number,
}

export type VideoParams = BaseParam & BaseVideoParams;
export type FoxyVideoParams = Partial<BaseVideoParams>;

export const VideoSchema = z.object({
	enabled: z.boolean().optional(),
	type: z.union([z.literal('frame'), z.literal('storyboard')]).optional(),
	frameType: z.union([z.literal('time'), z.literal('frame'), z.literal('rel')]).optional(),
	frame: z.number().optional(),
	keyframe: z.number().optional(),
	time: z.number().optional(),
	relativeTime: z.number().optional(),
	cols: z.number().optional(),
	rows: z.number().optional(),
	largestDimension: z.number().optional(),
});

export const DefaultVideoParams: VideoParams = {
	enabled: true,
	type: 'frame',
	frameType: 'rel',
	frame: 0,
	keyframe: 0,
	time: 0,
	relativeTime: 50,
	cols: 10,
	rows: 10,
	largestDimension: 256,
}

export const useVideoParam:ComposableParam<VideoParams, FoxyVideoParams> = () => {
	function buildParams(urlParams: BuiltParams, params:VideoParams) {
		if (!params.enabled) {
			return urlParams;
		}

		if (params.type === 'frame') {
			if (params.frameType === 'time') {
				urlParams['video'] = `frame:time:${params.time}`;
			} else if (params.frameType === 'key') {
				urlParams['video'] = `frame:key:${params.keyframe}`;
			} else if (params.frameType === 'rel') {
				urlParams['video'] = `frame:rel:${params.relativeTime}`;
			} else {
				urlParams['video'] = `frame:frame:${params.frame}`;
			}
		} else if (params.type === 'storyboard') {
			urlParams['video'] = `sb:${params.cols}:${params.rows}:${params.largestDimension}`;
		}

		return urlParams;
	}

	function importParams(foxyParams:FoxyVideoParams):VideoParams {
		return {
			...DefaultVideoParams,
			...foxyParams,
		}
	}

	return {
		buildParams,
		importParams,
	}
}

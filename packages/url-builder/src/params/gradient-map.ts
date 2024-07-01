import type {BaseParam, BuiltParams, ComposableParam} from "../params";
import {z} from "zod";

export const enum BlendModes {
	BlendModeClear = 0,
	BlendModeSource = 1,
	BlendModeOver = 2,
	BlendModeIn = 3,
	BlendModeOut = 4,
	BlendModeAtop = 5,
	BlendModeDest = 6,
	BlendModeDestOver = 7,
	BlendModeDestIn = 8,
	BlendModeDestOut = 9,
	BlendModeDestAtop = 10,
	BlendModeXOR = 11,
	BlendModeAdd = 12,
	BlendModeSaturate = 13,
	BlendModeMultiply = 14,
	BlendModeScreen = 15,
	BlendModeOverlay = 16,
	BlendModeDarken = 17,
	BlendModeLighten = 18,
	BlendModeColorDodge = 19,
	BlendModeColorBurn = 20,
	BlendModeHardLight = 21,
	BlendModeSoftLight = 22,
	BlendModeDifference = 23,
	BlendModeExclusion = 24,
}

export const BlendModeOptions = [
	{ label: 'Clear', value: BlendModes.BlendModeClear },
	{ label: 'Source', value: BlendModes.BlendModeSource },
	{ label: 'Over', value: BlendModes.BlendModeOver },
	{ label: 'In', value: BlendModes.BlendModeIn },
	{ label: 'Out', value: BlendModes.BlendModeOut },
	{ label: 'Atop', value: BlendModes.BlendModeAtop },
	{ label: 'Dest', value: BlendModes.BlendModeDest },
	{ label: 'Dest Over', value: BlendModes.BlendModeDestOver },
	{ label: 'Dest In', value: BlendModes.BlendModeDestIn },
	{ label: 'Dest Out', value: BlendModes.BlendModeDestOut },
	{ label: 'Dest Atop', value: BlendModes.BlendModeDestAtop },
	{ label: 'XOR', value: BlendModes.BlendModeXOR },
	{ label: 'Add', value: BlendModes.BlendModeAdd },
	{ label: 'Saturate', value: BlendModes.BlendModeSaturate },
	{ label: 'Multiply', value: BlendModes.BlendModeMultiply },
	{ label: 'Screen', value: BlendModes.BlendModeScreen },
	{ label: 'Overlay', value: BlendModes.BlendModeOverlay },
	{ label: 'Darken', value: BlendModes.BlendModeDarken },
	{ label: 'Lighten', value: BlendModes.BlendModeLighten },
	{ label: 'Color Dodge', value: BlendModes.BlendModeColorDodge },
	{ label: 'Color Burn', value: BlendModes.BlendModeColorBurn },
	{ label: 'Hard Light', value: BlendModes.BlendModeHardLight },
	{ label: 'Soft Light', value: BlendModes.BlendModeSoftLight },
	{ label: 'Difference', value: BlendModes.BlendModeDifference },
	{ label: 'Exclusion', value: BlendModes.BlendModeExclusion },
];

export type GradientStops = BaseParam & {
	stop: number,
	color: string,
}

export const GradientStopsSchema = z.object({
	enabled: z.boolean().optional(),
	stop: z.number().optional(),
	color: z.string().optional(),
});

export const DefaultGradientStops: GradientStops = {
	enabled: true,
	stop: 0,
	color: '#000000',
}

type BaseGradientMapParams = {
	stops: GradientStops[],
	opacity: number,
	monochrome: boolean,
	blur: number,
	blendMode: BlendModes,
}

export type GradientMapParams = BaseParam & BaseGradientMapParams;
export type FoxyGradientMapParams = Partial<BaseGradientMapParams>;

export const GradientMapSchema = z.object({
	enabled: z.boolean().optional(),
	stops: z.array(GradientStopsSchema).optional(),
	monochrome: z.boolean().optional(),
	blur: z.number().optional(),
	blendMode: z.number().optional(),
	opacity: z.number().optional(),
});

export const DefaultGradientMapParams: GradientMapParams = {
	enabled: true,
	monochrome: true,
	blur: 0,
	stops: [
		{ enabled: true, stop: 0, color: '#000000' },
		{ enabled: true, stop: 100, color: '#ffffff' },
	],
	opacity: 0,
	blendMode: BlendModes.BlendModeOver,
}

export const useGradientMapParam:ComposableParam<GradientMapParams, FoxyGradientMapParams> = () => {
	function buildParams(urlParams: BuiltParams, params:GradientMapParams) {
		if (!params.enabled || params.opacity === 0) {
			return urlParams;
		}

		if (!params.monochrome) {
			urlParams['gm:mono'] = 'false';
		}

		if (params.blur > 0) {
			urlParams['gm:blur'] = `${params.blur}`;
		}

		if (params.blendMode !== BlendModes.BlendModeOver) {
			urlParams['gm:blend'] = `${params.blendMode}`;
		}

		urlParams['gm:opacity'] = `${params.opacity}`;

		const stops:string[] = [];
		for(const stop of params.stops) {
			if (stop.enabled) {
				stops.push(`${Math.floor(stop.stop).toFixed(0)},${stop.color.replaceAll('#', '')}`);
			}
		}

		if (stops.length > 0) {
			urlParams['gm:stops'] = stops.join(':');
		}

		return urlParams;
	}

	function importParams(foxyParams:FoxyGradientMapParams):GradientMapParams {
		const stops:GradientStops[] = foxyParams.stops ? foxyParams.stops.map((stop:GradientStops) => {
			return {
				...DefaultGradientStops,
				...stop,
			}
		}) : [];

		return {
			...DefaultGradientMapParams,
			...foxyParams,
			stops,
		}
	}

	return {
		buildParams,
		importParams,
	}
}

import type {DeepPartial} from "./deep-partial";
import {type SourceCropParams, DefaultSourceCropParams, FoxySourceCropParams, useSourceCropParam} from "./params/source-crop";
import {type SizingParams, DefaultSizingParams, FoxySizingParams, useSizingParam} from "./params/sizing";
import {
	type BackgroundRemovalParams,
	DefaultBackgroundRemovalParams,
	FoxyBackgroundRemovalParams, useBackgroundRemovalParam
} from "./params/background-removal";
import {type RotationParams, DefaultRotationParams, FoxyRotationParams, useRotationParam} from "./params/rotation";
import {type AdjustmentsParams, DefaultAdjustmentsParams, FoxyAdjustmentsParams, useAdjustmentsParam} from "./params/adjustments";
import {type StylizeParams, DefaultStylizeParams, FoxyStylizeParams, useStylizeParam} from "./params/stylize";
import {
	type GradientMapParams,
	DefaultGradientMapParams,
	FoxyGradientMapParams,
	useGradientMapParam
} from "./params/gradient-map";
import {type BorderParams, DefaultBorderParams, FoxyBorderParams} from "./params/abstract-border";
import {type MaskParams, DefaultMaskParams, FoxyMaskParams, useMaskParam} from "./params/mask";
import {type RedactParams, DefaultRedactParams, FoxyRedactParams, useRedactParam} from "./params/redact";
import {type ExportParams, DefaultExportParams, FoxyExportParams, useExportParam} from "./params/export";
import {type OverlaysParams, DefaultOverlaysParam, FoxyOverlaysParams, useOverlaysParam} from "./params/overlays";
import {
	type ChannelLevelsParams,
	type LevelsParams,
	DefaultChannelLevelsParams,
	DefaultLevelsParams, FoxyLevelsParams, useLevelsParam
} from "./params/levels";
import {DebugParams, DefaultDebugParams, FoxyDebugParams, useDebugParam} from "./params/debug";
import {usePaddingParam} from "./params/padding";
import {useBorderParam} from "./params/border";

export type BuiltParams = { [key:string] : string|null}
export type ParamBuilder<T> = (urlParams:BuiltParams, params:T) => BuiltParams;
export type ParamImporter<F,T> = (foxyParams:F) => T;
export type ComposableParam<T,F> = (prefix?:string) => { buildParams:ParamBuilder<T>, importParams:ParamImporter<F,T> };

export type BaseParam = {
	enabled: boolean,
}

export type ImageParams = {
	metaOnly: boolean,
	showPreset: boolean,

	backgroundRemoval: BackgroundRemovalParams,
	sourceCrop: SourceCropParams,
	sizing: SizingParams,
	rotation: RotationParams,
	adjustments: AdjustmentsParams,
	stylize: StylizeParams,
	gradientMap: GradientMapParams,
	padding: BorderParams,
	border: BorderParams,
	mask: MaskParams,
	redact: RedactParams,
	export: ExportParams,
	overlays: OverlaysParams,
	levels: LevelsParams,
	debug: DebugParams,

	backgroundColor: string|null,
}

export type FoxyImageParams = {
	backgroundRemoval?: FoxyBackgroundRemovalParams,
	sourceCrop?: FoxySourceCropParams,
	sizing?: FoxySizingParams,
	rotation?: FoxyRotationParams,
	adjustments?: FoxyAdjustmentsParams,
	stylize?: FoxyStylizeParams,
	gradientMap?: FoxyGradientMapParams,
	padding?: FoxyBorderParams,
	border?: FoxyBorderParams,
	mask?: FoxyMaskParams,
	redact?: FoxyRedactParams,
	export?: FoxyExportParams,
	overlays?: FoxyOverlaysParams,
	levels?: FoxyLevelsParams,
	debug?: FoxyDebugParams,

	background?: {
		color?: string,
	}
}

export type FoxyPreset = {
	version: number,
	params: FoxyImageParams,
}

export type PartialImageParams = DeepPartial<ImageParams>;

export const DefaultImageParams: ImageParams = {
	metaOnly: false,
	showPreset: false,

	backgroundColor: null,

	backgroundRemoval: {...DefaultBackgroundRemovalParams},
	sourceCrop: {...DefaultSourceCropParams},
	sizing: {...DefaultSizingParams},
	rotation: {...DefaultRotationParams},
	adjustments: {...DefaultAdjustmentsParams},
	stylize: {...DefaultStylizeParams},
	gradientMap: {...DefaultGradientMapParams},
	padding: {...DefaultBorderParams},
	border: {...DefaultBorderParams},
	mask: {...DefaultMaskParams},
	redact: {...DefaultRedactParams},
	export: {...DefaultExportParams},
	levels: {...DefaultLevelsParams},
	overlays: {...DefaultOverlaysParam},
	debug: {...DefaultDebugParams},
}

export function getImageParams(partialParams:PartialImageParams):ImageParams {
	return {
		metaOnly: !!partialParams.metaOnly,
		showPreset: !!partialParams.showPreset,

		backgroundColor: partialParams.backgroundColor ?? null,

		backgroundRemoval: {...DefaultBackgroundRemovalParams, ...(partialParams.backgroundRemoval ?? {})},
		sourceCrop: {...DefaultSourceCropParams, ...(partialParams.sourceCrop ?? {})},
		sizing: {...DefaultSizingParams, ...(<SizingParams>partialParams.sizing ?? {})},
		rotation: {...DefaultRotationParams, ...(partialParams.rotation ?? {})},
		adjustments: {...DefaultAdjustmentsParams, ...(partialParams.adjustments ?? {})},
		stylize: {...DefaultStylizeParams, ...(<StylizeParams>partialParams.stylize ?? {})},
		gradientMap: {...DefaultGradientMapParams, ...(<GradientMapParams>partialParams.gradientMap ?? {})},
		padding: {...DefaultBorderParams, ...(partialParams.padding ?? {})},
		border: {...DefaultBorderParams, ...(partialParams.border ?? {})},
		mask: {...DefaultMaskParams, ...(partialParams.mask ?? {})},
		redact: {...DefaultRedactParams, ...(<RedactParams>partialParams.redact ?? {})},
		levels: {
			enabled: !!partialParams.levels?.enabled,
			all: { ...DefaultChannelLevelsParams, ...(<ChannelLevelsParams>partialParams.levels?.all ?? {}) },
			red: { ...DefaultChannelLevelsParams, ...(<ChannelLevelsParams>partialParams.levels?.red ?? {}) },
			green: { ...DefaultChannelLevelsParams, ...(<ChannelLevelsParams>partialParams.levels?.green ?? {}) },
			blue: { ...DefaultChannelLevelsParams, ...(<ChannelLevelsParams>partialParams.levels?.blue ?? {}) },
		},
		export: {...DefaultExportParams, ...(partialParams.export ?? {})},
		overlays: {...DefaultOverlaysParam, ...(<OverlaysParams>partialParams.overlays ?? {})},
		debug: {...DefaultDebugParams, ...(partialParams.debug ?? {})},
	}
}

export function importFoxyImageParams(foxyParams:FoxyImageParams):ImageParams {
	console.log('importFoxyImageParams', foxyParams);

	const sourceCropParam = useSourceCropParam();
	const sizingParam = useSizingParam();
	const backgroundRemovalParam = useBackgroundRemovalParam();
	const rotationParam = useRotationParam();
	const adjustmentsParam  = useAdjustmentsParam();
	const stylizeParam = useStylizeParam();
	const gradientMapParam = useGradientMapParam();
	const paddingParam = usePaddingParam()
	const borderParam = useBorderParam()
	const maskParam = useMaskParam();
	const redactParam = useRedactParam();
	const exportParam = useExportParam()
	const overlaysParam = useOverlaysParam();
	const levelsParam = useLevelsParam();
	const debugParam = useDebugParam();

	const result = {
		metaOnly: false,
		showPreset: false,

		backgroundColor: foxyParams.background?.color ?? null,

		backgroundRemoval: foxyParams.backgroundRemoval ? backgroundRemovalParam.importParams(foxyParams.backgroundRemoval) : {...DefaultBackgroundRemovalParams},
		sourceCrop: foxyParams.sourceCrop ? sourceCropParam.importParams(foxyParams.sourceCrop) : {...DefaultSourceCropParams},
		sizing: foxyParams.sizing ? sizingParam.importParams(foxyParams.sizing) : {...DefaultSizingParams},
		rotation: foxyParams.rotation ? rotationParam.importParams(foxyParams.rotation) : {...DefaultRotationParams},
		adjustments: foxyParams.adjustments ? adjustmentsParam.importParams(foxyParams.adjustments) : {...DefaultAdjustmentsParams},
		stylize: foxyParams.stylize ? stylizeParam.importParams(foxyParams.stylize) : {...DefaultStylizeParams},
		gradientMap: foxyParams.gradientMap ? gradientMapParam.importParams(foxyParams.gradientMap) : {...DefaultGradientMapParams},
		padding: foxyParams.padding ? paddingParam.importParams(foxyParams.padding) : {...DefaultBorderParams},
		border: foxyParams.border ? borderParam.importParams(foxyParams.border) : {...DefaultBorderParams},
		mask: foxyParams.mask ? maskParam.importParams(foxyParams.mask) : {...DefaultMaskParams},
		redact: foxyParams.redact ? redactParam.importParams(foxyParams.redact) : {...DefaultRedactParams},
		export: foxyParams.export ? exportParam.importParams(foxyParams.export) : {...DefaultExportParams},
		levels: foxyParams.levels ? levelsParam.importParams(foxyParams.levels) : {...DefaultLevelsParams},
		overlays: foxyParams.overlays ? overlaysParam.importParams(foxyParams.overlays) : {...DefaultOverlaysParam},
		debug: foxyParams.debug ? debugParam.importParams(foxyParams.debug) : {...DefaultDebugParams},
	}

	console.log('importFoxyImageParams', result);
	return result;
}

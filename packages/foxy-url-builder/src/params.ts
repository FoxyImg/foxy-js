import type {DeepPartial} from "./deep-partial";
import {type SourceCropParams, DefaultSourceCropParams} from "./params/source-crop";
import {type SizingParams,DefaultSizingParams} from "./params/sizing";
import {type BackgroundRemovalParams, DefaultBackgroundRemovalParams} from "./params/background-removal";
import {type RotationParams, DefaultRotationParams} from "./params/rotation";
import {type AdjustmentsParams, DefaultAdjustmentsParams} from "./params/adjustments";
import {type StylizeParams, DefaultStylizeParams} from "./params/stylize";
import {type GradientMapParams, DefaultGradientMapParams} from "./params/gradient-map";
import {type BorderParams, DefaultBorderParams} from "./params/abstract-border";
import {type MaskParams, DefaultMaskParams} from "./params/mask";
import {type RedactParams, DefaultRedactParams} from "./params/redact";
import {type ExportParams, DefaultExportParams} from "./params/export";
import {type OverlaysParams, DefaultOverlaysParam} from "./params/overlays";
import {
	type ChannelLevelsParams,
	type LevelsParams,
	DefaultChannelLevelsParams,
	DefaultLevelsParams
} from "./params/levels";
import {DebugParams, DefaultDebugParams} from "./params/debug";

export type BuiltParams = { [key:string] : string|null}
export type ParamBuilder<T> = (urlParams:BuiltParams, params:T) => BuiltParams;
export type ParamImporter<T> = (foxyParams:any, params:T) => void;
export type ComposableParam<T> = (prefix?:string) => { buildParams:ParamBuilder<T>, importParams:ParamImporter<T> };

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

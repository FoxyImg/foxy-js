import {DefaultSourceCropParams, type SourceCropParams} from "./params/source-crop";
import {DefaultSizingParams, type SizingParams} from "./params/sizing";
import {type BackgroundRemovalParams, DefaultBackgroundRemovalParams} from "./params/background-removal";
import {DefaultRotationParams, type RotationParams} from "./params/rotation";
import {type AdjustmentsParams, DefaultAdjustmentsParams} from "./params/adjustments";
import {DefaultStylizeParams, type StylizeParams} from "./params/stylize";
import {DefaultGradientMapParams, type GradientMapParams} from "./params/gradient-map";
import {type BorderParams, DefaultBorderParams} from "./params/abstract-border";
import {DefaultMaskParams, type MaskParams} from "./params/mask";
import {DefaultRedactParams, type RedactParams} from "./params/redact";
import {DefaultExportParams, type ExportParams} from "./params/export";
import {DefaultOverlaysParam, type OverlaysParams} from "./params/overlays";
import type {DeepPartial} from "./deep-partial";
import {
	type ChannelLevelsParams,
	DefaultChannelLevelsParams,
	DefaultLevelsParams,
	type LevelsParams
} from "./params/levels";

export type BuiltParams = { [key:string] : string|null}
export type ParamBuilder<T> = (urlParams:BuiltParams, params:T) => BuiltParams;
export type ParamImporter<T> = (foxyParams:any, params:T) => void;
export type ComposableParam<T> = (prefix?:string) => { buildParams:ParamBuilder<T>, importParams:ParamImporter<T> };

export type BaseParam = {
	enabled: boolean,
}

export type ImageParams = {
	metaOnly: boolean,

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

	backgroundColor: string|null,
}

export type PartialImageParams = DeepPartial<ImageParams>;

export type DebugParams = {
	faces: boolean,
	allFaces: boolean,
	people: boolean,
	allPeople: boolean,
	otherLabels: boolean,

	disableSourceCache: boolean,
	disableMetaCache: boolean,
	disableRenderCache: boolean,
}

export const DefaultImageParams: ImageParams = {
	metaOnly: false,

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
}

export function getImageParams(partialParams:PartialImageParams):ImageParams {
	return {
		metaOnly: !!partialParams.metaOnly,

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
	}
}
import {z} from "zod";
import type {DeepPartial} from "./deep-partial";
import {
	type SourceCropParams,
	DefaultSourceCropParams,
	FoxySourceCropParams,
	useSourceCropParam,
	SourceCropSchema
} from "./params/source-crop";
import {type SizingParams, DefaultSizingParams, FoxySizingParams, useSizingParam, SizingSchema} from "./params/sizing";
import {
	type BackgroundRemovalParams, BackgroundRemovalSchema,
	DefaultBackgroundRemovalParams,
	FoxyBackgroundRemovalParams, useBackgroundRemovalParam
} from "./params/background-removal";
import {
	type RotationParams,
	DefaultRotationParams,
	FoxyRotationParams,
	useRotationParam,
	RotationSchema
} from "./params/rotation";
import {
	type AdjustmentsParams,
	AdjustmentsSchema,
	DefaultAdjustmentsParams,
	FoxyAdjustmentsParams,
	useAdjustmentsParam
} from "./params/adjustments";
import {type StylizeParams, DefaultStylizeParams, FoxyStylizeParams, useStylizeParam, StylizeSchema} from "./params/stylize";
import {
	type GradientMapParams,
	DefaultGradientMapParams,
	FoxyGradientMapParams,
	useGradientMapParam, GradientMapSchema
} from "./params/gradient-map";
import {type BorderParams, BorderSchema, DefaultBorderParams, FoxyBorderParams} from "./params/abstract-border";
import {type MaskParams, DefaultMaskParams, FoxyMaskParams, useMaskParam, MaskSchema} from "./params/mask";
import {type RedactParams, DefaultRedactParams, FoxyRedactParams, useRedactParam, RedactSchema} from "./params/redact";
import {type ExportParams, DefaultExportParams, FoxyExportParams, useExportParam, ExportSchema} from "./params/export";
import {type OverlaysParams, DefaultOverlaysParam, FoxyOverlaysParams, useOverlaysParam, OverlaysSchema} from "./params/overlays";
import {
	type ChannelLevelsParams,
	type LevelsParams,
	DefaultChannelLevelsParams,
	DefaultLevelsParams, FoxyLevelsParams, useLevelsParam, LevelsSchema
} from "./params/levels";
import {DebugParams, DebugSchema, DefaultDebugParams, FoxyDebugParams, useDebugParam} from "./params/debug";
import {usePaddingParam} from "./params/padding";
import {useBorderParam} from "./params/border";
import {DefaultVideoParams, FoxyVideoParams, useVideoParam, VideoParams, VideoSchema} from "./params/video";

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

	video: VideoParams,
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

export const ImageParamsSchema = z.object({
	metaOnly: z.boolean().optional(),
	showPreset: z.boolean().optional(),

	video: VideoSchema.optional(),
	backgroundRemoval: BackgroundRemovalSchema.optional(),
	sourceCrop: SourceCropSchema.optional(),
	sizing: SizingSchema.optional(),
	rotation: RotationSchema.optional(),
	adjustments: AdjustmentsSchema.optional(),
	stylize: StylizeSchema.optional(),
	gradientMap: GradientMapSchema.optional(),
	padding: BorderSchema.optional(),
	border: BorderSchema.optional(),
	mask: MaskSchema.optional(),
	redact: RedactSchema.optional(),
	export: ExportSchema.optional(),
	overlays: OverlaysSchema.optional(),
	levels: LevelsSchema.optional(),
	debug: DebugSchema.optional(),
	backgroundColor: z.string().nullable().optional(),
});

export type FoxyImageParams = {
	video?: FoxyVideoParams,
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

	video: {...DefaultVideoParams},
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

		video: {...DefaultVideoParams, ...(<VideoParams>partialParams.video ?? {})},

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
	const sourceCropParam = useSourceCropParam();
	const videoParam = useVideoParam();
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

	return {
		metaOnly: false,
		showPreset: false,

		backgroundColor: foxyParams.background?.color ?? null,

		video: foxyParams.video ? videoParam.importParams(foxyParams.video) : {...DefaultVideoParams},
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
}

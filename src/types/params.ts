import {DefaultSourceCropParams, type SourceCropParams} from "@/composables/params/source-crop";
import {DefaultSizingParams, type SizingParams} from "@/composables/params/sizing";
import {type BackgroundRemovalParams, DefaultBackgroundRemovalParams} from "@/composables/params/background-removal";
import {DefaultRotationParams, type RotationParams} from "@/composables/params/rotation";
import {type AdjustmentsParams, DefaultAdjustmentsParams} from "@/composables/params/adjustments";
import {DefaultStylizeParams, type StylizeParams} from "@/composables/params/stylize";
import {DefaultGradientMapParams, type GradientMapParams} from "@/composables/params/gradient-map";
import {type BorderParams, DefaultBorderParams} from "@/composables/params/abstract-border";
import {DefaultMaskParams, type MaskParams} from "@/composables/params/mask";
import {DefaultRedactParams, type RedactParams} from "@/composables/params/redact";
import {DefaultExportParams, type ExportParams} from "@/composables/params/export";
import {DefaultOverlaysParam, type OverlaysParams} from "@/composables/params/overlays";

export type BuiltParams = { [key:string] : string|null}
export type ParamBuilder<T> = (urlParams:BuiltParams, params:T) => BuiltParams;
export type ParamImporter<T> = (foxyParams:any, params:T) => void;
export type ComposableParam<T> = (prefix?:string) => { buildParams:ParamBuilder<T>, importParams:ParamImporter<T> };

export type BaseParam = {
	enabled: boolean,
}

export type ImageParams = {
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

	backgroundColor: string|null,
}

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
	overlays: {...DefaultOverlaysParam},
}

export function buildImageParams(imageParams: Partial<ImageParams>) {
	return Object.assign(JSON.parse(JSON.stringify(DefaultImageParams)), imageParams);
}
import type {BaseParam, BuiltParams, ComposableParam} from "@/types/params";
import type {SourceCropParams} from "@/composables/params/source-crop";

export const ExportFormatOptions = [
	{ label: 'WebP', value: 'webp' },
	{ label: 'PNG', value: 'png' },
	{ label: 'JPG', value: 'jpg' },
	{ label: 'AVIF', value: 'avif' },
]

export type ExportParams = BaseParam & {
	format: string,
	quality: number,
	reductionEffort: number,
	lossless: boolean,
	nearLossless: boolean,
}

export const DefaultExportParams: ExportParams = {
	enabled: true,
	format: 'webp',
	quality: 85,
	reductionEffort: 4,
	lossless: false,
	nearLossless: false,
}

export const useExportParam:ComposableParam<ExportParams> = () => {
	function buildParams(urlParams: BuiltParams, params:ExportParams) {
		if (params.format !== 'webp') {
			urlParams['fmt'] = params.format;
		}

		if (params.quality !== 85) {
			urlParams['q'] = `${params.quality}`;
		}

		if (params.format === 'webp' && params.reductionEffort !== 4) {
			urlParams['reduction'] = `:${params.reductionEffort}`;
		}

		if (params.lossless) {
			urlParams['lossless'] = `1`;
		}

		if (params.nearLossless) {
			urlParams['nloss'] = `1`;
		}

		return urlParams;
	}

	function importParams(foxyParams:any, params:ExportParams) {
	}

	return {
		buildParams,
		importParams,
	}
}
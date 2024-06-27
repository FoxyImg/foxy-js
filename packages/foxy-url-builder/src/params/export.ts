import type {BaseParam, BuiltParams, ComposableParam} from "../params";

export const ExportFormatOptions = [
	{ label: 'WebP', value: 'webp' },
	{ label: 'PNG', value: 'png' },
	{ label: 'JPG', value: 'jpg' },
	{ label: 'AVIF', value: 'avif' },
]

type BaseExportParams = {
	format: string,
	quality: number,
	reductionEffort: number,
	lossless: boolean,
	nearLossless: boolean,
}

export type ExportParams = BaseParam & BaseExportParams;
export type FoxyExportParams = Partial<BaseExportParams>;

export const DefaultExportParams: ExportParams = {
	enabled: true,
	format: 'webp',
	quality: 85,
	reductionEffort: 4,
	lossless: false,
	nearLossless: false,
}

export const useExportParam:ComposableParam<ExportParams, FoxyExportParams> = () => {
	function buildParams(urlParams: BuiltParams, params:ExportParams) {
		if (params.format !== 'webp') {
			urlParams['fmt'] = params.format;
		}

		if (params.quality !== 85) {
			urlParams['q'] = `${params.quality}`;
		}

		if (params.format === 'webp' && params.reductionEffort && params.reductionEffort !== 4) {
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

	function importParams(foxyParams:FoxyExportParams):ExportParams {
		return {
			...DefaultExportParams,
			...foxyParams,
		}
	}

	return {
		buildParams,
		importParams,
	}
}

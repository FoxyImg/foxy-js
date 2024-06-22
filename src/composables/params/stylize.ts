import type {BaseParam, BuiltParams, ComposableParam, ImageParams} from "@/types/params";

export const StylizeOrderOptions = [
	{ label: 'Blur', value: 'blur' },
	{ label: 'Pixelate', value: 'px' },
];

export type StylizeParams = BaseParam & {
	order: string[],
	blur: number,
	pixelate: number,
}

export const DefaultStylizeParams: StylizeParams = {
	enabled: true,
	blur: 0,
	pixelate: 0,
	order: ['blur', 'px'],
}

export const useStylizeParam:ComposableParam<StylizeParams> = () => {
	function buildParams(urlParams: BuiltParams, params:StylizeParams) {
		if (!params.enabled) {
			return urlParams;
		}

		let hasStyle = params.blur > 0 && params.pixelate > 0;
		if (params.blur > 0) {
			urlParams['blur'] = `${params.blur}`;
		}

		if (params.pixelate > 0) {
			urlParams['px'] = `${params.pixelate}`;
		}

		if (hasStyle) {
			urlParams['stylize:order'] = params.order.join(',');
		}

		return urlParams;
	}

	function importParams(foxyParams:any, params:StylizeParams) {
	}

	return {
		buildParams,
		importParams,
	}
}
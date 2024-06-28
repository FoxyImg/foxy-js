import type {BaseParam, BuiltParams, ComposableParam} from "../params";

export const StylizeOrderOptions = [
	{ label: 'Blur', value: 'blur' },
	{ label: 'Pixelate', value: 'px' },
];

type BaseStylizeParams = {
	order: string[],
	blur: number,
	pixelate: number,
}

export type StylizeParams = BaseParam & BaseStylizeParams;
export type FoxyStylizeParams = Partial<BaseStylizeParams>;

export const DefaultStylizeParams: StylizeParams = {
	enabled: true,
	blur: 0,
	pixelate: 0,
	order: ['blur', 'px'],
}

export const useStylizeParam:ComposableParam<StylizeParams, FoxyStylizeParams> = () => {
	function buildParams(urlParams: BuiltParams, params:StylizeParams) {
		if (!params.enabled) {
			return urlParams;
		}

		if (params.blur > 0) {
			urlParams['blur'] = `${params.blur}`;
		}

		if (params.pixelate > 0) {
			urlParams['px'] = `${params.pixelate}`;
		}

		if (params.blur > 0 && params.pixelate > 0) {
			urlParams['stylize:order'] = params.order.join(',');
		}

		return urlParams;
	}

	function importParams(foxyParams:FoxyStylizeParams):StylizeParams {
		return {
			...DefaultStylizeParams,
			...foxyParams,
		}
	}

	return {
		buildParams,
		importParams,
	}
}
